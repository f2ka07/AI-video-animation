// Run Montreal Forced Aligner via docker compose run (ephemeral jobs, shared model volume).
// Gentle/Remotion use `docker compose up`; MFA never uses `up` — only `compose run`.

const fs = require('fs');
const path = require('path');
const { execFile } = require('child_process');
const { promisify } = require('util');
const {
	isInsideDockerContainer,
	formatDockerConnectionHelp,
} = require('./dockerEnv.js');

const execFileAsync = promisify(execFile);

const DEFAULT_IMAGE = process.env.MFA_DOCKER_IMAGE || 'mmcauliffe/montreal-forced-aligner:latest';
const MFA_ROOT_IN_CONTAINER = process.env.MFA_DOCKER_ROOT || '/home/mfauser/Documents/MFA';
const LOCK_PATH = path.join(__dirname, '../../workspace/.mfa-docker.lock');

let volumePrepared = false;

function getComposeFilePath() {
	return path.join(__dirname, '../../docker-compose.yml');
}

function getModelVolumeName() {
	if (process.env.MFA_DOCKER_MODEL_VOLUME) {
		return process.env.MFA_DOCKER_MODEL_VOLUME;
	}
	return 'my-slides_mfa-models';
}

function toDockerVolumePath(absPath) {
	const resolved = path.resolve(absPath);
	if (process.platform === 'win32') {
		return resolved.replace(/\\/g, '/');
	}
	return resolved;
}

function buildComposeRunArgs({ entrypoint, user, extraRunArgs = [], commandArgs = [] }) {
	const args = [
		'compose',
		'--profile',
		'mfa',
		'-f',
		getComposeFilePath(),
		'run',
		'--rm',
		'-T',
		'--no-deps',
		'--entrypoint',
		entrypoint,
	];
	if (user) {
		args.push('--user', user);
	}
	args.push(...extraRunArgs, 'mfa', ...commandArgs);
	return args;
}

function isLockHolderAlive(lockPid) {
	if (!lockPid || Number.isNaN(lockPid)) {
		return false;
	}
	try {
		process.kill(lockPid, 0);
		return true;
	} catch {
		return false;
	}
}

function acquireDockerLock() {
	const lockDir = path.dirname(LOCK_PATH);
	if (!fs.existsSync(lockDir)) {
		fs.mkdirSync(lockDir, { recursive: true });
	}

	if (fs.existsSync(LOCK_PATH)) {
		const raw = fs.readFileSync(LOCK_PATH, 'utf-8').trim().split('\n');
		const lockPid = parseInt(raw[0], 10);
		const ageMs = Date.now() - fs.statSync(LOCK_PATH).mtimeMs;
		if (isLockHolderAlive(lockPid)) {
			throw new Error(
				'Another MFA alignment is already running. Wait for it to finish (about 1-3 minutes per slide).'
			);
		}
		if (ageMs < 30 * 60 * 1000) {
			console.warn(`Removing stale MFA lock (pid ${lockPid} not running).`);
		}
		fs.unlinkSync(LOCK_PATH);
	}

	fs.writeFileSync(LOCK_PATH, `${process.pid}\n${Date.now()}\n`, 'utf-8');
}

function releaseDockerLock() {
	try {
		fs.unlinkSync(LOCK_PATH);
	} catch {
		// Best-effort.
	}
}

async function probeDocker(timeoutMs = 10000) {
	if (isInsideDockerContainer() && process.env.MFA_ALLOW_DOCKER_FROM_CONTAINER !== '1') {
		return {
			ok: false,
			error:
				'MFA Docker is disabled inside the slides-app container. ' +
				'Run gui-server on the Windows host, use Gentle in Compose, or set MFA_ALLOW_DOCKER_FROM_CONTAINER=1 with docker.sock mounted.',
		};
	}

	console.log('Checking Docker engine...');
	try {
		await execFileAsync('docker', ['version', '--format', '{{.Server.Version}}'], {
			timeout: timeoutMs,
			windowsHide: true,
		});
		return { ok: true };
	} catch (error) {
		const detail = String(error.stderr || error.message || '').trim();
		return {
			ok: false,
			error: detail || 'Docker is not running or not installed',
			help: formatDockerConnectionHelp(detail),
		};
	}
}

async function probeMfaDockerImage(timeoutMs = 15000) {
	console.log(`Checking for MFA image ${DEFAULT_IMAGE}...`);
	try {
		await execFileAsync(
			'docker',
			['image', 'inspect', DEFAULT_IMAGE, '--format', '{{.Id}}'],
			{ timeout: timeoutMs, windowsHide: true }
		);
		return true;
	} catch {
		return false;
	}
}

