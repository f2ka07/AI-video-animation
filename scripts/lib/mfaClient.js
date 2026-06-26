// Montreal Forced Aligner wrapper: local CLI or official Docker image.

const fs = require('fs');
const path = require('path');
const { execFile } = require('child_process');
const { promisify } = require('util');
const { parseTextGrid } = require('./parseTextGrid.js');
const { getMfaConfig } = require('./resolveMfa.js');
const { runMfaDockerAlign } = require('./mfaDocker.js');

const execFileAsync = promisify(execFile);

const WORK_ROOT = path.join(__dirname, '../../workspace/.mfa-align');

function ensureWorkRoot() {
	if (!fs.existsSync(WORK_ROOT)) {
		fs.mkdirSync(WORK_ROOT, { recursive: true });
	}
}

function sanitizeSlideId(slideName) {
	return slideName.replace(/[^a-zA-Z0-9_-]+/g, '_').slice(0, 80);
}

function findTextGrid(outputDir, audioBaseName) {
	const stem = path.parse(audioBaseName).name;
	const textGridCandidates = [
		path.join(outputDir, `${stem}.TextGrid`),
		path.join(outputDir, `${audioBaseName}.TextGrid`),
		path.join(outputDir, 'audio.TextGrid'),
	];

	let textGridPath = textGridCandidates.find((p) => fs.existsSync(p));
	if (!textGridPath) {
		const files = fs.readdirSync(outputDir).filter((f) => f.endsWith('.TextGrid'));
		textGridPath = files.length ? path.join(outputDir, files[0]) : null;
	}
	return textGridPath;
}

async function runLocalMfaAlign(jobDir, audioPath, dictionary, acousticModel, bin, timeoutMs) {
	const audioBase = path.basename(audioPath);
	const transcriptPath = path.join(jobDir, 'transcript.txt');
	const outputDir = path.join(jobDir, 'output');

	const tryAlign = async (subcommand) => {
		await execFileAsync(
			bin,
			[
				subcommand,
				audioPath,
				transcriptPath,
				dictionary,
				acousticModel,
				outputDir,
				'--clean',
				'--overwrite',
				'--single_speaker',
			],
			{
				timeout: timeoutMs,
				windowsHide: true,
				cwd: jobDir,
				maxBuffer: 10 * 1024 * 1024,
			}
		);
	};

	try {
		await tryAlign('align_one');
	} catch (error) {
		const detail = String(error.stderr || error.message || '');
		if (/align_one|unrecognized|invalid choice/i.test(detail)) {
			await tryAlign('align_single');
		} else {
			throw error;
		}
	}

	return findTextGrid(outputDir, audioBase);
}

async function callMfaAlignSingle(audioPath, transcript, slideName, options = {}) {
	if (!fs.existsSync(audioPath)) {
		throw new Error(`Audio file not found: ${audioPath}`);
	}

	const config = getMfaConfig();
	const mode = options.mode || 'local';
	const bin = options.bin || config.bin;
	const dictionary = options.dictionary || config.dictionary;
	const acousticModel = options.acousticModel || config.acousticModel;
	const timeoutMs = options.timeoutMs ?? config.timeoutMs;

	ensureWorkRoot();
	const jobDir = path.join(WORK_ROOT, `${sanitizeSlideId(slideName)}-${Date.now()}`);
	const outputDir = path.join(jobDir, 'output');
	fs.mkdirSync(outputDir, { recursive: true });

	const audioBase = path.basename(audioPath);
	const jobAudioPath = path.join(jobDir, 'audio.wav');
	fs.copyFileSync(audioPath, jobAudioPath);
	fs.writeFileSync(path.join(jobDir, 'transcript.txt'), transcript.trim() + '\n', 'utf-8');

	let textGridPath;

	try {
		if (mode === 'docker') {
			await runMfaDockerAlign(jobDir, dictionary, acousticModel, timeoutMs);
			textGridPath = findTextGrid(outputDir, 'audio.wav');
		} else {
			textGridPath = await runLocalMfaAlign(
				jobDir,
				jobAudioPath,
				dictionary,
				acousticModel,
				bin,
				timeoutMs
			);
		}
	} catch (error) {
		const stderr = error.stderr ? String(error.stderr).trim() : '';
		const stdout = error.stdout ? String(error.stdout).trim() : '';
		const detail = stderr || stdout || error.message;
		throw new Error(`MFA alignment failed: ${detail.slice(0, 800)}`);
	}

	if (!textGridPath) {
		throw new Error(`MFA did not produce a TextGrid in ${outputDir}`);
	}

	const content = fs.readFileSync(textGridPath, 'utf-8');
	const words = parseTextGrid(content);

	try {
		fs.rmSync(jobDir, { recursive: true, force: true });
	} catch {
		// Best-effort cleanup
	}

	if (words.length === 0) {
		throw new Error('MFA TextGrid contained no word intervals');
	}

	return words;
}

module.exports = {
	callMfaAlignSingle,
	WORK_ROOT,
};
