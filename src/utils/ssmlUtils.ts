// SSML utilities for TTS - strip tags for providers that don't support SSML,
// and inject pauses for story-beat slides

/** Strip SSML tags to get plain text for TTS services that don't support SSML */
export function stripSSML(ssmlContent: string): string {
	let text = ssmlContent;

	// Remove XML declaration
	text = text.replace(/<\?xml[^?]*\?>/g, "");

	// Remove speak wrapper
	text = text.replace(/<\/?speak[^>]*>/g, "");

	// Remove voice tags
	text = text.replace(/<\/?voice[^>]*>/g, "");

	// Remove prosody tags
	text = text.replace(/<\/?prosody[^>]*>/g, "");

	// Convert breaks to pauses (periods or commas based on duration)
	text = text.replace(/<break\s+time="(\d+)ms"\s*\/>/g, (_match, ms) => {
		const duration = parseInt(ms, 10);
		if (duration >= 600) return ". ";
		if (duration >= 300) return ", ";
		return " ";
	});

	// Remove emphasis tags but keep content
	text = text.replace(/<emphasis[^>]*>([^<]*)<\/emphasis>/g, "$1");

	// Remove any remaining tags
	text = text.replace(/<[^>]+>/g, "");

	// Clean up whitespace
	text = text.replace(/\s+/g, " ").trim();

	// Fix spacing around punctuation
	text = text.replace(/\s+([.,!?])/g, "$1");
	text = text.replace(/([.,!?])\s*([.,!?])/g, "$1$2");

	return text;
}

/** Check if text contains SSML tags */
export function containsSSML(text: string): boolean {
	return /<break\s|<\/?speak|<\/?voice|<\/?prosody|<emphasis/i.test(text);
}

/**
 * Inject a pause at the start of the script for story-beat pattern-interrupt slides.
 * Adds a 400ms break so the idea lands before the punchline.
 */
export function injectPauseForStoryBeat(
	script: string,
	slide: { type?: string; beat?: string }
): string {
	if (slide.type === "story-beat" && slide.beat === "pattern-interrupt") {
		return `<break time="400ms"/> ${script}`;
	}
	return script;
}
