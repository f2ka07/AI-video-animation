// Audio quality validation utilities
// Used to detect distortion and trigger fallback to alternative TTS services

import * as fs from "fs";
import * as path from "path";

/**
 * Validate audio file quality
 * Checks for common issues like distortion, truncation, or corruption
 */
export async function validateAudioQuality(
	audioPath: string,
	expectedDuration?: number
): Promise<{ isValid: boolean; issues: string[] }> {
	const issues: string[] = [];

	try {
		// Check if file exists
		if (!fs.existsSync(audioPath)) {
			issues.push("Audio file does not exist");
			return { isValid: false, issues };
		}

		// Check file size (too small might indicate truncation)
		const stats = fs.statSync(audioPath);
		if (stats.size < 1000) {
			issues.push("Audio file is too small (possibly truncated)");
		}

		// Check WAV header if it's a WAV file
		if (audioPath.endsWith(".wav")) {
			const buffer = fs.readFileSync(audioPath);
			
			// Check RIFF header
			if (buffer.length < 12 || buffer.toString("ascii", 0, 4) !== "RIFF") {
				issues.push("Invalid WAV file header");
			} else {
				// Try to read duration from WAV header
				const actualDuration = getWavDuration(buffer);
				
				if (expectedDuration && actualDuration) {
					const durationDiff = Math.abs(actualDuration - expectedDuration);
					const tolerance = 0.5; // 0.5 second tolerance
					
					if (durationDiff > tolerance) {
						issues.push(
							`Duration mismatch: expected ${expectedDuration.toFixed(2)}s, got ${actualDuration.toFixed(2)}s (diff: ${durationDiff.toFixed(2)}s)`
						);
					}
				}
			}
		}

		// Note: More sophisticated distortion detection would require audio analysis
		// For now, we rely on duration checks and file size validation
		// In production, you might want to use libraries like `audio-buffer-utils` or `ffmpeg` for spectral analysis

		return {
			isValid: issues.length === 0,
			issues,
		};
	} catch (error) {
		issues.push(`Validation error: ${error instanceof Error ? error.message : String(error)}`);
		return { isValid: false, issues };
	}
}

/**
 * Get duration from WAV file buffer
 */
function getWavDuration(buffer: Buffer): number | null {
	try {
		if (buffer.length < 24) return null;

		const sampleRate = buffer.readUInt32LE(24);
		if (sampleRate === 0) return null;

		const channels = buffer.readUInt16LE(22);
		const bitsPerSample = buffer.readUInt16LE(34);

		// Find data chunk
		let offset = 36;
		while (offset < buffer.length - 8) {
			const chunkId = buffer.toString("ascii", offset, offset + 4);
			const chunkSize = buffer.readUInt32LE(offset + 4);

			if (chunkId === "data") {
				const dataSize = chunkSize;
				const bytesPerSample = bitsPerSample / 8;
				const duration = dataSize / (sampleRate * channels * bytesPerSample);

				if (isFinite(duration) && duration > 0 && duration < 3600) {
					return duration;
				}
			}

			offset += 8 + chunkSize;
			if (chunkSize % 2 === 1) offset++; // Align to word boundary
		}

		return null;
	} catch {
		return null;
	}
}

/**
 * Check if audio appears to be distorted based on file characteristics
 * This is a basic check - more sophisticated analysis would require audio processing
 */
export function isLikelyDistorted(audioPath: string): boolean {
	try {
		if (!fs.existsSync(audioPath)) {
			return true;
		}

		const stats = fs.statSync(audioPath);
		
		// Very small files are likely corrupted
		if (stats.size < 1000) {
			return true;
		}

		// For WAV files, check header validity
		if (audioPath.endsWith(".wav")) {
			const buffer = fs.readFileSync(audioPath, { start: 0, end: 12 });
			if (buffer.toString("ascii", 0, 4) !== "RIFF") {
				return true;
			}
		}

		return false;
	} catch {
		return true;
	}
}
