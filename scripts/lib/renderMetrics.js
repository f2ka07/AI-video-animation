// Render benchmark metrics: vCPU, frames, wall-clock phases, cost per frame.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { getCpuCount } = require('./renderConcurrency.js');

const CSV_COLUMNS = [
	'timestamp_utc',
	'job_id',
	'course_id',
	'module_number',
	'instance_label',
	'vcpus',
	'concurrency',
	'frames_total',
	'wall_seconds_total',
	'sync_seconds',
	'bundle_seconds',
	'render_seconds',
	'encode_seconds',
	'cost_per_hour_usd',
	'estimated_cost_usd',
	'cost_per_frame_usd',
	'frames_per_hour',
	'preset',
	'success',
	'output_file_mb',
	'error',
];

function getMetricsDir(repoRoot) {
	return path.join(repoRoot || path.join(__dirname, '..', '..'), 'workspace', 'render-metrics');
}

function getMetricsCsvPath(repoRoot) {
	return path.join(getMetricsDir(repoRoot), 'render-results.csv');
}

/** Create metrics dir and verify the process can write to it (Docker volume permissions). */
function ensureMetricsDir(repoRoot) {
	const dir = getMetricsDir(repoRoot);
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, { recursive: true, mode: 0o775 });
	}
	try {
		fs.accessSync(dir, fs.constants.W_OK);
	} catch (e) {
		const err = new Error(
			`Render metrics directory is not writable: ${dir}. Fix volume ownership or permissions.`
		);
		err.code = 'EACCES';
		throw err;
	}
	return dir;
}

function escapeCsvField(value) {
	const str = value === null || value === undefined ? '' : String(value);
	if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
		return `"${str.replace(/"/g, '""')}"`;
	}
	return str;
}

function formatNumber(value, decimals = 4) {
	if (value === null || value === undefined || Number.isNaN(value)) {
		return '';
	}
	return Number(value).toFixed(decimals);
}

function getModuleFrameCount(moduleNumber, repoRoot) {
	const root = repoRoot || path.join(__dirname, '..', '..');
	const rootTsx = path.join(root, 'src', 'Root.tsx');
	if (!fs.existsSync(rootTsx)) {
		return null;
	}
	const content = fs.readFileSync(rootTsx, 'utf-8');
	const pattern = new RegExp(
		`id="module-${moduleNumber}"[\\s\\S]*?durationInFrames=\\{(\\d+)\\}`
	);
	const match = content.match(pattern);
	return match ? parseInt(match[1], 10) : null;
}

function createJobTimer() {
	const startedAt = Date.now();
	const marks = { startedAt };

	return {
		mark(phase) {
			marks[phase] = Date.now();
		},
		elapsedSeconds(fromPhase, toPhase) {
			const from = marks[fromPhase];
			const to = marks[toPhase];
			if (!from || !to) return null;
			return (to - from) / 1000;
		},
		totalSeconds() {
			return (Date.now() - startedAt) / 1000;
		},
		getMarks() {
			return { ...marks, endedAt: Date.now() };
		},
	};
}

function computeCostMetrics({ wallSecondsTotal, framesTotal, costPerHourUsd }) {
	const costPerHour = parseFloat(costPerHourUsd);
	if (!wallSecondsTotal || wallSecondsTotal <= 0) {
		return {
			estimated_cost_usd: null,
			cost_per_frame_usd: null,
			frames_per_hour: null,
		};
	}
	const hours = wallSecondsTotal / 3600;
	const estimatedCost =
		Number.isFinite(costPerHour) && costPerHour >= 0 ? hours * costPerHour : null;
	const costPerFrame =
		estimatedCost !== null && framesTotal > 0 ? estimatedCost / framesTotal : null;
	const framesPerHour = framesTotal > 0 ? framesTotal / hours : null;
	return {
		estimated_cost_usd: estimatedCost,
		cost_per_frame_usd: costPerFrame,
		frames_per_hour: framesPerHour,
	};
}

function buildMetricsRow({
	jobId,
	courseId,
	moduleNumber,
	instanceLabel,
	concurrency,
	timer,
	framesTotal,
	costPerHourUsd,
	preset,
	success,
	outputFileMb,
	error,
}) {
	const marks = timer.getMarks();
	const wallSecondsTotal = timer.totalSeconds();
	const syncSeconds = timer.elapsedSeconds('startedAt', 'syncDone');
	const bundleSeconds = timer.elapsedSeconds('bundleStart', 'bundleDone');
	const renderSeconds = timer.elapsedSeconds('renderStart', 'renderDone');
	const encodeSeconds = timer.elapsedSeconds('encodeStart', 'encodeDone');
	const costs = computeCostMetrics({
		wallSecondsTotal,
		framesTotal,
		costPerHourUsd,
	});

	return {
		timestamp_utc: new Date(marks.endedAt || Date.now()).toISOString(),
		job_id: jobId || crypto.randomUUID(),
		course_id: courseId || '',
		module_number: moduleNumber,
		instance_label: instanceLabel || '',
		vcpus: getCpuCount(),
		concurrency: concurrency,
		frames_total: framesTotal,
		wall_seconds_total: wallSecondsTotal,
		sync_seconds: syncSeconds,
		bundle_seconds: bundleSeconds,
		render_seconds: renderSeconds,
		encode_seconds: encodeSeconds,
		cost_per_hour_usd: costPerHourUsd,
		estimated_cost_usd: costs.estimated_cost_usd,
		cost_per_frame_usd: costs.cost_per_frame_usd,
		frames_per_hour: costs.frames_per_hour,
		preset: preset || 'gui-default',
		success: success ? 'true' : 'false',
		output_file_mb: outputFileMb,
		error: error || '',
	};
}

