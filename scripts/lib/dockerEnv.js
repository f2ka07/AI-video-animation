// Detect how Node can reach Docker and produce actionable errors for common mismatches.

const fs = require('fs');

function isInsideDockerContainer() {
	return fs.existsSync('/.dockerenv') || process.env.RUNNING_IN_DOCKER === '1';
}

function isWsl() {
	if (process.platform !== 'linux') {
		return false;
	}
	try {
		if (fs.existsSync('/proc/version')) {
			const version = fs.readFileSync('/proc/version', 'utf-8');
			return /microsoft|wsl/i.test(version);
		}
	} catch {
		// ignore
	}
	return Boolean(process.env.WSL_DISTRO_NAME || process.env.WSL_INTEROP);
}

function dockerSocketExists() {
	return fs.existsSync('/var/run/docker.sock');
}

function formatDockerConnectionHelp(errorMessage) {
	const msg = String(errorMessage || '');
	const lines = ['Docker CLI cannot reach the Docker engine.'];

	if (isInsideDockerContainer()) {
		lines.push(
			'',
			'You are running inside the slides-app container (or another container).',
			'That container does not have access to the host Docker API unless /var/run/docker.sock is mounted.',
			'',
			'Fix options:',
			'  1. Run the GUI on the Windows host: npm run gui  (then use MFA from the dashboard)',
			'  2. Use Gentle for timings while the stack runs in Compose (GENTLE_URL=http://gentle:8765)',
			'  3. Mount the Docker socket into the app service (see docker-compose.yml comment on DOCKER_SOCK)'
		);
		return lines.join('\n');
	}

	if (isWsl() && !dockerSocketExists()) {
		lines.push(
			'',
			'You are in WSL/Linux, but /var/run/docker.sock is missing.',
			'Docker Desktop can be open on Windows while WSL still has no engine socket.',
			'',
			'Fix options:',
			'  1. Docker Desktop -> Settings -> Resources -> WSL Integration -> enable your distro',
			'  2. Or run MFA commands from Windows PowerShell (not WSL): npm run mfa:download-models',
			'  3. Or set: docker context use default   (if using Windows docker.exe from PowerShell)'
		);
		return lines.join('\n');
	}

	if (/dockerDesktopLinuxEngine|docker_engine|docker\.sock/i.test(msg)) {
		lines.push(
			'',
			'Docker Desktop UI may be open while the CLI context/engine is not connected.',
			'',
			'Fix options:',
			'  1. Wait until Docker Desktop shows "Engine running" (not just the window open)',
			'  2. Restart Docker Desktop',
			'  3. In PowerShell: docker context ls   then: docker context use default',
			'  4. Verify: docker version   (Client and Server sections should both appear)'
		);
		return lines.join('\n');
	}

	lines.push('', 'Verify with: docker version', 'Then retry: npm run mfa:download-models');
	return lines.join('\n');
}

module.exports = {
	isInsideDockerContainer,
	isWsl,
	dockerSocketExists,
	formatDockerConnectionHelp,
};