async function resolveMfaDocker(options = {}) {
	const timeoutMs = options.timeoutMs ?? 15000;
	const dockerProbe = await probeDocker(timeoutMs);
	if (!dockerProbe.ok) {
		return {
			available: false,
			mode: 'docker',
			error: dockerProbe.error,
			help: dockerProbe.help || formatDockerConnectionHelp(dockerProbe.error),
			image: DEFAULT_IMAGE,
			modelVolume: getModelVolumeName(),
		};
	}

	let imageReady = await probeMfaDockerImage(timeoutMs);
	if (!imageReady && options.pull !== false) {
		console.log(`Pulling MFA Docker image ${DEFAULT_IMAGE} (first time may take several minutes)...`);
		try {
			await execFileAsync('docker', ['pull', DEFAULT_IMAGE], {
				timeout: Math.max(timeoutMs, 120000),
				windowsHide: true,
				maxBuffer: 10 * 1024 * 1024,
			});
			imageReady = true;
		} catch (error) {
			return {
				available: false,
				mode: 'docker',
				error: `Failed to pull ${DEFAULT_IMAGE}: ${error.message}`,
				image: DEFAULT_IMAGE,
				modelVolume: getModelVolumeName(),
			};
		}
	}

	return {
		available: imageReady,
		mode: 'docker',
		image: DEFAULT_IMAGE,
		modelVolume: getModelVolumeName(),
		mfaRootInContainer: MFA_ROOT_IN_CONTAINER,
		version: imageReady ? `docker:${DEFAULT_IMAGE}` : null,
		error: imageReady ? null : `Docker image not found: ${DEFAULT_IMAGE}`,
	};
}

function isDockerComposeProgressOutput(text) {
	const value = String(text || '').trim();
	if (!value) {
		return true;
	}
	const progressPatterns = [
		/\bContainer\b.*\b(Creating|Created|Starting|Started|Running|Stopping|Stopped|Removing|Removed|Waiting)\b/i,
		/\bVolume\b.*\b(Creating|Created)\b/i,
		/\bNetwork\b.*\b(Creating|Created)\b/i,
		/\bPulling\b/i,
		/\bDigest:\b/i,
		/\bStatus:\s*Downloaded\b/i,
	];
	return progressPatterns.some((pattern) => pattern.test(value));
}

async function execDockerCommand(command, args, timeoutMs = 600000) {
	try {
		const { stdout, stderr } = await execFileAsync(command, args, {
			timeout: timeoutMs,
			windowsHide: true,
			maxBuffer: 10 * 1024 * 1024,
		});
		if (stdout && String(stdout).trim()) {
			process.stdout.write(String(stdout));
		}
		if (stderr && String(stderr).trim() && !isDockerComposeProgressOutput(stderr)) {
			process.stderr.write(String(stderr));
		}
	} catch (error) {
		const stderr = error.stderr ? String(error.stderr).trim() : '';
		const stdout = error.stdout ? String(error.stdout).trim() : '';
		const detail = stderr || stdout || error.message;
		throw new Error(detail.slice(0, 1200));
	}
}

async function prepareMfaDockerVolume({ force = false } = {}) {
	if (volumePrepared && !force) {
		return;
	}

	console.log('Preparing MFA model volume permissions...');
	const initScript = `mkdir -p "${MFA_ROOT_IN_CONTAINER}" && chown -R mfauser:mfauser "${MFA_ROOT_IN_CONTAINER}"`;
	await execDockerCommand(
		'docker',
		buildComposeRunArgs({
			entrypoint: 'bash',
			user: 'root',
			commandArgs: ['-c', initScript],
		}),
		120000
	);
	volumePrepared = true;
}

async function runMfaDockerAlign(jobDir, dictionary, acousticModel, timeoutMs) {
	acquireDockerLock();
	const hostJob = toDockerVolumePath(jobDir);

	try {
		console.log('   Docker MFA align_one starting (often 1-3 min per slide)...');
		await execDockerCommand(
			'docker',
			buildComposeRunArgs({
				entrypoint: 'mfa',
				extraRunArgs: ['-v', `${hostJob}:/job`],
				commandArgs: [
					'align_one',
					'/job/audio.wav',
					'/job/transcript.txt',
					dictionary,
					acousticModel,
					'/job/output',
					'--clean',
					'--overwrite',
					'--single_speaker',
				],
			}),
			timeoutMs
		);
	} finally {
		releaseDockerLock();
	}
}

async function ensureMfaDockerModels(dictionary, acousticModel, timeoutMs = 600000) {
	await prepareMfaDockerVolume({ force: true });

	for (const [kind, name] of [
		['acoustic', acousticModel],
		['dictionary', dictionary],
	]) {
		console.log(`Downloading MFA ${kind} model: ${name}...`);
		await execDockerCommand(
			'docker',
			buildComposeRunArgs({
				entrypoint: 'mfa',
				commandArgs: ['model', 'download', kind, name],
			}),
			timeoutMs
		);
	}

	await prepareMfaDockerVolume({ force: true });
}

async function bootstrapMfaDockerForExtraction() {
	await prepareMfaDockerVolume();
}

module.exports = {
	DEFAULT_IMAGE,
	getModelVolumeName,
	resolveMfaDocker,
	runMfaDockerAlign,
	ensureMfaDockerModels,
	prepareMfaDockerVolume,
	bootstrapMfaDockerForExtraction,
	probeDocker,
};