function rowToCsvLine(row) {
	return CSV_COLUMNS.map((col) => {
		const value = row[col];
		if (
			col === 'wall_seconds_total' ||
			col === 'sync_seconds' ||
			col === 'bundle_seconds' ||
			col === 'render_seconds' ||
			col === 'encode_seconds' ||
			col === 'cost_per_hour_usd' ||
			col === 'estimated_cost_usd' ||
			col === 'cost_per_frame_usd' ||
			col === 'frames_per_hour' ||
			col === 'output_file_mb'
		) {
			return escapeCsvField(
				value === null || value === undefined || value === '' ? '' : formatNumber(value, 6)
			);
		}
		return escapeCsvField(value);
	}).join(',');
}

function appendRenderMetricsRow(row, repoRoot) {
	const csvPath = getMetricsCsvPath(repoRoot);
	const dir = ensureMetricsDir(repoRoot);
	const needsHeader = !fs.existsSync(csvPath) || fs.statSync(csvPath).size === 0;
	const line = rowToCsvLine(row);
	const header = CSV_COLUMNS.join(',');
	const content = needsHeader ? `${header}\n${line}\n` : `${line}\n`;
	fs.appendFileSync(csvPath, content, 'utf-8');
	return csvPath;
}

function readRenderMetricsCsv(repoRoot) {
	const csvPath = getMetricsCsvPath(repoRoot);
	if (!fs.existsSync(csvPath)) {
		return { header: CSV_COLUMNS.join(','), rows: [], path: csvPath };
	}
	let content;
	try {
		content = fs.readFileSync(csvPath, 'utf-8').trim();
	} catch (err) {
		err.path = csvPath;
		throw err;
	}
	if (!content) {
		return { header: CSV_COLUMNS.join(','), rows: [], path: csvPath };
	}
	const lines = content.split(/\r?\n/);
	const header = lines[0];
	const rows = lines.slice(1).filter(Boolean);
	return { header, rows, path: csvPath };
}

function parseRemotionStdoutLine(line, timer, state) {
	if (!line || !timer) return state;

	if (/Bundling\s+\d+%/i.test(line) && !state.bundleStarted) {
		timer.mark('bundleStart');
		state.bundleStarted = true;
	}
	if (line.includes('Copying public dir') && state.bundleStarted && !state.bundleDone) {
		timer.mark('bundleDone');
		state.bundleDone = true;
	}
	if (/Rendered\s+(\d+)\/(\d+)/i.test(line)) {
		const match = line.match(/Rendered\s+(\d+)\/(\d+)/i);
		if (match) {
			const current = parseInt(match[1], 10);
			const total = parseInt(match[2], 10);
			if (!state.renderStarted) {
				timer.mark('renderStart');
				state.renderStarted = true;
				state.frameTotal = total;
			}
			if (current >= total) {
				timer.mark('renderDone');
				state.renderDone = true;
			}
		}
	}
	if (/Encoded\s+(\d+)\/(\d+)/i.test(line)) {
		if (!state.encodeStarted) {
			timer.mark('encodeStart');
			state.encodeStarted = true;
		}
		const match = line.match(/Encoded\s+(\d+)\/(\d+)/i);
		if (match) {
			const current = parseInt(match[1], 10);
			const total = parseInt(match[2], 10);
			if (current >= total) {
				timer.mark('encodeDone');
				state.encodeDone = true;
			}
		}
	}
	if (
		(line.includes('Stitching') || line.includes('stitching')) &&
		!state.encodeStarted
	) {
		timer.mark('encodeStart');
		state.encodeStarted = true;
	}

	return state;
}

function createRemotionParseState() {
	return {
		bundleStarted: false,
		bundleDone: false,
		renderStarted: false,
		renderDone: false,
		encodeStarted: false,
		encodeDone: false,
		frameTotal: null,
	};
}

module.exports = {
	CSV_COLUMNS,
	getMetricsDir,
	getMetricsCsvPath,
	ensureMetricsDir,
	getModuleFrameCount,
	createJobTimer,
	computeCostMetrics,
	buildMetricsRow,
	appendRenderMetricsRow,
	readRenderMetricsCsv,
	parseRemotionStdoutLine,
	createRemotionParseState,
};
