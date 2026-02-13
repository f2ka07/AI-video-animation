// Simple Express server for the GUI
// Runs on port 3001, separate from Remotion Studio (port 3000)

const express = require('express');
const { exec, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const multer = require('multer');

// Load environment variables from .env file
require('dotenv').config();

// Configure multer for audio uploads
const audioUpload = multer({ 
	dest: path.join(__dirname, 'public', 'audio', 'temp'),
	limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// Configure multer for image uploads
const imageUpload = multer({ 
	dest: path.join(__dirname, 'public', 'assets', 'temp'),
	limits: { fileSize: 20 * 1024 * 1024 } // 20MB limit
});

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'gui')));
// Serve audio files from public/audio
app.use('/audio', express.static(path.join(__dirname, 'public', 'audio')));

// Course storage file path
const COURSES_JSON_PATH = path.join(__dirname, 'courses.json');

// Helper: Read courses from courses.json
function readCoursesJson() {
	try {
		if (fs.existsSync(COURSES_JSON_PATH)) {
			const data = JSON.parse(fs.readFileSync(COURSES_JSON_PATH, 'utf-8'));
			return data;
		}
	} catch (e) {
		console.error('Error reading courses.json:', e);
	}
	// Return default structure if file doesn't exist or is invalid
	return {
		courses: [{ id: 'default', title: 'Default Course', description: '', moduleCount: 0, status: 'active', archivedAt: null }],
		courseModuleMapping: { 'default': [] }
	};
}

// Helper: Get active course from moduleContent.ts (source of truth for Remotion)
// Returns the courseId Remotion is actually using, or null if file missing/invalid
function getActiveCourseFromModuleContent() {
	const moduleContentPath = path.join(__dirname, 'src', 'videos', 'moduleContent.ts');
	if (!fs.existsSync(moduleContentPath)) return null;
	try {
		const content = fs.readFileSync(moduleContentPath, 'utf-8');
		// Match "// Course ID: comprehensive-wireless-networks"
		const headerMatch = content.match(/\/\/\s*Course ID:\s*([a-zA-Z0-9_-]+)/);
		if (headerMatch) return headerMatch[1];
		// Fallback: first courseId: "xxx" in module content
		const courseIdMatch = content.match(/courseId:\s*["']([a-zA-Z0-9_-]+)["']/);
		if (courseIdMatch) return courseIdMatch[1];
	} catch (e) {
		console.error('[getActiveCourse] Error reading moduleContent.ts:', e.message);
	}
	return null;
}

// Helper: Write courses to courses.json
function writeCoursesJson(data) {
	try {
		fs.writeFileSync(COURSES_JSON_PATH, JSON.stringify(data, null, 2), 'utf-8');
		return true;
	} catch (e) {
		console.error('Error writing courses.json:', e);
		return false;
	}
}

// Helper: Extract slides array content using bracket counting
// This properly handles nested arrays/objects and template literals
function extractSlidesContent(moduleBody) {
	const slidesStart = moduleBody.indexOf('slides:');
	if (slidesStart === -1) return null;
	
	const bracketStart = moduleBody.indexOf('[', slidesStart);
	if (bracketStart === -1) return null;
	
	let bracketDepth = 0;
	let inBacktick = false;
	let slidesEnd = -1;
	
	for (let i = bracketStart; i < moduleBody.length; i++) {
		const char = moduleBody[i];
		const prevChar = i > 0 ? moduleBody[i - 1] : '';
		
		if (char === '`' && prevChar !== '\\') {
			inBacktick = !inBacktick;
			continue;
		}
		
		if (inBacktick) continue;
		
		if (char === '[') {
			bracketDepth++;
		} else if (char === ']') {
			bracketDepth--;
			if (bracketDepth === 0) {
				slidesEnd = i;
				break;
			}
		}
	}
	
	if (slidesEnd === -1) return null;
	return moduleBody.substring(bracketStart + 1, slidesEnd);
}

// Helper: Extract slide names from slides content
function extractSlideNames(slidesContent) {
	const names = [];
	const nameMatches = slidesContent.match(/name:\s*"([^"]+)"/g) || [];
	names.push(...nameMatches.map(m => m.match(/"([^"]+)"/)[1]));
	return names;
}

// Word limit constants for AI planner (course: Udemy-quality depth; shorts/video: tighter)
const MAX_WORDS_PER_SLIDE = 90;  // Allow deeper explanations per slide
const MAX_SECONDS_PER_SLIDE = 40; // ~90 words at 2.5 wps

// Helper: Count words in text
function countWords(text) {
	return text.trim().split(/\s+/).filter(w => w.length > 0).length;
}

// Helper: Estimate speaking duration
function estimateDuration(text) {
	return Math.ceil(countWords(text) / 2.5);
}

// API: Plan a course using AI
app.post('/api/plan-course', async (req, res) => {
	try {
		const { prompt, title, description, targetAudience, keyTopics, moduleCount, contentType } = req.body;
		// Normalize: accept contentType from body (frontend must send it); default course if missing
		const rawType = (contentType || req.body.content_type || '').toString().toLowerCase();
		const contentKind = rawType === 'shorts' ? 'shorts' : (rawType === 'video' ? 'video' : 'course');
		console.log('[plan-course] Request contentType:', contentType, '-> contentKind:', contentKind);
		
		if (!prompt && !title) {
			return res.status(400).json({ error: 'Either prompt or title is required' });
		}
		
		const apiKey = process.env.OPENAI_API_KEY;
		if (!apiKey) {
			return res.status(500).json({ error: 'OPENAI_API_KEY is not configured' });
		}
		
		let systemPrompt;
		let userPrompt;
		
		if (contentKind === 'shorts') {
			// Shorts: essay-style, dense prose like high-quality scripted shorts (see SAMPLE.md)
			systemPrompt = `You are an expert short-form video scriptwriter. Create shorts that read like a tight, insightful ESSAY: each "slide" is one complete thought that builds the argument. Target the quality of a strong editorial script (dense, no filler, no marketing). Match this voice and structure.

TARGET VOICE (essay-style, like this):
- "AI tools are not replacing developers. They are changing what a developer is."
- "The bottleneck is no longer writing code. It is deciding what should exist."
- "The speed jump is not magic. It is cognitive offloading."
- "AI does not reward memorization. It rewards taste."
- "The future developer is not a typist. It is a systems thinker with a compiler assistant."
- "Learn to guide tools, not compete with them."
Use contrast and parallel structure when possible: "X is not Y. It is Z." / "The real shift is A." / "But the tradeoff is B." Each slide = one full sentence (or two short clauses). Script carries the meaning; no reliance on bullets.

QUALITY BAR:
- One flowing argument per short. Slide 2 follows from slide 1, etc. By the end the viewer can state the thesis.
- Every slide adds a new idea or consequence. No filler, no restating.
- End with a line worth remembering: insight, rule, or soft takeaway. Not "Follow for more!" or "That's it."
- Tone: editorial, thoughtful. NOT marketing (no hype, no hard CTAs).

CLARITY:
- First slide names or clearly hints at the topic. No vague "it" or "this."
- Prefer concrete over abstract. Full thoughts over fragments.

BANNED:
- Generic hooks: "Here's what you need to know", "Let me explain"
- Filler: "That's it.", "Let that sink in.", slides that rephrase the previous
- Marketing: "10x", "level up", "Follow now!", "Start today!"
- Bullet-heavy slides where the script is just a label; script must be the main content

AUDIO CONSTRAINTS FOR SHORTS:
- Target: 15-22 words per slide (one full essay-style sentence). Each slide = one complete thought.
- Maximum: 25 words per slide
- 5-10 slides per short so the argument can build (not just 3-4 punchy lines)

SLIDE TYPES:
1. "title" - Script = one or two full sentences (the hook). Title field = short label for the slide.
2. "content-two-card" - Script = the main content (one full sentence). points[] OPTIONAL: 0-2 phrases only if they add clarity; script carries the meaning.
3. "code" / "comparison" - Only if the topic needs it. Script = one complete thought.

BULLETS: Optional. Prefer 0-2 points per slide; use only when they clarify. The script is the primary content.

SHORTS STRUCTURE:
- Each module = one short. 5-10 slides. One flowing argument: hook -> 3-7 beats that build the case -> one memorable closing line.
- First slide: name the topic and state the thesis or opening contrast.
- Middle: each slide one new idea, consequence, or twist. Build; do not repeat.
- Last slide: insight or takeaway the viewer could quote. Soft close, not ad.

MODULE TITLE AND SUBTITLE FOR SHORTS (mandatory):
- Each module = one short. The module "title" is the SHORT'S TITLE (like a YouTube Short or TikTok title), NOT a course chapter title.
- Do NOT use "Module 1:", "Module 2:", "Part 1:", "Introduction to...", "Foundations of...", or any course-style naming.
- Good title examples: "Why Agentic AI Changes Everything", "The Clawdbot in 60 Seconds", "One Tip That Saves Hours"
- Bad title examples: "Module 1: Foundations of Agentic AI", "Introduction to Agentic AI and the Clawdbot"
- Subtitle: one punchy line or hook (e.g. "Save this before you build another bot"). Optional "Short 1:" only if you need order; prefer no number.
- courseName: series/playlist name (e.g. "Agentic AI Shorts"), not a course title.

OUTPUT FORMAT (same JSON shape as courses):
{
  "courseName": "Series or Playlist Name",
  "courseId": "series-id-with-dashes",
  "modules": [
    {
      "moduleNumber": 1,
      "title": "Punchy Short Title (like a TikTok caption)",
      "subtitle": "One-line hook or leave minimal",
      "slides": [
        {
          "name": "unique-slide-name",
          "type": "title|content-two-card|code|comparison",
          "script": "One full essay-style sentence (15-22 words). Complete thought.",
          "title": "Slide Title",
          "points": ["short phrase", "another"],
          "code": "// if code type",
          "language": "javascript"
        }
      ]
    }
  ]
}

SCRIPT STYLE FOR SHORTS (mandatory):
- Essay-style: each slide = one complete thought (15-22 words). Use contrast: "X is not Y. It is Z." Build one flowing argument.
- Tone: editorial, thoughtful. NOT marketing. No hype, no hard CTAs.
- 5-10 slides per short. Script carries the meaning; bullets optional (0-2 per slide). End with a line worth remembering.`;
			
			userPrompt = '';
			if (prompt && !title) {
				userPrompt = `Create a series of SHORTS (short-form videos) based on this request:

"${prompt}"

Requirements:
- Essay-style voice (like SAMPLE.md): each slide = one full sentence (15-22 words). Use contrast: "X is not Y. It is Z." Build one flowing argument.
- 5-10 slides per short. Script carries the meaning; bullets optional (0-2 per slide). Editorial tone, NOT marketing.
- Each module = one short. First slide names the topic; each slide adds one new idea; end with a line worth remembering.
${moduleCount ? `- Generate exactly ${moduleCount} shorts (${moduleCount} modules).\n` : '- Generate as many shorts as fit the topic (each module is one short).\n'}
- 15-22 words per slide (one complete thought per slide). Same JSON output format as above`;
			} else {
				userPrompt = 'Create a series of SHORTS with the following specifications:\n\n';
				if (title) userPrompt += `Series/Title: ${title}\n`;
				if (description) userPrompt += `Description: ${description}\n`;
				if (targetAudience) userPrompt += `Target Audience: ${targetAudience}\n`;
				if (keyTopics && keyTopics.length) userPrompt += `Key Topics:\n${keyTopics.map(t => `- ${t}`).join('\n')}\n`;
				if (moduleCount) userPrompt += `Number of shorts (modules): ${moduleCount}\n`;
				userPrompt += `\nEssay-style (like SAMPLE.md): each slide = one full sentence (15-22 words). 5-10 slides per short. Script carries meaning; bullets optional. Editorial tone, NOT marketing. Same JSON format as above.`;
			}
		} else if (contentKind === 'video') {
			// Video: YouTube long-form; different tone from course (engaging, hook-focused)
			systemPrompt = `You are an expert YouTube long-form video content planner. Create engaging, watchable VIDEO content (target: YouTube). Tone is different from a formal course: more conversational, hook-driven, and retention-focused.

AUDIO DURATION CONSTRAINTS:
- Target: 40-55 words per slide (15-22 seconds of audio)
- Maximum: ${MAX_WORDS_PER_SLIDE} words (${MAX_SECONDS_PER_SLIDE} seconds)
- Minimum: 35 words per slide
- One clear idea per slide

SLIDE TYPES AVAILABLE:
1. "title" - Video/hook slide (script grabs attention, states what viewer will learn)
2. "content-two-card" - Explanation with bullet points (title, script, points[])
3. "code" - Code example (title, script, code, language)
4. "code-diagram" - Code with visual (title, script, code, language, scene)
5. "comparison" - Two-column comparison (title, script, leftTitle, leftItems[], rightTitle, rightItems[])

BULLET POINT RULES:
- Extract bullet points from the script; same phrases for timing sync
- Maximum 4 bullet points per slide; 3-8 words per point

VOICE AND TONE (YouTube long-form, not course):
- Hook early: first slide should create curiosity or state the payoff
- Conversational and direct; avoid academic or textbook tone
- Use "you" and "we"; occasional light energy, not dry
- Each script should feel like a YouTuber explaining to the viewer, not a lecturer
- Phrases like: "Here's the thing...", "So what does that mean for you?", "Quick tip:", "The key takeaway..."
- No "In this module we will..." - jump into the content

STRUCTURE:
- Organized like a course: same concept covered across many videos (modules). No cap on number of videos - let the topic dictate how many. Often 20+ videos for a full series.
- Each module = one YouTube video; each video 5-20 minutes long (roughly 6-25 slides per video depending on depth).
- If the user does not specify a number, exhaust the topic: create as many videos as needed to cover the subject thoroughly.
- Pattern per video: Hook -> Concept -> Example -> Why it matters -> Conclusion
- Same JSON output format as courses (courseName, courseId, modules[])

LAST SLIDE - CONCLUSION (mandatory):
- The last slide of each video is a strategic conclusion: one clear takeaway, simple language. Do NOT use "Video 1 Summary", "Module 1 Summary", "Summary", or any "Video N" / "Module N" in the slide title. Use a creative, descriptive title (e.g. "The Big Takeaway", "What This Means for You", "Where We Go From Here"). Assume all videos may be combined into one multi-purpose video; each conclusion should stand alone. No "In the next video..."; close the segment so it feels complete.

MODULE TITLE AND SUBTITLE (mandatory):
- title: Short video title (topic name). Do NOT use "Video 1", "Module 1", "Part 1", or any number in the title.
- subtitle: Descriptive one-liner that explains the video; do NOT use "Video 1:" or "Video 2:". Use a clear subtitle so the video can be reused in different contexts (e.g. playlists, standalone).

OUTPUT FORMAT:
{
  "courseName": "Series or Video Title",
  "courseId": "series-id-with-dashes",
  "modules": [
    {
      "moduleNumber": 1,
      "title": "Video Title",
      "subtitle": "Descriptive Subtitle (no Video 1: prefix)",
      "slides": [
        {
          "name": "unique-slide-name",
          "type": "title|content-two-card|code|comparison",
          "script": "40-55 word narration, YouTube tone...",
          "title": "Slide Title",
          "points": ["phrase from script", "another phrase"],
          "code": "// if code type",
          "language": "javascript"
        }
      ]
    }
  ]
}`;

			if (prompt && !title) {
				userPrompt = `Create YouTube long-form VIDEO content (not a course) based on this request:

"${prompt}"

Requirements:
- Exhaust the topic: generate as many videos (modules) as needed to cover the subject thoroughly. No cap - 20+ videos is fine for a full series. Only limit to a specific number if the user provides one.
${moduleCount ? `- User requested exactly ${moduleCount} videos.\n` : '- Let the scope of the topic decide how many videos; do not artificially limit.\n'}
- Each video: 5-20 minutes long (roughly 6-25 slides per video). Same concept as a course but adapted for YouTube.
- Tone: YouTube-style, high retention and engagement; hook-driven; not formal course tone
- Hook in the first slide of each video; conversational narration
- 40-55 words per script; include code examples where relevant
- Same JSON format as above`;
			} else {
				userPrompt = 'Create YouTube long-form VIDEO content with these specifications:\n\n';
				if (title) userPrompt += `Title: ${title}\n`;
				if (description) userPrompt += `Description: ${description}\n`;
				if (targetAudience) userPrompt += `Target Audience: ${targetAudience}\n`;
				if (keyTopics && keyTopics.length) userPrompt += `Key Topics:\n${keyTopics.map(t => `- ${t}`).join('\n')}\n`;
				if (moduleCount) userPrompt += `Number of videos (modules): ${moduleCount}\n`;
				userPrompt += `\nExhaust the topic: create as many videos as needed (no cap; 20+ is fine). Each video 5-20 min. Tone: YouTube long-form, high retention, engaging. 40-55 words per script. Same JSON format as above.`;
			}
		} else {
			// Course: Udemy-quality, comprehensive, beginner-friendly, no editing needed
			systemPrompt = `You are an expert course content planner. Create UDEMY-QUALITY courses: comprehensive, beginner-friendly, and ready to publish with no further editing. The goal is a full learning experience that a complete beginner can follow and understand, not just narration over slides.

QUALITY TARGET:
- Output should be publishable as-is. No "we'll cover this later" or shallow placeholders.
- Every concept is explained fully. A beginner with zero prior knowledge should understand.
- Depth over breadth: prefer thorough coverage of fewer topics than superficial coverage of many.
- Split complex concepts across multiple slides rather than cramming. One idea per slide, fully explained.

SCRIPT LENGTH (per slide):
- Use 50-90 words per slide. Use as many words as needed to explain the concept completely.
- Do NOT rush. Short scripts (under 40 words) feel shallow. When a concept needs more, use more.
- Maximum ${MAX_WORDS_PER_SLIDE} words per slide. If a concept needs more, split it into 2-3 slides.
- Each slide teaches ONE thing completely. The viewer should not need to guess or infer.

SLIDE TYPES:
1. "title" - Module intro (what we'll learn, why it matters)
2. "content-two-card" - Explanation with bullet points (title, script, points[])
3. "code" - Code example WITH full explanation in script (title, script, code, language)
4. "code-diagram" - Code with visual (title, script, code, language, scene)
5. "comparison" - Two-column (title, script, leftTitle, leftItems[], rightTitle, rightItems[])

BULLET POINTS (for timing sync):
- Extract from script using EXACT phrases (3-8 words each). Max 4 per slide.
- Bullets must appear verbatim in the script so narration can sync.

SLIDE COUNT AND STRUCTURE:
- 10-18 slides per module for technical topics. Err on more slides rather than fewer.
- At least 35% code slides for technical courses. Every concept needs working code.
- Pattern: Concept (with analogy) -> Code example -> Line-by-line explanation -> Common pitfalls or best practices -> Next concept
- For code slides: ALWAYS include the actual code in the "code" field. No placeholders. Show real, runnable snippets.

CONTENT DEPTH:
- Define every term before using it. "Docker is a platform that..." not "Docker uses..."
- Use analogies: "Think of it like a shipping container for software."
- After code: explain what each part does. "The first line imports... The second creates..."
- Include "why" and "when to use" not just "what".
- Common mistakes: mention what beginners get wrong and how to avoid it.

MODULE TITLE AND SUBTITLE:
- No "Module 1", "Part 1", or numbers. Use topic title + descriptive subtitle.
- Example: title "Introduction to Docker", subtitle "What Containers Are and Why They Matter"

OUTPUT FORMAT (JSON):
{
  "courseName": "Course Title",
  "courseId": "course-id-with-dashes",
  "modules": [
    {
      "moduleNumber": 1,
      "title": "Topic Title",
      "subtitle": "Descriptive one-liner",
      "slides": [
        {
          "name": "unique-slide-name",
          "type": "title|content-two-card|code|comparison",
          "script": "50-90 word narration. Explain fully. No jargon without definition.",
          "title": "Slide Title",
          "points": ["phrase from script", "another phrase"],
          "code": "actual code here for code slides",
          "language": "python|javascript|bash|etc"
        }
      ]
    }
  ]
}

LAST SLIDE - CONCLUSION:
- Creative title (e.g. "The Big Takeaway", "What This Means for You"). No "Module Summary" or numbers.
- Professor-level insight, simple language. One memorable takeaway. Stands alone.
- No "In the next module...". Close the segment.

SCRIPT STYLE:
- Conversational, like explaining to a friend who knows nothing.
- "Think of it like...", "In simple terms...", "The key insight is..."
- For code: "This line does X. The next line does Y. Together they..."
- Never: "In this slide we will..." - just explain.

CRITICAL - AVOID:
- Shallow slides (under 40 words when concept needs more)
- Code slides without actual code
- Jargon without definition
- Skipping "why" and "when"
- Assuming prior knowledge`;

			// Build user prompt for course only
			if (prompt && !title) {
				userPrompt = `Create a Udemy-quality video course based on this request:

"${prompt}"

Requirements:
- Generate ${moduleCount || '6-12'} modules depending on topic complexity. Comprehensive topics need more modules.
- Each module: 10-18 slides. Err on more slides for depth.
- Udemy quality: comprehensive, beginner-friendly, publishable as-is. No editing needed.
- Do NOT use "Module 1", "Module 2", etc. in title or subtitle
- Last slide of each module: strategic conclusion with creative title (no "Summary"). Professor-level insight.
- 35%+ code slides for technical topics. Every concept needs working code - include actual code, not placeholders.
- 50-90 words per slide. Use as many as needed to explain fully.
- Assume zero prior knowledge. Define every term. Include analogies and "why".
- Depth over breadth. Split complex concepts across multiple slides.`;
			} else {
				userPrompt = 'Create a Udemy-quality video course with the following specifications:\n\n';
				if (title) userPrompt += `Title: ${title}\n`;
				if (description) userPrompt += `Description: ${description}\n`;
				if (targetAudience) userPrompt += `Target Audience: ${targetAudience}\n`;
				if (keyTopics && keyTopics.length) userPrompt += `Key Topics:\n${keyTopics.map(t => `- ${t}`).join('\n')}\n`;
				if (moduleCount) userPrompt += `Number of Modules: ${moduleCount}\n`;
				
				userPrompt += `\nUdemy quality: comprehensive, beginner-friendly, publishable as-is.
- 10-18 slides per module. 50-90 words per slide. 35%+ code slides for technical content.
- Include actual code for every code slide. No placeholders.
- Depth over breadth. Assume zero prior knowledge. Define every term.`;
			}
		}
		
		console.log('[plan-course] Calling OpenAI GPT-4...', contentKind);
		
		// Create AbortController with extended timeout for connection and request
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 180000); // 180 seconds for comprehensive courses
		
		let response;
		try {
			response = await fetch('https://api.openai.com/v1/chat/completions', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${apiKey}`
				},
				body: JSON.stringify({
					model: 'gpt-4o',
					messages: [
						{ role: 'system', content: systemPrompt },
						{ role: 'user', content: userPrompt }
					],
					temperature: 0.6,
					max_completion_tokens: 16384,
					response_format: { type: 'json_object' }
				}),
				signal: controller.signal
			});
		} catch (error) {
			clearTimeout(timeoutId);
			if (error.name === 'AbortError' || error.code === 'UND_ERR_CONNECT_TIMEOUT') {
				console.error('[plan-course] Connection timeout error:', error.message);
				return res.status(504).json({ 
					error: 'Connection timeout: Unable to reach OpenAI API. Please check your internet connection and try again.' 
				});
			}
			console.error('[plan-course] Network error:', error.message);
			return res.status(500).json({ 
				error: `Network error: ${error.message}` 
			});
		} finally {
			clearTimeout(timeoutId);
		}
		
		if (!response.ok) {
			const errorText = await response.text();
			console.error('[plan-course] OpenAI error:', errorText);
			return res.status(500).json({ error: `OpenAI API error: ${response.status}` });
		}
		
		const data = await response.json();
		const content = data.choices[0].message.content;
		const planOutput = JSON.parse(content);
		
		// Post-process: Fix backslash issues and validate scripts
		const maxWordsForSlide = contentKind === 'shorts' ? 25 : MAX_WORDS_PER_SLIDE;
		const minWordsForSlide = contentKind === 'shorts' ? 10 : 35;
		const warnings = [];
		for (const mod of planOutput.modules) {
			for (const slide of mod.slides) {
				// Fix improperly escaped backslashes in scripts
				if (slide.script) {
					slide.script = slide.script.replace(/\\(?![nrt"\\])/g, '\\\\');
				}
				if (slide.code) {
					// Code blocks may have intentional backslashes, leave as-is
				}
				
				const words = countWords(slide.script || '');
				
				// Check for truncated scripts
				const scriptText = slide.script || '';
				const endsWithBackslash = scriptText.endsWith('\\');
				const isTooShort = words < minWordsForSlide && slide.type !== 'title';
				
				if (endsWithBackslash) {
					warnings.push({
						type: 'truncated',
						module: mod.moduleNumber,
						slide: slide.name,
						message: 'Script may be truncated (ends with backslash)',
						words: words
					});
				}
				
				if (isTooShort) {
					warnings.push({
						type: 'short',
						module: mod.moduleNumber,
						slide: slide.name,
						message: `Script too short (${words} words, minimum ${minWordsForSlide})`,
						words: words
					});
				}
				
				if (words > maxWordsForSlide) {
					warnings.push({
						type: 'long',
						module: mod.moduleNumber,
						slide: slide.name,
						words: words,
						maxWords: maxWordsForSlide,
						message: `Script too long (${words} words, max ${maxWordsForSlide})`,
						estimatedSeconds: estimateDuration(slide.script)
					});
				}
			}
		}
		
		// Calculate stats
		let totalSlides = 0;
		let totalWords = 0;
		for (const mod of planOutput.modules) {
			totalSlides += mod.slides.length;
			for (const slide of mod.slides) {
				totalWords += countWords(slide.script);
			}
		}
		
		console.log(`[plan-course] Generated: ${planOutput.modules.length} modules, ${totalSlides} slides`);
		
		res.json({
			success: true,
			plan: planOutput,
			stats: {
				modules: planOutput.modules.length,
				slides: totalSlides,
				totalWords: totalWords,
				estimatedDuration: Math.ceil(totalWords / 2.5 / 60) + ' minutes'
			},
			warnings: warnings
		});
		
	} catch (error) {
		console.error('[plan-course] Error:', error);
		res.status(500).json({ error: error.message });
	}
});

// API: Save a planned course to moduleContent.ts
app.post('/api/save-plan', (req, res) => {
	try {
		const { plan, contentType } = req.body;
		
		if (!plan || !plan.modules || !plan.courseName) {
			return res.status(400).json({ error: 'Invalid plan structure' });
		}
		
		const contentKind = contentType === 'shorts' ? 'shorts' : (contentType === 'video' ? 'video' : 'course');
		
		// Extract courseId from plan
		const courseId = plan.courseId || plan.courseName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
		
		// Normalize: remove "Module N:" / "Video N:" from subtitles and "Module N Summary" from conclusion slide titles (multi-purpose video)
		for (const mod of plan.modules) {
			if (mod.subtitle && (/^Module \d+:\s*/i.test(mod.subtitle) || /^Video \d+:\s*/i.test(mod.subtitle))) {
				mod.subtitle = mod.subtitle.replace(/^(Module|Video) \d+:\s*/i, '').trim();
			}
			const slides = mod.slides || [];
			if (slides.length > 0) {
				const lastSlide = slides[slides.length - 1];
				if (lastSlide.title && /^Module \d+\s*Summary\s*:?\s*/i.test(lastSlide.title)) {
					const after = lastSlide.title.replace(/^Module \d+\s*Summary\s*:?\s*/i, '').trim();
					lastSlide.title = after || 'Conclusion';
				}
			}
		}
		
		// Generate moduleContent.ts code
		const lines = [
			`// Auto-generated course content by AI Planner`,
			`// Course: ${plan.courseName}`,
			`// Generated: ${new Date().toISOString()}`,
			``,
			`export interface SlideContent {`,
			`	name: string;`,
			`	type: "title" | "content-two-card" | "content-single" | "code" | "code-diagram" | "comparison";`,
			`	script: string;`,
			`	title?: string;`,
			`	subtitle?: string;`,
			`	points?: string[];`,
			`	code?: string;`,
			`	language?: string;`,
			`	imageSrc?: string;`,
			`	leftTitle?: string;`,
			`	leftItems?: string[];`,
			`	rightTitle?: string;`,
			`	rightItems?: string[];`,
			`	scene?: string;`,
			`}`,
			``,
			`export interface ModuleContent {`,
			`	moduleNumber: number;`,
			`	courseId: string;  // Course this module belongs to (for audio/video paths)`,
			`	title: string;`,
			`	subtitle: string;`,
			`	slides: SlideContent[];`,
			`	videoCategory?: "standard" | "short"; // "short" = portrait 1080x1920, 5s per slide`,
			`}`,
			``
		];
		
		// Generate each module (include videoCategory for shorts so rendering uses portrait/5s)
		for (const mod of plan.modules) {
			lines.push(`export const module${mod.moduleNumber}Content: ModuleContent = {`);
			lines.push(`	moduleNumber: ${mod.moduleNumber},`);
			lines.push(`	courseId: ${JSON.stringify(courseId)},`);
			lines.push(`	title: ${JSON.stringify(mod.title)},`);
			lines.push(`	subtitle: ${JSON.stringify(mod.subtitle)},`);
			if (contentKind === 'shorts') {
				lines.push(`	videoCategory: "short",`);
			}
			lines.push(`	slides: [`);
			
			for (const slide of mod.slides) {
				lines.push(`		{`);
				lines.push(`			name: ${JSON.stringify(slide.name)},`);
				lines.push(`			type: ${JSON.stringify(slide.type)},`);
				lines.push(`			script: ${JSON.stringify(slide.script)},`);
				
				if (slide.title) lines.push(`			title: ${JSON.stringify(slide.title)},`);
				if (slide.subtitle) lines.push(`			subtitle: ${JSON.stringify(slide.subtitle)},`);
				if (slide.points) lines.push(`			points: ${JSON.stringify(slide.points)},`);
				if (slide.code) lines.push(`			code: ${JSON.stringify(slide.code)},`);
				if (slide.language) lines.push(`			language: ${JSON.stringify(slide.language)},`);
				if (slide.imageSrc) lines.push(`			imageSrc: ${JSON.stringify(slide.imageSrc)},`);
				if (slide.leftTitle) lines.push(`			leftTitle: ${JSON.stringify(slide.leftTitle)},`);
				if (slide.leftItems) lines.push(`			leftItems: ${JSON.stringify(slide.leftItems)},`);
				if (slide.rightTitle) lines.push(`			rightTitle: ${JSON.stringify(slide.rightTitle)},`);
				if (slide.rightItems) lines.push(`			rightItems: ${JSON.stringify(slide.rightItems)},`);
				
				lines.push(`		},`);
			}
			
			lines.push(`	]`);
			lines.push(`};`);
			lines.push(``);
		}
		
		// Generate allModules export
		const moduleNames = plan.modules.map(m => `module${m.moduleNumber}Content`);
		lines.push(`export const allModules: ModuleContent[] = [`);
		lines.push(`	${moduleNames.join(',\n\t')}`);
		lines.push(`];`);
		
		const code = lines.join('\n');
		const outputPath = path.join(__dirname, 'src', 'videos', 'moduleContent.ts');
		
		// Save content.json to course directory for future reference
		const courseDir = path.join(__dirname, 'courses', courseId);
		fs.mkdirSync(courseDir, { recursive: true });
		fs.mkdirSync(path.join(courseDir, 'timings'), { recursive: true });
		
		const contentJsonPath = path.join(courseDir, 'content.json');
		const contentJson = {
			...plan,
			courseId,
			savedAt: new Date().toISOString()
		};
		fs.writeFileSync(contentJsonPath, JSON.stringify(contentJson, null, 2));
		console.log(`[save-plan] Saved content.json to ${contentJsonPath}`);
		
		// Backup existing moduleContent.ts
		if (fs.existsSync(outputPath)) {
			const backupPath = outputPath.replace('.ts', `.backup.${Date.now()}.ts`);
			fs.copyFileSync(outputPath, backupPath);
			console.log(`[save-plan] Backed up to ${path.basename(backupPath)}`);
		}
		
		fs.writeFileSync(outputPath, code);
		console.log(`[save-plan] Written to ${outputPath}`);
		
		// Update courses.json
		const coursesData = readCoursesJson();
		const existingIndex = coursesData.courses.findIndex(c => c.id === courseId);
		
		const courseEntry = {
			id: courseId,
			title: plan.courseName,
			description: contentKind === 'shorts' ? `Shorts: ${plan.courseName}` : (contentKind === 'video' ? `Video: ${plan.courseName}` : `AI-generated course: ${plan.courseName}`),
			moduleCount: plan.modules.length,
			status: 'active',
			archivedAt: null,
			contentType: contentKind
		};
		
		if (existingIndex >= 0) {
			coursesData.courses[existingIndex] = courseEntry;
		} else {
			coursesData.courses.push(courseEntry);
		}
		
		coursesData.courseModuleMapping[courseId] = plan.modules.map(m => m.moduleNumber);
		writeCoursesJson(coursesData);
		
		res.json({
			success: true,
			message: `Saved ${plan.modules.length} modules to moduleContent.ts and courses/${courseId}/content.json`,
			courseId: courseId,
			path: outputPath,
			contentJsonPath: contentJsonPath
		});
		
	} catch (error) {
		console.error('[save-plan] Error:', error);
		res.status(500).json({ error: error.message });
	}
});

// API: Create new course
app.post('/api/courses', (req, res) => {
	try {
		const { id, title, description } = req.body;
		
		if (!id || !title || !description) {
			return res.status(400).json({ error: 'Course ID, title, and description are required' });
		}
		
		// Validate course ID format
		if (!/^[a-z0-9-]+$/.test(id)) {
			return res.status(400).json({ error: 'Course ID must contain only lowercase letters, numbers, and hyphens' });
		}
		
		// Read current courses data
		const data = readCoursesJson();
		
		// Check if course already exists
		if (data.courses.some(c => c.id === id)) {
			return res.status(400).json({ error: 'Course with this ID already exists' });
		}
		
		// Add new course
		const newCourse = {
			id,
			title,
			description,
			moduleCount: 0,
			status: 'active',
			archivedAt: null
		};
		data.courses.push(newCourse);
		
		// Add course to mapping
		data.courseModuleMapping[id] = [];
		
		if (!writeCoursesJson(data)) {
			return res.status(500).json({ error: 'Failed to save course data' });
		}
		
		console.log(`Created new course: ${id}`);
		res.json({ success: true, courseId: id, course: newCourse });
	} catch (error) {
		console.error('Error creating course:', error);
		res.status(500).json({ error: error.message });
	}
});

// API: Get active course from moduleContent (source of truth for video processing)
app.get('/api/active-course', (req, res) => {
	const activeCourseId = getActiveCourseFromModuleContent();
	res.json({ activeCourseId });
});

// API: Get all courses (with optional status filter)
// Query params:
//   ?status=active (default) - get active courses only
//   ?status=archived - get archived courses only
//   ?status=all - get all courses
app.get('/api/courses', (req, res) => {
	try {
		const statusFilter = req.query.status || 'active'; // Default to active only
		const data = readCoursesJson();
		
		let courses = data.courses || [];
		console.log(`[api/courses] Found ${courses.length} total courses, filter: ${statusFilter}`);
		
		// Filter by status
		if (statusFilter === 'active') {
			courses = courses.filter(c => c.status === 'active');
		} else if (statusFilter === 'archived') {
			courses = courses.filter(c => c.status === 'archived');
		}
		// Ensure each course has contentType (default 'course' for legacy entries)
		courses = courses.map(c => ({ ...c, contentType: c.contentType || 'course' }));
		
		console.log(`[api/courses] Returning ${courses.length} courses after filter`);
		res.json({ courses, filter: statusFilter });
	} catch (error) {
		console.error('[api/courses] Error reading courses:', error);
		res.status(500).json({ error: error.message, courses: [] });
	}
});

// API: Archive a course (also deactivates from Remotion)
app.post('/api/courses/:id/archive', (req, res) => {
	try {
		const courseId = req.params.id;
		const data = readCoursesJson();
		
		const courseIndex = data.courses.findIndex(c => c.id === courseId);
		if (courseIndex === -1) {
			return res.status(404).json({ error: 'Course not found' });
		}
		
		if (data.courses[courseIndex].status === 'archived') {
			return res.status(400).json({ error: 'Course is already archived' });
		}
		
		console.log(`[archive] Archiving course: ${courseId}`);
		
		// Step 1: Remove course from Remotion by clearing moduleContent.ts and public/timings/
		// This ensures the archived course doesn't appear in Remotion Studio
		try {
			const moduleContentPath = path.join(__dirname, 'src', 'videos', 'moduleContent.ts');
			const publicTimingsDir = path.join(__dirname, 'public', 'timings');
			
			// Check if this is the currently active course in moduleContent.ts
			if (fs.existsSync(moduleContentPath)) {
				const moduleContent = fs.readFileSync(moduleContentPath, 'utf-8');
				// If this course is referenced in moduleContent.ts, we need to clear it
				// But we should only clear if this is the ONLY active course
				// For now, we'll just mark it as archived and let activation of another course replace it
				console.log(`[archive] Note: moduleContent.ts will be replaced when another course is activated`);
			}
			
			// Clear timings for this course from public/timings/
			if (fs.existsSync(publicTimingsDir)) {
				const timingFiles = fs.readdirSync(publicTimingsDir).filter(f => f.endsWith('.json'));
				// Remove timings that belong to this course (they typically have course/module identifiers)
				// For now, we'll clear all timings - the next activation will restore the active course's timings
				let removedCount = 0;
				for (const file of timingFiles) {
					// Check if file belongs to this course (filename patterns vary)
					// For safety, we'll remove all and let activation restore the active course
					try {
						fs.unlinkSync(path.join(publicTimingsDir, file));
						removedCount++;
					} catch (e) {
						console.warn(`[archive] Could not remove timing file ${file}:`, e.message);
					}
				}
				if (removedCount > 0) {
					console.log(`[archive] Removed ${removedCount} timing files from public/timings/`);
				}
			}
		} catch (deactivateError) {
			console.warn('[archive] Warning: Could not fully deactivate from Remotion:', deactivateError.message);
			// Continue with archiving even if deactivation fails
		}
		
		// Step 2: Archive the course in courses.json
		data.courses[courseIndex].status = 'archived';
		data.courses[courseIndex].archivedAt = new Date().toISOString();
		
		if (!writeCoursesJson(data)) {
			return res.status(500).json({ error: 'Failed to save course data' });
		}
		
		console.log(`[archive] Course "${data.courses[courseIndex].title}" archived successfully`);
		
		res.json({ 
			success: true, 
			message: `Course "${data.courses[courseIndex].title}" has been archived and removed from Remotion`,
			course: data.courses[courseIndex],
			note: 'Restart Remotion Studio to see changes'
		});
	} catch (error) {
		console.error('Error archiving course:', error);
		res.status(500).json({ error: error.message });
	}
});

// API: Restore an archived course (also activates it)
app.post('/api/courses/:id/restore', async (req, res) => {
	const courseId = req.params.id;
	console.log(`[restore] Restoring and activating course: ${courseId}`);
	
	const courseDir = path.join(__dirname, 'courses', courseId);
	const contentJsonPath = path.join(courseDir, 'content.json');
	const scriptsDir = path.join(courseDir, 'course/scripts');
	const timingsDir = path.join(courseDir, 'timings');
	const publicTimingsDir = path.join(__dirname, 'public', 'timings');
	
	// Check if course directory exists
	if (!fs.existsSync(courseDir)) {
		return res.status(404).json({ 
			error: `Course not found: ${courseId}`,
			details: `Expected course directory at: ${courseDir}`
		});
	}
	
	try {
		const data = readCoursesJson();
		const courseIndex = data.courses.findIndex(c => c.id === courseId);
		if (courseIndex === -1) {
			return res.status(404).json({ error: 'Course not found in courses.json' });
		}
		
		if (data.courses[courseIndex].status === 'active') {
			return res.status(400).json({ error: 'Course is already active' });
		}
		
		const moduleContentPath = path.join(__dirname, 'src', 'videos', 'moduleContent.ts');
		
		// Backup existing file
		if (fs.existsSync(moduleContentPath)) {
			const backupPath = moduleContentPath.replace('.ts', `.backup.${Date.now()}.ts`);
			fs.copyFileSync(moduleContentPath, backupPath);
			console.log(`[restore] Backed up to: ${path.basename(backupPath)}`);
		}
		
		let modulesGenerated = 0;
		let courseName = data.courses[courseIndex].title;
		
		// Check which activation method to use
		if (fs.existsSync(contentJsonPath)) {
			// Method 1: Use content.json (standard courses)
			console.log(`[restore] Using content.json activation method`);
			const plan = JSON.parse(fs.readFileSync(contentJsonPath, 'utf-8'));
			courseName = plan.courseName || courseName;
			console.log(`[restore] Loaded: ${courseName} (${plan.modules?.length || 0} modules)`);
			
			// Generate moduleContent.ts code
			const lines = [
				`// Auto-generated course content by restoreCourse API`,
				`// Course: ${courseName}`,
				`// Course ID: ${courseId}`,
				`// Restored: ${new Date().toISOString()}`,
				``,
				`export interface SlideContent {`,
				`	name: string;`,
				`	type: "title" | "content-two-card" | "content-single" | "code" | "code-diagram" | "comparison";`,
				`	script: string;`,
				`	title?: string;`,
				`	subtitle?: string;`,
				`	points?: string[];`,
				`	code?: string;`,
				`	language?: string;`,
				`	imageSrc?: string;`,
				`	leftTitle?: string;`,
				`	leftItems?: string[];`,
				`	rightTitle?: string;`,
				`	rightItems?: string[];`,
				`	scene?: string;`,
				`}`,
				``,
				`export interface ModuleContent {`,
				`	moduleNumber: number;`,
				`	courseId: string;`,
				`	title: string;`,
				`	subtitle: string;`,
				`	slides: SlideContent[];`,
				`}`,
				``
			];
			
			for (const mod of plan.modules) {
				lines.push(`export const module${mod.moduleNumber}Content: ModuleContent = {`);
				lines.push(`	moduleNumber: ${mod.moduleNumber},`);
				lines.push(`	courseId: ${JSON.stringify(courseId)},`);
				lines.push(`	title: ${JSON.stringify(mod.title)},`);
				lines.push(`	subtitle: ${JSON.stringify(mod.subtitle)},`);
				lines.push(`	slides: [`);
				
				for (const slide of mod.slides) {
					lines.push(`		{`);
					lines.push(`			name: ${JSON.stringify(slide.name)},`);
					lines.push(`			type: ${JSON.stringify(slide.type)},`);
					lines.push(`			script: ${JSON.stringify(slide.script)},`);
					
					if (slide.title) lines.push(`			title: ${JSON.stringify(slide.title)},`);
					if (slide.subtitle) lines.push(`			subtitle: ${JSON.stringify(slide.subtitle)},`);
					if (slide.points) lines.push(`			points: ${JSON.stringify(slide.points)},`);
					if (slide.code) lines.push(`			code: ${JSON.stringify(slide.code)},`);
					if (slide.language) lines.push(`			language: ${JSON.stringify(slide.language)},`);
					if (slide.imageSrc) lines.push(`			imageSrc: ${JSON.stringify(slide.imageSrc)},`);
					if (slide.leftTitle) lines.push(`			leftTitle: ${JSON.stringify(slide.leftTitle)},`);
					if (slide.leftItems) lines.push(`			leftItems: ${JSON.stringify(slide.leftItems)},`);
					if (slide.rightTitle) lines.push(`			rightTitle: ${JSON.stringify(slide.rightTitle)},`);
					if (slide.rightItems) lines.push(`			rightItems: ${JSON.stringify(slide.rightItems)},`);
					
					lines.push(`		},`);
				}
				
				lines.push(`	]`);
				lines.push(`};`);
				lines.push(``);
			}
			
			const moduleNames = plan.modules.map(m => `module${m.moduleNumber}Content`);
			lines.push(`export const allModules: ModuleContent[] = [`);
			lines.push(`	${moduleNames.join(',\n\t')}`);
			lines.push(`];`);
			
			fs.writeFileSync(moduleContentPath, lines.join('\n'));
			modulesGenerated = plan.modules?.length || 0;
			console.log(`[restore] Written: moduleContent.ts (${modulesGenerated} modules)`);
			
		} else if (fs.existsSync(scriptsDir)) {
			// Method 2: Use script files (SSML-based courses like agentic-ai-for-beginners)
			console.log(`[restore] Using script files activation method`);
			try {
				// Run the activation script
				const result = execSync(`npx tsx scripts/activateCourseFromSSML.ts ${courseId}`, { 
					cwd: __dirname, 
					stdio: ['ignore', 'pipe', 'pipe'],
					encoding: 'utf-8'
				});
				console.log(`[restore] Script output:`, result);
				
				// Wait a moment for file system to sync
				await new Promise(resolve => setTimeout(resolve, 500));
				
				// Verify the file was actually updated
				if (!fs.existsSync(moduleContentPath)) {
					throw new Error('moduleContent.ts was not created');
				}
				
				const generatedContent = fs.readFileSync(moduleContentPath, 'utf-8');
				
				// Verify it contains the correct courseId
				const hasCorrectCourseId = generatedContent.includes(`courseId: "${courseId}"`) || 
				                           generatedContent.includes(`courseId: '${courseId}'`);
				
				if (!hasCorrectCourseId) {
					console.error(`[restore] ERROR: Generated file does not contain correct courseId "${courseId}"`);
					console.error(`[restore] File content preview (first 1000 chars):`, generatedContent.substring(0, 1000));
					throw new Error(`Generated moduleContent.ts does not contain courseId "${courseId}". The activation script may have failed.`);
				}
				
				// Count modules
				const moduleMatches = generatedContent.match(/export const module\d+Content/g);
				modulesGenerated = moduleMatches ? moduleMatches.length : 0;
				console.log(`[restore] Successfully generated moduleContent.ts from scripts (${modulesGenerated} modules for course "${courseId}")`);
			} catch (scriptErr) {
				console.error('[restore] Failed to activate from scripts:', scriptErr);
				const errorMsg = scriptErr.message || scriptErr.toString();
				const errorOutput = scriptErr.stderr || scriptErr.stdout || '';
				return res.status(500).json({ 
					error: 'Failed to activate course from scripts',
					details: errorMsg,
					output: errorOutput
				});
			}
		} else {
			return res.status(404).json({ 
				error: `Course structure not recognized: ${courseId}`,
				details: `Expected either content.json or course/scripts/ directory`
			});
		}
		
		// Step 3: Copy timings to public/timings/
		if (!fs.existsSync(publicTimingsDir)) {
			fs.mkdirSync(publicTimingsDir, { recursive: true });
		}
		
		// Clear existing timings
		const existingFiles = fs.readdirSync(publicTimingsDir).filter(f => f.endsWith('.json'));
		for (const file of existingFiles) {
			fs.unlinkSync(path.join(publicTimingsDir, file));
		}
		console.log(`[restore] Cleared ${existingFiles.length} existing timing files`);
		
		// Copy course timings
		let timingsCopied = 0;
		if (fs.existsSync(timingsDir)) {
			const timingFiles = fs.readdirSync(timingsDir).filter(f => f.endsWith('.json'));
			for (const file of timingFiles) {
				fs.copyFileSync(
					path.join(timingsDir, file),
					path.join(publicTimingsDir, file)
				);
				timingsCopied++;
			}
			console.log(`[restore] Copied ${timingsCopied} timing files`);
		}
		
		// Step 3.5: Align diagram phases (generate animation specs, copy SVGs)
		try {
			execSync(`npx tsx scripts/generateAnimationSpecs.ts ${courseId}`, { cwd: __dirname, stdio: 'pipe' });
			execSync(`npx tsx scripts/copySvgsToPublic.ts ${courseId}`, { cwd: __dirname, stdio: 'pipe' });
			console.log('[restore] Diagram phases aligned');
		} catch (alignErr) {
			console.warn('[restore] Align diagram phases skipped or failed:', alignErr?.message || alignErr);
		}
		
		// Step 4: Update courses.json (restore status)
		data.courses[courseIndex].status = 'active';
		data.courses[courseIndex].archivedAt = null;
		
		if (!writeCoursesJson(data)) {
			return res.status(500).json({ error: 'Failed to save course data' });
		}
		
		res.json({
			success: true,
			message: `Course "${courseName}" has been restored and activated`,
			course: data.courses[courseIndex],
			courseId,
			modulesGenerated,
			timingsCopied,
			note: 'Restart Remotion Studio to see changes'
		});
		
	} catch (error) {
		console.error('[restore] Error:', error);
		res.status(500).json({ error: error.message });
	}
});

// API: Activate a course (copy timings to public/, regenerate modules)
app.post('/api/courses/:id/activate', (req, res) => {
	const courseId = req.params.id;
	console.log(`[activate] Activating course: ${courseId}`);
	
	const courseDir = path.join(__dirname, 'courses', courseId);
	const contentJsonPath = path.join(courseDir, 'content.json');
	const timingsDir = path.join(courseDir, 'timings');
	const publicTimingsDir = path.join(__dirname, 'public', 'timings');
	
	// Check if course exists
	if (!fs.existsSync(contentJsonPath)) {
		return res.status(404).json({ 
			error: `Course not found: ${courseId}`,
			details: `Expected content.json at: ${contentJsonPath}`
		});
	}
	
	try {
		// Step 1: Load content.json
		const plan = JSON.parse(fs.readFileSync(contentJsonPath, 'utf-8'));
		console.log(`[activate] Loaded: ${plan.courseName} (${plan.modules?.length || 0} modules)`);
		
		// Step 2: Generate moduleContent.ts
		const moduleContentPath = path.join(__dirname, 'src', 'videos', 'moduleContent.ts');
		
		// Backup existing file
		if (fs.existsSync(moduleContentPath)) {
			const backupPath = moduleContentPath.replace('.ts', `.backup.${Date.now()}.ts`);
			fs.copyFileSync(moduleContentPath, backupPath);
			console.log(`[activate] Backed up to: ${path.basename(backupPath)}`);
		}
		
		// Generate moduleContent.ts code
		const lines = [
			`// Auto-generated course content by activateCourse API`,
			`// Course: ${plan.courseName}`,
			`// Course ID: ${courseId}`,
			`// Activated: ${new Date().toISOString()}`,
			``,
			`export interface SlideContent {`,
			`	name: string;`,
			`	type: "title" | "content-two-card" | "content-single" | "code" | "code-diagram" | "comparison";`,
			`	script?: string;`,
			`	scripts?: string[];`,
			`	title?: string;`,
			`	subtitle?: string;`,
			`	points?: string[];`,
			`	code?: string;`,
			`	language?: string;`,
			`	imageSrc?: string;`,
			`	leftTitle?: string;`,
			`	leftItems?: string[];`,
			`	rightTitle?: string;`,
			`	rightItems?: string[];`,
			`	scene?: string;`,
			`}`,
			``,
			`export interface ModuleContent {`,
			`	moduleNumber: number;`,
			`	courseId: string;`,
			`	title: string;`,
			`	subtitle: string;`,
			`	slides: SlideContent[];`,
			`}`,
			``
		];
		
		for (const mod of plan.modules) {
			lines.push(`export const module${mod.moduleNumber}Content: ModuleContent = {`);
			lines.push(`	moduleNumber: ${mod.moduleNumber},`);
			lines.push(`	courseId: ${JSON.stringify(courseId)},`);
			lines.push(`	title: ${JSON.stringify(mod.title)},`);
			lines.push(`	subtitle: ${JSON.stringify(mod.subtitle)},`);
			lines.push(`	slides: [`);
			
			for (const slide of mod.slides) {
				lines.push(`		{`);
				lines.push(`			name: ${JSON.stringify(slide.name)},`);
				lines.push(`			type: ${JSON.stringify(slide.type)},`);
				if (slide.scripts && slide.scripts.length >= 1) {
					lines.push(`			scripts: ${JSON.stringify(slide.scripts)},`);
					lines.push(`			script: undefined,`);
				} else {
					lines.push(`			script: ${JSON.stringify(slide.script || '')},`);
				}
				if (slide.title) lines.push(`			title: ${JSON.stringify(slide.title)},`);
				if (slide.subtitle) lines.push(`			subtitle: ${JSON.stringify(slide.subtitle)},`);
				if (slide.points) lines.push(`			points: ${JSON.stringify(slide.points)},`);
				if (slide.code) lines.push(`			code: ${JSON.stringify(slide.code)},`);
				if (slide.language) lines.push(`			language: ${JSON.stringify(slide.language)},`);
				if (slide.imageSrc) lines.push(`			imageSrc: ${JSON.stringify(slide.imageSrc)},`);
				if (slide.leftTitle) lines.push(`			leftTitle: ${JSON.stringify(slide.leftTitle)},`);
				if (slide.leftItems) lines.push(`			leftItems: ${JSON.stringify(slide.leftItems)},`);
				if (slide.rightTitle) lines.push(`			rightTitle: ${JSON.stringify(slide.rightTitle)},`);
				if (slide.rightItems) lines.push(`			rightItems: ${JSON.stringify(slide.rightItems)},`);
				
				lines.push(`		},`);
			}
			
			lines.push(`	]`);
			lines.push(`};`);
			lines.push(``);
		}
		
		const moduleNames = plan.modules.map(m => `module${m.moduleNumber}Content`);
		lines.push(`export const allModules: ModuleContent[] = [`);
		lines.push(`	${moduleNames.join(',\n\t')}`);
		lines.push(`];`);
		
		fs.writeFileSync(moduleContentPath, lines.join('\n'));
		console.log(`[activate] Written: moduleContent.ts`);
		
		// Step 3: Copy timings to public/timings/
		if (!fs.existsSync(publicTimingsDir)) {
			fs.mkdirSync(publicTimingsDir, { recursive: true });
		}
		
		// Clear existing timings
		const existingFiles = fs.readdirSync(publicTimingsDir).filter(f => f.endsWith('.json'));
		for (const file of existingFiles) {
			fs.unlinkSync(path.join(publicTimingsDir, file));
		}
		console.log(`[activate] Cleared ${existingFiles.length} existing timing files`);
		
		// Copy course timings
		let timingsCopied = 0;
		if (fs.existsSync(timingsDir)) {
			const timingFiles = fs.readdirSync(timingsDir).filter(f => f.endsWith('.json'));
			for (const file of timingFiles) {
				fs.copyFileSync(
					path.join(timingsDir, file),
					path.join(publicTimingsDir, file)
				);
				timingsCopied++;
			}
			console.log(`[activate] Copied ${timingsCopied} timing files`);
		}
		
		// Step 3.5: Align diagram phases (generate animation specs, copy SVGs)
		try {
			execSync(`npx tsx scripts/generateAnimationSpecs.ts ${courseId}`, { cwd: __dirname, stdio: 'pipe' });
			execSync(`npx tsx scripts/copySvgsToPublic.ts ${courseId}`, { cwd: __dirname, stdio: 'pipe' });
			console.log('[activate] Diagram phases aligned');
		} catch (alignErr) {
			console.warn('[activate] Align diagram phases skipped or failed:', alignErr?.message || alignErr);
		}
		
		// Step 4: Update courses.json
		const coursesData = readCoursesJson();
		const courseIndex = coursesData.courses.findIndex(c => c.id === courseId);
		if (courseIndex >= 0) {
			if (coursesData.courses[courseIndex].status === 'archived') {
				coursesData.courses[courseIndex].status = 'active';
				coursesData.courses[courseIndex].archivedAt = null;
			}
		}
		writeCoursesJson(coursesData);
		
		res.json({
			success: true,
			message: `Course "${courseId}" activated successfully`,
			courseId,
			modulesGenerated: plan.modules.length,
			timingsCopied,
			note: 'Restart Remotion Studio to see changes'
		});
		
	} catch (error) {
		console.error('[activate] Error:', error);
		res.status(500).json({ error: error.message });
	}
});

// API: Get all modules (optionally filtered by course)
app.get('/api/modules', (req, res) => {
	try {
		const courseId = req.query.course; // Optional - if not provided, return all modules
		const contentPath = path.join(__dirname, 'src', 'videos', 'moduleContent.ts');
		const content = fs.readFileSync(contentPath, 'utf-8');
		
		// Extract module data using regex (simple approach)
		const moduleMatches = content.match(/export const module\d+Content: ModuleContent = \{[\s\S]*?\};/g);
		
		if (!moduleMatches) {
			return res.json({ modules: [], courseId: courseId || 'all' });
		}
		
		// Get course-to-module mappings from courses.json
		const coursesData = readCoursesJson();
		const courseModuleMap = coursesData.courseModuleMapping || {};
		
		// If courseId is specified, filter to that course's modules
		let moduleNumbers = [];
		if (courseId && courseModuleMap[courseId]) {
			moduleNumbers = courseModuleMap[courseId];
		}
		
		const modules = moduleMatches
			.map((match) => {
				// Extract actual module number from the export statement
				const moduleNumberMatch = match.match(/export const module(\d+)Content:/);
				if (!moduleNumberMatch) {
					return null;
				}
				const moduleNumber = parseInt(moduleNumberMatch[1]);
				
				// If courseId is specified, only include modules for that course
				if (courseId && moduleNumbers.length > 0 && !moduleNumbers.includes(moduleNumber)) {
					return null;
				}
				
				// Find which course(s) this module belongs to
				const moduleCourseIds = [];
				for (const [cId, modNums] of Object.entries(courseModuleMap)) {
					if (modNums.includes(moduleNumber)) {
						moduleCourseIds.push(cId);
					}
				}
				// If module doesn't belong to any course, assign to first course or 'uncategorized'
				const assignedCourseId = moduleCourseIds.length > 0 ? moduleCourseIds[0] : (courseId || 'uncategorized');
				
				const titleMatch = match.match(/title:\s*"([^"]+)"/);
				const subtitleMatch = match.match(/subtitle:\s*"([^"]+)"/);
				const slidesContent = extractSlidesContent(match);
				
				// Check if module is ready for Remotion (needs: module files, audio files, audio durations)
				const moduleFile = path.join(__dirname, 'src', 'videos', `Module${moduleNumber}.tsx`);
				const configFile = path.join(__dirname, 'src', 'videos', `Module${moduleNumber}Config.ts`);
				const hasModuleFiles = fs.existsSync(moduleFile) && fs.existsSync(configFile);
				
				// Check audio files (use course-specific directory)
				const course = courseId || 'default';
				const audioDir = path.join(__dirname, 'public', 'audio', course);
				const slideNames = slidesContent ? extractSlideNames(slidesContent) : [];
				const audioFiles = slideNames.map(name => path.join(audioDir, `module${moduleNumber}-${name}.wav`));
				const hasAllAudio = audioFiles.length > 0 && audioFiles.every(file => fs.existsSync(file) && fs.statSync(file).size > 0);
				const audioComplete = audioFiles.filter(file => fs.existsSync(file) && fs.statSync(file).size > 0).length;
				
				// Check audio durations (with course prefix)
				const audioDurationPath = path.join(__dirname, 'src', 'utils', 'audioDuration.ts');
				let hasAudioDurations = false;
				if (fs.existsSync(audioDurationPath)) {
					const audioDurationContent = fs.readFileSync(audioDurationPath, 'utf-8');
					// Audio duration keys now include course prefix: {courseId}/module{N}-{name}
					const audioKeys = slideNames.map(name => `${course}/module${moduleNumber}-${name}`);
					hasAudioDurations = audioKeys.every(key => {
						const keyPattern = new RegExp(`"${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"\\s*:\\s*[\\d.]+`);
						return keyPattern.test(audioDurationContent);
					});
				}
				
				// Check word timings from course-specific JSON (REQUIRED for fully animated)
				const courseTimingsDir = path.join(__dirname, 'courses', course, 'timings');
				const timingsJsonPath = path.join(courseTimingsDir, `module${moduleNumber}.json`);
				let hasTimings = false;
				let timingsComplete = false; // All slides have word timings
				if (fs.existsSync(timingsJsonPath)) {
					try {
						const moduleTimings = JSON.parse(fs.readFileSync(timingsJsonPath, 'utf-8'));
						if (moduleTimings.slides) {
							// Check if ALL slides have word timings
							const slidesWithTimings = slideNames.filter(slideName => {
								const slideTimings = moduleTimings.slides[slideName];
								return slideTimings && slideTimings.words && slideTimings.words.length > 0;
							});
							hasTimings = slidesWithTimings.length > 0;
							timingsComplete = slidesWithTimings.length === slideNames.length;
						}
					} catch (e) {
						// Invalid JSON
					}
				}
				
				// Basic preview: Steps 1-3 complete (can view in Remotion but animations won't sync)
				const basicPreview = hasModuleFiles && hasAllAudio && hasAudioDurations;
				// Fully animated: All steps complete including word timings (animations sync properly)
				const fullyAnimated = basicPreview && timingsComplete;
				
				// Legacy: readyForRemotion = basicPreview (for backward compatibility)
				// New: animationStatus clearly distinguishes the two states
				const readyForRemotion = basicPreview;
				
				return {
					moduleNumber,
					courseId: assignedCourseId,
					courseIds: moduleCourseIds, // All courses this module belongs to
					title: titleMatch ? titleMatch[1] : `Module ${moduleNumber}`,
					subtitle: subtitleMatch ? subtitleMatch[1] : '',
					slideCount: slideNames.length,
					readyForRemotion,
					// NEW: Clear animation status
					animationStatus: fullyAnimated ? 'fullyAnimated' : (basicPreview ? 'basicPreview' : 'incomplete'),
					// Step status for UI indicators
					stepStatus: {
						segmentGenerated: hasModuleFiles,
						audioGenerated: hasAllAudio,
						audioMeasured: hasAudioDurations,
						timingsExtracted: timingsComplete // Changed: now requires ALL slides
					},
					audioComplete,
					audioTotal: slideNames.length
				};
			})
			.filter(m => m !== null);
		
		res.json({ modules, courseId: courseId || 'all' });
	} catch (error) {
		console.error('Error reading modules:', error);
		res.status(500).json({ error: error.message });
	}
});

// API: Get full module content (parsed)
app.get('/api/modules/:moduleNumber', async (req, res) => {
	try {
		const contentPath = path.join(__dirname, 'src', 'videos', 'moduleContent.ts');
		const content = fs.readFileSync(contentPath, 'utf-8');
		
		// Try to use the TypeScript parser if available, otherwise return raw
		try {
			const { execSync } = require('child_process');
			// Use tsx to run the parser
			const parserPath = path.join(__dirname, 'scripts', 'parseModuleContent.ts');
			const result = execSync(`npx tsx ${parserPath}`, { encoding: 'utf-8', cwd: __dirname });
			// For now, return raw content - full parsing integration coming
			res.json({ content, parsed: false });
		} catch {
			// Fallback to raw content
			res.json({ content, parsed: false });
		}
	} catch (error) {
		console.error('Error reading module:', error);
		res.status(500).json({ error: error.message });
	}
});

// API: Create new module
app.post('/api/modules', (req, res) => {
	try {
		const { courseId, moduleNumber, title, subtitle, videoCategory, slides } = req.body;
		
		if (!courseId || !moduleNumber || !title || !subtitle) {
			return res.status(400).json({ error: 'Course ID, module number, title, and subtitle are required' });
		}
		
		const contentPath = path.join(__dirname, 'src', 'videos', 'moduleContent.ts');
		let content = fs.readFileSync(contentPath, 'utf-8');
		
		// Check if module already exists
		if (content.includes(`export const module${moduleNumber}Content:`)) {
			return res.status(400).json({ error: `Module ${moduleNumber} already exists` });
		}
		
		// Build slides array
		let slidesCode = '';
		if (slides && Array.isArray(slides) && slides.length > 0) {
			// Use provided slides (validate they're complete)
			slidesCode = slides.filter(slide => slide && slide.name && slide.type && slide.script).map(slide => {
				let slideCode = `\t\t{\n\t\t\tname: "${(slide.name || '').replace(/"/g, '\\"')}",\n\t\t\ttype: "${slide.type || 'content-single'}",\n\t\t\tscript: "${(slide.script || '').replace(/"/g, '\\"')}"`;
				
				if (slide.type === 'title' && slide.subtitle) {
					slideCode += `,\n\t\t\tsubtitle: "${(slide.subtitle || '').replace(/"/g, '\\"')}"`;
				}
				
				if (slide.title) {
					slideCode += `,\n\t\t\ttitle: "${(slide.title || '').replace(/"/g, '\\"')}"`;
				}
				
				if (slide.points && Array.isArray(slide.points) && slide.points.length > 0) {
					const pointsCode = slide.points
						.filter(p => p && p.trim())
						.map(p => `\t\t\t\t"${p.replace(/"/g, '\\"')}"`)
						.join(',\n');
					slideCode += `,\n\t\t\tpoints: [\n${pointsCode}\n\t\t\t]`;
				}
				
				slideCode += '\n\t\t}';
				return slideCode;
			}).join(',\n');
		} else {
			// Default: just title slide
			slidesCode = `\t\t{
\t\t\tname: "title",
\t\t\ttype: "title",
\t\t\tscript: "Welcome to ${title}",
\t\t\tsubtitle: "${subtitle.replace(/"/g, '\\"')}",
\t\t}`;
		}
		
		// Create new module content
		const videoCategoryLine = videoCategory && videoCategory !== 'standard' 
			? `\tvideoCategory: "${videoCategory}",\n` 
			: '';
		const newModule = `// ============================================================================
// MODULE ${moduleNumber}: ${title}
// ============================================================================
export const module${moduleNumber}Content: ModuleContent = {
\tmoduleNumber: ${moduleNumber},
\ttitle: "${title.replace(/"/g, '\\"')}",
\tsubtitle: "${subtitle.replace(/"/g, '\\"')}",
\tslides: [
${slidesCode}
\t]
};`;
		
		// Add module before allModules array
		const allModulesMatch = content.match(/(export const allModules: ModuleContent\[\] = \[)/);
		if (allModulesMatch) {
			content = content.replace(
				/(export const allModules: ModuleContent\[\] = \[)/,
				`${newModule}$1`
			);
			
			// Add module to allModules array
			const moduleArrayMatch = content.match(/export const allModules: ModuleContent\[\] = \[([\s\S]*?)\];/);
			if (moduleArrayMatch) {
				const modulesContent = moduleArrayMatch[1].trim();
				const newModulesContent = modulesContent
					? `${modulesContent},\n\tmodule${moduleNumber}Content`
					: `\n\tmodule${moduleNumber}Content\n\t`;
				content = content.replace(
					/export const allModules: ModuleContent\[\] = \[[\s\S]*?\];/,
					`export const allModules: ModuleContent[] = [${newModulesContent}\n];`
				);
			}
		}
		
		// Update course structure to include this module
		const coursePath = path.join(__dirname, 'src', 'videos', 'courseStructure.ts');
		let courseContent = fs.readFileSync(coursePath, 'utf-8');
		
		// Find the course mapping and add module number
		const mappingRegex = new RegExp(`('${courseId.replace(/'/g, "\\'")}':\\s*\\[)([\\s\\S]*?)(\\])`);
		const mappingMatch = courseContent.match(mappingRegex);
		if (mappingMatch) {
			const modulesList = mappingMatch[2].trim();
			const newModulesList = modulesList
				? `${modulesList}, ${moduleNumber}`
				: `${moduleNumber}`;
			courseContent = courseContent.replace(
				mappingRegex,
				`$1${newModulesList}$3`
			);
			
			// Update moduleCount for the course
			const courseRegex = new RegExp(`(id:\\s*'${courseId.replace(/'/g, "\\'")}'[\\s\\S]*?moduleCount:\\s*)(\\d+)`);
			const courseMatch = courseContent.match(courseRegex);
			if (courseMatch) {
				const currentCount = parseInt(courseMatch[2]) || 0;
				courseContent = courseContent.replace(courseRegex, `$1${currentCount + 1}`);
			}
		}
		
		fs.writeFileSync(contentPath, content);
		fs.writeFileSync(coursePath, courseContent);
		console.log(`Created new module: ${moduleNumber} for course: ${courseId}`);
		
		res.json({ success: true, moduleNumber });
	} catch (error) {
		console.error('Error creating module:', error);
		res.status(500).json({ error: error.message });
	}
});

// API: Improve module - add new slides based on instructions (only new slides need audio/timings)
app.post('/api/modules/:moduleNumber/improve', async (req, res) => {
	try {
		const moduleNumber = parseInt(req.params.moduleNumber);
		const { moduleData, improvementInstructions } = req.body;

		if (!moduleData || !improvementInstructions || typeof improvementInstructions !== 'string') {
			return res.status(400).json({
				error: 'moduleData and improvementInstructions (string) are required'
			});
		}

		const apiKey = process.env.OPENAI_API_KEY;
		if (!apiKey) {
			return res.status(500).json({ error: 'OPENAI_API_KEY is not configured' });
		}

		const slides = moduleData.slides || [];
		if (slides.length === 0) {
			return res.status(400).json({ error: 'Module has no slides' });
		}

		const systemPrompt = `You are an expert course/video content editor. Your task is to ADD new slides to an existing module based on improvement instructions. You must NOT remove or modify any existing slides. Only add new slides.

RULES:
- Preserve ALL existing slides exactly as given (same name, type, script, title, points, code, etc.)
- Add NEW slides only, inserted in the most relevant section of the module
- New slide names must be unique (e.g. "detail-architecture", "example-auth-flow", "clarification-X")
- Scripts: single paragraph, 40-55 words for standard courses; 15-22 for shorts
- Follow the same slide types: title, content-two-card, content-single, code, comparison, code-diagram, sequential-bullet
- Scripts: 40-55 words per slide for standard; 15-22 for shorts
- Bullet points: extract from script, 3-8 words each, max 4 per slide
- Return valid JSON only: { "slides": [ ... ] } with the full slides array (existing + new, in order)`;

		const userPrompt = `Current module "${moduleData.title}" (${slides.length} slides):

${JSON.stringify(slides, null, 2)}

IMPROVEMENT INSTRUCTIONS:
${improvementInstructions.trim()}

Return the complete slides array as JSON: { "slides": [ ... ] }. Include all existing slides unchanged plus new slides in the appropriate positions.`;

		const response = await fetch('https://api.openai.com/v1/chat/completions', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${apiKey}`
			},
			body: JSON.stringify({
				model: 'gpt-4o',
				messages: [
					{ role: 'system', content: systemPrompt },
					{ role: 'user', content: userPrompt }
				],
				temperature: 0.5,
				response_format: { type: 'json_object' }
			})
		});

		if (!response.ok) {
			const errorText = await response.text();
			throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
		}

		const json = await response.json();
		const content = json.choices?.[0]?.message?.content;
		if (!content) {
			return res.status(500).json({ error: 'Empty response from AI' });
		}

		let parsed;
		try {
			parsed = JSON.parse(content);
		} catch (e) {
			return res.status(500).json({
				error: 'Invalid JSON from AI',
				details: content.substring(0, 500)
			});
		}

		if (!parsed.slides || !Array.isArray(parsed.slides)) {
			return res.status(500).json({ error: 'AI response missing slides array' });
		}

		const originalNames = new Set(slides.map(s => s.name));
		const newSlides = parsed.slides.filter(s => s && s.name && !originalNames.has(s.name));
		const keptCount = parsed.slides.length - newSlides.length;

		console.log(`[improve-module] Module ${moduleNumber}: ${newSlides.length} new slides added, ${keptCount} existing preserved`);

		res.json({
			success: true,
			moduleNumber,
			slides: parsed.slides,
			title: moduleData.title,
			subtitle: moduleData.subtitle,
			newSlidesCount: newSlides.length,
			message: `Added ${newSlides.length} new slide(s). Save to apply. Only new slides will need audio and timings.`
		});
	} catch (error) {
		console.error('[improve-module] Error:', error);
		res.status(500).json({
			error: error.message || 'Failed to improve module'
		});
	}
});

// API: Save module
app.post('/api/modules/:moduleNumber', (req, res) => {
	try {
		const moduleNumber = parseInt(req.params.moduleNumber);
		const { title, subtitle, slides } = req.body;
		
		if (!title || !subtitle || !slides || !Array.isArray(slides)) {
			return res.status(400).json({ error: 'Title, subtitle, and slides array are required' });
		}
		
		const contentPath = path.join(__dirname, 'src', 'videos', 'moduleContent.ts');
		let content = fs.readFileSync(contentPath, 'utf-8');
		
		// Find the module
		const moduleRegex = new RegExp(`export const module${moduleNumber}Content: ModuleContent = \\{([\\s\\S]*?)\\};`);
		const moduleMatch = content.match(moduleRegex);
		
		if (!moduleMatch) {
			return res.status(404).json({ error: `Module ${moduleNumber} not found` });
		}
		
		// Extract existing courseId to preserve it
		const existingModuleBody = moduleMatch[1];
		const courseIdMatch = existingModuleBody.match(/courseId:\s*"([^"]+)"/);
		const courseId = courseIdMatch ? courseIdMatch[1] : 'default';
		
		// Build new module content
		const escapeScript = (s) => (s || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r');
		const slidesCode = slides.map(slide => {
			let slideCode = `\t\t{\n\t\t\tname: "${(slide.name || '').replace(/"/g, '\\"')}",\n\t\t\ttype: "${slide.type || 'content-single'}",\n\t\t\tscript: "${escapeScript(slide.script)}"`;
			
			if (slide.type === 'title' && slide.subtitle) {
				slideCode += `,\n\t\t\tsubtitle: "${(slide.subtitle || '').replace(/"/g, '\\"')}"`;
			}
			
			if (slide.title) {
				slideCode += `,\n\t\t\ttitle: "${(slide.title || '').replace(/"/g, '\\"')}"`;
			}
			
			if (slide.points && Array.isArray(slide.points) && slide.points.length > 0) {
				const pointsCode = slide.points
					.filter(p => p && p.trim())
					.map(p => `\t\t\t\t"${p.replace(/"/g, '\\"')}"`)
					.join(',\n');
				slideCode += `,\n\t\t\tpoints: [\n${pointsCode}\n\t\t\t]`;
			}
			
			if (slide.code) {
				slideCode += `,\n\t\t\tcode: \`${slide.code.replace(/`/g, '\\`')}\``;
			}
			
			if (slide.language) {
				slideCode += `,\n\t\t\tlanguage: "${slide.language}"`;
			}
			
			if (slide.leftItems && Array.isArray(slide.leftItems)) {
				const leftItemsCode = slide.leftItems
					.filter(i => i && i.trim())
					.map(i => `\t\t\t\t"${i.replace(/"/g, '\\"')}"`)
					.join(',\n');
				slideCode += `,\n\t\t\tleftItems: [\n${leftItemsCode}\n\t\t\t]`;
			}
			
			if (slide.rightItems && Array.isArray(slide.rightItems)) {
				const rightItemsCode = slide.rightItems
					.filter(i => i && i.trim())
					.map(i => `\t\t\t\t"${i.replace(/"/g, '\\"')}"`)
					.join(',\n');
				slideCode += `,\n\t\t\trightItems: [\n${rightItemsCode}\n\t\t\t]`;
			}
			
			if (slide.leftTitle) {
				slideCode += `,\n\t\t\tleftTitle: "${(slide.leftTitle || '').replace(/"/g, '\\"')}"`;
			}
			
			if (slide.rightTitle) {
				slideCode += `,\n\t\t\trightTitle: "${(slide.rightTitle || '').replace(/"/g, '\\"')}"`;
			}
			
			if (slide.imageSrc) {
				slideCode += `,\n\t\t\timageSrc: "${(slide.imageSrc || '').replace(/"/g, '\\"')}"`;
			}
			
			if (slide.svgPath) {
				slideCode += `,\n\t\t\tsvgPath: "${(slide.svgPath || '').replace(/"/g, '\\"')}"`;
			}
			
			slideCode += '\n\t\t}';
			return slideCode;
		}).join(',\n');
		
		const newModuleContent = `export const module${moduleNumber}Content: ModuleContent = {
\tmoduleNumber: ${moduleNumber},
	courseId: "${courseId}",
\ttitle: "${title.replace(/"/g, '\\"')}",
\tsubtitle: "${subtitle.replace(/"/g, '\\"')}",
\tslides: [
${slidesCode}
\t]
};`;
		
		// Replace the module in the file
		content = content.replace(moduleRegex, newModuleContent);
		
		fs.writeFileSync(contentPath, content);
		console.log(`Saved module ${moduleNumber}`);
		
		res.json({ success: true, moduleNumber });
	} catch (error) {
		console.error('Error saving module:', error);
		res.status(500).json({ error: error.message });
	}
});

// API: Save module (old placeholder - keeping for backward compatibility)
app.post('/api/modules/:moduleNumber/old', (req, res) => {
	try {
		const { moduleData } = req.body;
		// TODO: Implement proper TypeScript file writing
		// This is complex - need to parse, modify, and rewrite the file
		// For now, return success
		res.json({ success: true, message: 'Save functionality coming soon' });
	} catch (error) {
		console.error('Error saving module:', error);
		res.status(500).json({ error: error.message });
	}
});

// Pre-flight validation before running module generation script
function validateBeforeModuleGeneration(course, moduleRange) {
	const validation = { valid: true, errors: [], warnings: [] };
	try {
		const contentPath = path.join(__dirname, 'src', 'videos', 'moduleContent.ts');
		if (!fs.existsSync(contentPath)) {
			validation.valid = false;
			validation.errors.push('moduleContent.ts not found. Save a plan from the Video tab first.');
		}
		if (course) {
			const coursesData = readCoursesJson();
			const found = coursesData.courses?.some(c => c.id === course);
			if (!found) {
				validation.warnings.push(`Course "${course}" not in courses.json; generation may still run from moduleContent.ts.`);
			}
		}
	} catch (err) {
		validation.valid = false;
		validation.errors.push(String(err.message));
	}
	return validation;
}

// API: Generate modules
app.post('/api/generate-modules', (req, res) => {
	let { moduleRange, course, audioMode } = req.body;
	
	console.log(`[generate-modules] Received request:`, {
		moduleRange,
		course,
		audioMode,
		bodyKeys: Object.keys(req.body)
	});
	
	// Derive audioMode from course when not provided (match regenerate-modules behavior)
	if (course && !audioMode) {
		try {
			const coursesData = readCoursesJson();
			const c = coursesData.courses?.find(x => x.id === course);
			if (c && c.audioMode) audioMode = c.audioMode;
		} catch (e) {
			console.error('Error reading course audio mode:', e);
		}
	}
	
	// If course is provided, get module range from course
	let finalModuleRange = moduleRange;
	if (course && !moduleRange) {
		try {
			const coursePath = path.join(__dirname, 'src', 'videos', 'courseStructure.ts');
			if (fs.existsSync(coursePath)) {
				const courseContent = fs.readFileSync(coursePath, 'utf-8');
				const mappingMatch = courseContent.match(new RegExp(`'${course}':\\s*\\[([\\d,\\s]+)\\]`));
				if (mappingMatch) {
					const moduleNumbers = mappingMatch[1].split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
					if (moduleNumbers.length > 0) {
						// Format as range if sequential, otherwise comma-separated
						if (moduleNumbers.length === 1) {
							finalModuleRange = moduleNumbers[0].toString();
						} else {
							finalModuleRange = moduleNumbers.join(',');
						}
					}
				}
			}
		} catch (e) {
			console.error('Error getting course modules:', e);
		}
	}
	
	// Pre-flight validation: Check audio files and durations before generating modules
	const validation = validateBeforeModuleGeneration(course, finalModuleRange);
	if (!validation.valid) {
		return res.status(400).json({ 
			error: 'Pre-flight validation failed',
			validation: validation,
			message: validation.errors.join('; ')
		});
	}
	
	if (validation.warnings.length > 0) {
		console.warn('[generate-modules] Pre-flight warnings:', validation.warnings);
	}
	
	// Choose script based on audio mode
	let scriptPath;
	let scriptArgs;
	
	console.log(`[generate-modules] Checking audioMode: "${audioMode}" (type: ${typeof audioMode}), course: "${course}"`);
	
	if (audioMode === 'per-module' && course) {
		// Use scene-based generator for per-module mode
		scriptPath = path.join(__dirname, 'scripts', 'generateModulesFromScenes.ts');
		scriptArgs = `${course} ${finalModuleRange || '1-6'}`;
		console.log(`[generate-modules] ✓ Using scene-based generator for ${course} with range: ${finalModuleRange || '1-6'}`);
	} else {
		// Use standard slide-based generator for per-slide mode
		scriptPath = path.join(__dirname, 'scripts', 'generateModulesFromContent.ts');
		scriptArgs = finalModuleRange || 'all';
		console.log(`[generate-modules] ✓ Using slide-based generator with range: ${finalModuleRange || 'all'}`);
		if (audioMode !== 'per-module') {
			console.log(`[generate-modules]   Reason: audioMode is not 'per-module' (got: "${audioMode}")`);
		}
		if (!course) {
			console.log(`[generate-modules]   Reason: course is missing (got: "${course}")`);
		}
	}
	
	const command = `npx tsx "${scriptPath}" ${scriptArgs}`;
	
	exec(command, { cwd: __dirname, maxBuffer: 10 * 1024 * 1024 }, (error, stdout, stderr) => {
		if (error) {
			console.error('Module generation error:', error);
			return res.status(500).json({ error: error.message, stderr: stderr || stdout });
		}
		
		// Also regenerate line mappings to ensure code highlighting works (skip for per-module mode)
		if (audioMode !== 'per-module') {
			const lineMappingScript = path.join(__dirname, 'scripts', 'generateLineMappingsFromContent.ts');
			const lineMappingCommand = finalModuleRange 
				? `npx tsx "${lineMappingScript}" ${finalModuleRange}`
				: `npx tsx "${lineMappingScript}" all`;
			
			exec(lineMappingCommand, { cwd: __dirname, maxBuffer: 10 * 1024 * 1024 }, (err, lineMappingStdout, lineMappingStderr) => {
				// Line mapping errors are non-fatal - just log them
				if (err) {
					console.error('Line mapping generation warning:', err.message);
				}
				res.json({ 
					success: true, 
					output: stdout,
					lineMappings: lineMappingStdout || 'Line mappings regenerated',
					audioMode: audioMode || 'per-slide',
					validation: validation
				});
			});
		} else {
			res.json({ 
				success: true, 
				output: stdout,
				audioMode: 'per-module',
				message: 'Scene-based modules generated',
				validation: validation
			});
		}
	});
});

// API: Generate audio (bulk - supports OpenAI, MiniMax, RunPod)
app.post('/api/generate-audio', async (req, res) => {
	const { moduleRange, force, course, provider, voice } = req.body;
	
	const settings = loadVoiceSettings();
	const finalProvider = provider || settings.provider || 'openai';
	const finalVoice = voice || settings.defaultVoice?.[finalProvider] || 'onyx';
	
	console.log(`[generate-audio] Provider: ${finalProvider}, Voice: ${finalVoice}, Modules: ${moduleRange || 'all'}`);
	
	// For OpenAI, do inline generation
	if (finalProvider === 'openai') {
		try {
			const apiKey = process.env.OPENAI_API_KEY;
			if (!apiKey) {
				return res.status(400).json({ error: 'OPENAI_API_KEY not configured' });
			}
			
			// Read moduleContent - try require first for scripts support, else parse
			const contentPath = path.join(__dirname, 'src', 'videos', 'moduleContent.ts');
			let modules = [];
			try {
				const { allModules } = require(contentPath);
				modules = allModules.map(m => ({
					moduleNumber: m.moduleNumber,
					courseId: m.courseId || 'default',
					slides: m.slides.flatMap(s => {
						const scripts = (s.scripts && s.scripts.length >= 1) ? s.scripts : (s.script ? [s.script] : []);
						if (s.type === 'code' && scripts.length > 1) {
							return scripts.map((script, i) => ({
								name: `${s.name}-${i + 1}`,
								script: script,
								baseName: s.name
							}));
						}
						return [{ name: s.name, script: scripts[0] || '', baseName: s.name }];
					})
				}));
			} catch (e) {
				// Fallback: parse moduleContent.ts as text
				const content = fs.readFileSync(contentPath, 'utf-8');
				const moduleBlocks = content.split(/export const module\d+Content/);
				for (let i = 1; i < moduleBlocks.length; i++) {
					const block = moduleBlocks[i];
					const numMatch = block.match(/moduleNumber:\s*(\d+)/);
					const courseMatch = block.match(/courseId:\s*["']([^"']+)["']/);
					if (numMatch) {
						const moduleNum = parseInt(numMatch[1]);
						const courseId = courseMatch ? courseMatch[1] : 'default';
						const slides = [];
						const slideRegex = /\{\s*name:\s*["']([^"']+)["'][\s\S]*?script:\s*["']([\s\S]*?)["']\s*,/g;
						const slidesMatch = block.match(/slides:\s*\[([\s\S]*?)\]\s*,?\s*\}/);
						if (slidesMatch) {
							let slideMatch;
							while ((slideMatch = slideRegex.exec(slidesMatch[1])) !== null) {
								slides.push({
									name: slideMatch[1],
									script: slideMatch[2].replace(/\\"/g, '"').replace(/\\n/g, ' ')
								});
							}
						}
						modules.push({ moduleNumber: moduleNum, courseId, slides });
					}
				}
			}
			
			// Filter by range if specified
			let modulesToProcess = modules;
			if (moduleRange && moduleRange !== 'all') {
				const rangeNums = moduleRange.toString().split(',').flatMap(r => {
					if (r.includes('-')) {
						const [start, end] = r.split('-').map(n => parseInt(n.trim()));
						return Array.from({ length: end - start + 1 }, (_, i) => start + i);
					}
					return [parseInt(r.trim())];
				});
				modulesToProcess = modules.filter(m => rangeNums.includes(m.moduleNumber));
			}
			
			console.log(`[generate-audio] Found ${modules.length} modules, processing ${modulesToProcess.length}`);
			
			const results = { generated: 0, skipped: 0, failed: 0, details: [], failedItems: [] };
			
			// Load checkpoint if resuming
			const checkpointPath = path.join(__dirname, '.checkpoints', `audio-generation-${course || 'default'}.json`);
			let checkpoint = null;
			if (req.body.resume && fs.existsSync(checkpointPath)) {
				try {
					checkpoint = JSON.parse(fs.readFileSync(checkpointPath, 'utf-8'));
					console.log(`[generate-audio] Resuming from checkpoint: ${checkpoint.completed.length} completed, ${checkpoint.failed.length} failed`);
				} catch (e) {
					console.warn('[generate-audio] Could not load checkpoint:', e.message);
				}
			}
			
			// Ensure checkpoint directory exists
			const checkpointDir = path.join(__dirname, '.checkpoints');
			if (!fs.existsSync(checkpointDir)) {
				fs.mkdirSync(checkpointDir, { recursive: true });
			}
			
			// Initialize checkpoint
			if (!checkpoint) {
				checkpoint = {
					started: new Date().toISOString(),
					completed: [],
					failed: [],
					skipped: []
				};
			}
			
			for (const module of modulesToProcess) {
				const audioDir = path.join(__dirname, 'public', 'audio', module.courseId);
				if (!fs.existsSync(audioDir)) {
					fs.mkdirSync(audioDir, { recursive: true });
				}
				
				console.log(`[generate-audio] Module ${module.moduleNumber}: ${module.slides.length} slides`);
				
				for (const slide of module.slides) {
					const audioPath = path.join(audioDir, `module${module.moduleNumber}-${slide.name}.wav`);
					const itemKey = `${module.moduleNumber}-${slide.name}`;
					
					// Skip if already completed (checkpoint)
					if (checkpoint.completed.includes(itemKey)) {
						results.skipped++;
						continue;
					}
					
					// Skip if exists and not forcing
					if (fs.existsSync(audioPath) && !force) {
						checkpoint.completed.push(itemKey);
						checkpoint.skipped.push(itemKey);
						results.skipped++;
						continue;
					}
					
					try {
						console.log(`[generate-audio] Generating: Module ${module.moduleNumber} - ${slide.name}`);
						
						// Use UnifiedVoiceService for automatic chunking support
						const { UnifiedVoiceService } = require('./src/utils/unifiedVoiceService');
						const voiceService = new UnifiedVoiceService();
						
						const result = await voiceService.generateAudio({
							prompt: slide.script,
							voice: finalVoice,
							format: 'wav',
							provider: finalProvider
						});
						
						if (result.audioData) {
							const base64 = result.audioData.includes(",") ? result.audioData.split(",")[1] : result.audioData;
							const audioBuffer = Buffer.from(base64, "base64");
							fs.writeFileSync(audioPath, audioBuffer);
							
							checkpoint.completed.push(itemKey);
							results.generated++;
							console.log(`[generate-audio] Generated: ${slide.name} (${audioBuffer.length} bytes, service: ${result.serviceUsed})`);
						} else if (result.audioUrl) {
							const response = await fetch(result.audioUrl);
							const buffer = await response.arrayBuffer();
							fs.writeFileSync(audioPath, Buffer.from(buffer));
							
							checkpoint.completed.push(itemKey);
							results.generated++;
							console.log(`[generate-audio] Generated: ${slide.name} (${buffer.byteLength} bytes, service: ${result.serviceUsed})`);
						} else {
							throw new Error('No audio data or URL returned from voice service');
						}
						
						// Save checkpoint periodically (every 10 items)
						if (checkpoint.completed.length % 10 === 0) {
							fs.writeFileSync(checkpointPath, JSON.stringify(checkpoint, null, 2));
						}
						
					} catch (error) {
						console.error(`[generate-audio] Error: ${slide.name} - ${error.message}`);
						checkpoint.failed.push({ key: itemKey, error: error.message });
						results.failed++;
						results.failedItems.push({ module: module.moduleNumber, slide: slide.name, error: error.message });
						// Save checkpoint on error
						fs.writeFileSync(checkpointPath, JSON.stringify(checkpoint, null, 2));
					}
				}
			}
			
			// Finalize checkpoint
			checkpoint.completedAt = new Date().toISOString();
			fs.writeFileSync(checkpointPath, JSON.stringify(checkpoint, null, 2));
			
			console.log(`[generate-audio] Complete: ${results.generated} generated, ${results.skipped} skipped, ${results.failed} failed`);
			
			// Clean up checkpoint if all succeeded
			if (results.failed === 0) {
				try {
					fs.unlinkSync(checkpointPath);
					console.log('[generate-audio] Checkpoint cleared (all succeeded)');
				} catch (e) {
					console.warn('[generate-audio] Could not clear checkpoint:', e.message);
				}
			}
			
			res.json({ 
				success: true, 
				...results,
				canResume: results.failed > 0,
				checkpointPath: results.failed > 0 ? checkpointPath : null
			});
			
		} catch (error) {
			console.error('[generate-audio] Error:', error);
			res.status(500).json({ error: error.message });
		}
		return;
	}
	
	// Fallback to script for other providers
	let finalModuleRange = moduleRange;
	if (course && !moduleRange) {
		try {
			const coursePath = path.join(__dirname, 'src', 'videos', 'courseStructure.ts');
			if (fs.existsSync(coursePath)) {
				const courseContent = fs.readFileSync(coursePath, 'utf-8');
				const mappingMatch = courseContent.match(new RegExp(`'${course}':\\s*\\[([\\d,\\s]+)\\]`));
				if (mappingMatch) {
					const moduleNumbers = mappingMatch[1].split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
					if (moduleNumbers.length > 0) {
						if (moduleNumbers.length === 1) {
							finalModuleRange = moduleNumbers[0].toString();
						} else {
							finalModuleRange = moduleNumbers.join(',');
						}
					}
				}
			}
		} catch (e) {
			console.error('Error getting course modules:', e);
		}
	}
	
	const command = finalModuleRange
		? `npx tsx "${path.join(__dirname, 'scripts', 'generateAudioFromContent.ts')}" ${finalModuleRange} ${finalVoice}`
		: `npx tsx "${path.join(__dirname, 'scripts', 'generateAudioFromContent.ts')}" all ${finalVoice}`;
	
	exec(command, { cwd: __dirname }, (error, stdout, stderr) => {
		if (error) {
			return res.status(500).json({ error: error.message, stderr });
		}
		res.json({ success: true, output: stdout });
	});
});

// API: Generate audio for specific module (supports OpenAI)
app.post('/api/generate-audio-module', async (req, res) => {
	const { moduleNumber, provider, voice, force } = req.body;
	if (!moduleNumber) {
		return res.status(400).json({ error: 'Module number is required' });
	}
	
	const settings = loadVoiceSettings();
	const finalProvider = provider || settings.provider || 'openai';
	const finalVoice = voice || settings.defaultVoice?.[finalProvider] || 'onyx';
	
	console.log(`[generate-audio-module] Module ${moduleNumber}, Provider: ${finalProvider}, Voice: ${finalVoice}`);
	
	if (finalProvider === 'openai') {
		// Use the bulk endpoint with module filter
		req.body.moduleRange = moduleNumber.toString();
		req.body.provider = finalProvider;
		req.body.voice = finalVoice;
		req.body.force = force;
		
		// Forward to bulk endpoint logic
		const fakeRes = {
			status: (code) => ({ json: (data) => res.status(code).json(data) }),
			json: (data) => res.json(data)
		};
		
		// Call the generate-audio handler directly by making internal request
		try {
			const apiKey = process.env.OPENAI_API_KEY;
			if (!apiKey) {
				return res.status(400).json({ error: 'OPENAI_API_KEY not configured' });
			}
			
			const contentPath = path.join(__dirname, 'src', 'videos', 'moduleContent.ts');
			const content = fs.readFileSync(contentPath, 'utf-8');
			
			// Find the specific module
			const modulePattern = new RegExp(`export const module${moduleNumber}Content[\\s\\S]*?moduleNumber:\\s*${moduleNumber}[\\s\\S]*?courseId:\\s*["']([^"']+)["'][\\s\\S]*?slides:\\s*\\[([\\s\\S]*?)\\]\\s*,?\\s*\\}`, 'm');
			const moduleMatch = content.match(modulePattern);
			
			if (!moduleMatch) {
				return res.status(404).json({ error: `Module ${moduleNumber} not found` });
			}
			
			const courseId = moduleMatch[1];
			const slidesContent = moduleMatch[2];
			
			// Parse slides
			const slides = [];
			const slideRegex = /\{\s*name:\s*["']([^"']+)["'][\s\S]*?script:\s*["']([\s\S]*?)["']\s*,/g;
			let slideMatch;
			while ((slideMatch = slideRegex.exec(slidesContent)) !== null) {
				slides.push({
					name: slideMatch[1],
					script: slideMatch[2].replace(/\\"/g, '"').replace(/\\n/g, ' ')
				});
			}
			
			const audioDir = path.join(__dirname, 'public', 'audio', courseId);
			if (!fs.existsSync(audioDir)) {
				fs.mkdirSync(audioDir, { recursive: true });
			}
			
			console.log(`[generate-audio-module] Found ${slides.length} slides`);
			
			const results = { generated: 0, skipped: 0, failed: 0 };
			
			for (const slide of slides) {
				const audioPath = path.join(audioDir, `module${moduleNumber}-${slide.name}.wav`);
				
				if (fs.existsSync(audioPath) && !force) {
					results.skipped++;
					continue;
				}
				
				try {
					console.log(`[generate-audio-module] Generating: ${slide.name}`);
					
					const response = await fetch('https://api.openai.com/v1/audio/speech', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${apiKey}`
						},
						body: JSON.stringify({
							model: 'tts-1-hd',
							voice: finalVoice,
							input: slide.script,
							response_format: 'wav'
						})
					});
					
					if (!response.ok) {
						results.failed++;
						continue;
					}
					
					const audioBuffer = await response.arrayBuffer();
					fs.writeFileSync(audioPath, Buffer.from(audioBuffer));
					results.generated++;
					
				} catch (error) {
					results.failed++;
				}
			}
			
			res.json({ success: true, module: moduleNumber, ...results });
			
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
		return;
	}
	
	// Fallback to script
	const scriptPath = path.join(__dirname, 'scripts', 'generateAudioForModule.ts');
	const command = `npx tsx "${scriptPath}" ${moduleNumber}`;
	
	exec(command, { cwd: __dirname, maxBuffer: 10 * 1024 * 1024 }, (error, stdout, stderr) => {
		if (error) {
			console.error('Audio generation error:', error);
			return res.status(500).json({ error: error.message, stderr: stderr || stdout });
		}
		res.json({ success: true, output: stdout });
	});
});

// API: Measure audio durations
app.post('/api/measure-audio', (req, res) => {
	const course = req.query.course || req.body.course;
	// Note: measure-audio script processes all audio files, course filtering is handled at display level
	const scriptPath = path.join(__dirname, 'scripts', 'measureActualAudio.ts');
	const command = `npx tsx "${scriptPath}"`;
	
	exec(command, { cwd: __dirname, maxBuffer: 10 * 1024 * 1024 }, (error, stdout, stderr) => {
		if (error) {
			console.error('Audio measurement error:', error);
			return res.status(500).json({ error: error.message, stderr: stderr || stdout });
		}
		res.json({ success: true, output: stdout });
	});
});

// API: Regenerate modules from moduleContent.ts
app.post('/api/regenerate-modules', (req, res) => {
	const { moduleRange, courseId } = req.body;
	
	// Determine audio mode from course
	let audioMode = 'per-slide'; // default
	if (courseId) {
		try {
			const coursesData = readCoursesJson();
			const course = coursesData.courses?.find(c => c.id === courseId);
			if (course && course.audioMode) {
				audioMode = course.audioMode;
			}
		} catch (e) {
			console.error('Error reading course audio mode:', e);
		}
	}
	
	// Use same logic as generate-modules endpoint
	let finalModuleRange = moduleRange;
	if (courseId && !moduleRange) {
		try {
			const coursePath = path.join(__dirname, 'src', 'videos', 'courseStructure.ts');
			if (fs.existsSync(coursePath)) {
				const courseContent = fs.readFileSync(coursePath, 'utf-8');
				const mappingMatch = courseContent.match(new RegExp(`'${courseId}':\\s*\\[([\\d,\\s]+)\\]`));
				if (mappingMatch) {
					const moduleNumbers = mappingMatch[1].split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
					if (moduleNumbers.length > 0) {
						finalModuleRange = moduleNumbers.length === 1 ? moduleNumbers[0].toString() : moduleNumbers.join(',');
					}
				}
			}
		} catch (e) {
			console.error('Error getting course modules:', e);
		}
	}
	
	// Choose script based on audio mode
	let scriptPath;
	let scriptArgs;
	
	if (audioMode === 'per-module' && courseId) {
		scriptPath = path.join(__dirname, 'scripts', 'generateModulesFromScenes.ts');
		scriptArgs = `${courseId} ${finalModuleRange || '1-6'}`;
	} else {
		scriptPath = path.join(__dirname, 'scripts', 'generateModulesFromContent.ts');
		scriptArgs = finalModuleRange || 'all';
	}
	
	// Pre-flight validation: Check audio files and durations before generating modules
	const validation = validateBeforeModuleGeneration(courseId, finalModuleRange);
	if (!validation.valid) {
		return res.status(400).json({ 
			error: 'Pre-flight validation failed',
			validation: validation,
			message: validation.errors.join('; ')
		});
	}
	
	if (validation.warnings.length > 0) {
		console.warn('[generate-modules] Pre-flight warnings:', validation.warnings);
	}
	
	const runModuleGen = () => {
		const command = `npx tsx "${scriptPath}" ${scriptArgs}`;
		exec(command, { cwd: __dirname, maxBuffer: 10 * 1024 * 1024 }, (error, stdout, stderr) => {
			if (error) {
				console.error('Module regeneration error:', error);
				return res.status(500).json({ error: error.message, stderr: stderr || stdout });
			}
			res.json({ success: true, output: stdout, validation: validation });
		});
	};
	
	if (courseId) {
		const genSpecPath = path.join(__dirname, 'scripts', 'generateAnimationSpecs.ts');
		const copyPath = path.join(__dirname, 'scripts', 'copySvgsToPublic.ts');
		exec(`npx tsx "${genSpecPath}" ${courseId}`, { cwd: __dirname, maxBuffer: 10 * 1024 * 1024 }, (err1, out1, stderr1) => {
			if (err1) {
				console.warn('align-diagram-phases (pre-regenerate):', err1.message);
			}
			exec(`npx tsx "${copyPath}" ${courseId}`, { cwd: __dirname, maxBuffer: 10 * 1024 * 1024 }, (err2) => {
				if (err2) console.warn('copySvgsToPublic (pre-regenerate):', err2.message);
				runModuleGen();
			});
		});
	} else {
		runModuleGen();
	}
});

// API: Align diagram phases to narration (generate animation specs from word timings, then copy SVGs)
app.post('/api/align-diagram-phases', (req, res) => {
	const { courseId } = req.body;
	if (!courseId) {
		return res.status(400).json({ error: 'courseId required' });
	}
	const genSpecPath = path.join(__dirname, 'scripts', 'generateAnimationSpecs.ts');
	const copyPath = path.join(__dirname, 'scripts', 'copySvgsToPublic.ts');
	exec(`npx tsx "${genSpecPath}" ${courseId}`, { cwd: __dirname, maxBuffer: 10 * 1024 * 1024 }, (err1, out1, stderr1) => {
		if (err1) {
			console.error('align-diagram-phases: generateAnimationSpecs error:', err1);
			return res.status(500).json({ error: err1.message, output: stderr1 || out1 });
		}
		exec(`npx tsx "${copyPath}" ${courseId}`, { cwd: __dirname, maxBuffer: 10 * 1024 * 1024 }, (err2, out2, stderr2) => {
			if (err2) {
				console.error('align-diagram-phases: copySvgsToPublic error:', err2);
				return res.status(500).json({ error: err2.message, output: stderr2 || out2 });
			}
			res.json({ success: true, output: (out1 || '') + '\n' + (out2 || '') });
		});
	});
});

// API: Validate module content for missing properties
app.post('/api/validate-content', (req, res) => {
	const scriptPath = path.join(__dirname, 'scripts', 'validateModuleContent.ts');
	const command = `npx tsx "${scriptPath}"`;
	
	exec(command, { cwd: __dirname, maxBuffer: 10 * 1024 * 1024, timeout: 60000 }, (error, stdout, stderr) => {
		// Exit code 1 means issues found, not an error
		const hasIssues = error && error.code === 1;
		res.json({ 
			success: true, 
			hasIssues: hasIssues,
			output: stdout 
		});
	});
});

// API: Export all scripts to a text file for manual audio generation
app.get('/api/export-scripts', (req, res) => {
	try {
		const courseId = req.query.course || 'default';
		const contentPath = path.join(__dirname, 'src', 'videos', 'moduleContent.ts');
		
		if (!fs.existsSync(contentPath)) {
			return res.status(404).json({ error: 'moduleContent.ts not found' });
		}
		
		// Use "Video" vs "Module" in labels based on course contentType (from courses.json)
		let segmentLabel = 'Module';
		try {
			const coursesData = readCoursesJson();
			const course = coursesData.courses.find(c => c.id === courseId);
			const contentType = (course && course.contentType) ? course.contentType : 'course';
			if (contentType === 'video' || contentType === 'shorts') {
				segmentLabel = 'Video';
			}
		} catch (e) {
			// Keep default "Module"
		}
		
		const content = fs.readFileSync(contentPath, 'utf-8');
		
		// Find all modules for this course
		const moduleRegex = /export const module(\d+)Content: ModuleContent = \{([\s\S]*?)\n\};/g;
		let match;
		const scripts = [];
		
		while ((match = moduleRegex.exec(content)) !== null) {
			const moduleNumber = match[1];
			const moduleBody = match[2];
			
			// Check if this module belongs to the requested course
			const courseIdMatch = moduleBody.match(/courseId:\s*"([^"]+)"/);
			const moduleCourseId = courseIdMatch ? courseIdMatch[1] : 'default';
			
			if (moduleCourseId !== courseId && courseId !== 'all') {
				continue;
			}
			
			// Extract slides
			const slidesStart = moduleBody.indexOf('slides:');
			if (slidesStart === -1) continue;
			
			// Find slide names and scripts
			const slideRegex = /\{\s*name:\s*"([^"]+)"[\s\S]*?script:\s*"([^"]+)"/g;
			let slideMatch;
			
			while ((slideMatch = slideRegex.exec(moduleBody)) !== null) {
				const slideName = slideMatch[1];
				const script = slideMatch[2].replace(/\\n/g, '\n').replace(/\\"/g, '"');
				
				scripts.push({
					fileName: `${moduleCourseId}/module${moduleNumber}-${slideName}.wav`,
					moduleNumber: parseInt(moduleNumber),
					slideName,
					script
				});
			}
		}
		
		if (scripts.length === 0) {
			return res.status(404).json({ error: `No scripts found for course: ${courseId}` });
		}
		
		const uniqueModules = [...new Set(scripts.map(s => s.moduleNumber))].sort((a, b) => a - b);
		const segmentCount = uniqueModules.length;
		
		// Generate text file content: header uses segment label (Video/Module) from selected course
		let textContent = `SCRIPTS FOR: ${courseId}\n`;
		textContent += `Generated: ${new Date().toISOString()}\n`;
		textContent += `Total: ${scripts.length} scripts across ${segmentCount} ${segmentLabel.toLowerCase()}${segmentCount !== 1 ? 's' : ''}\n`;
		textContent += `${'='.repeat(60)}\n\n`;
		
		let lastModuleNumber = null;
		for (const item of scripts) {
			if (lastModuleNumber !== item.moduleNumber) {
				textContent += `--- ${segmentLabel} ${item.moduleNumber} ---\n\n`;
				lastModuleNumber = item.moduleNumber;
			}
			textContent += `FILE: ${item.fileName}\n`;
			textContent += `${'-'.repeat(40)}\n`;
			textContent += `${item.script}\n`;
			textContent += `\n${'='.repeat(60)}\n\n`;
		}
		
		// Send as downloadable text file
		const fileName = `scripts-${courseId}-${Date.now()}.txt`;
		res.setHeader('Content-Type', 'text/plain');
		res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
		res.send(textContent);
		
	} catch (error) {
		console.error('[export-scripts] Error:', error);
		res.status(500).json({ error: error.message });
	}
});

// Voice Settings File
const voiceSettingsPath = path.join(__dirname, 'voice-settings.json');

function loadVoiceSettings() {
	try {
		if (fs.existsSync(voiceSettingsPath)) {
			return JSON.parse(fs.readFileSync(voiceSettingsPath, 'utf-8'));
		}
	} catch (error) {
		console.error('[voice-settings] Error loading:', error);
	}
	return {
		provider: 'runpod',
		customVoices: [],
		defaultVoice: { runpod: 'andy', minimax: 'presenter_male' }
	};
}

function saveVoiceSettings(settings) {
	fs.writeFileSync(voiceSettingsPath, JSON.stringify(settings, null, 2));
}

// Default OpenAI TTS voices
const OPENAI_TTS_VOICES = [
	{ id: 'alloy', name: 'Alloy', description: 'Neutral, balanced voice' },
	{ id: 'echo', name: 'Echo', description: 'Warm, conversational male' },
	{ id: 'fable', name: 'Fable', description: 'Expressive, storytelling' },
	{ id: 'onyx', name: 'Onyx', description: 'Deep, authoritative male' },
	{ id: 'nova', name: 'Nova', description: 'Friendly, upbeat female' },
	{ id: 'shimmer', name: 'Shimmer', description: 'Clear, professional female' },
];

// Default Minimax voices
const MINIMAX_DEFAULT_VOICES = [
	{ id: 'male-qn-qingse', name: 'Qingse (Male)', description: 'Young male voice' },
	{ id: 'male-qn-jingying', name: 'Jingying (Male)', description: 'Professional male' },
	{ id: 'female-shaonv', name: 'Shaonv (Female)', description: 'Young female voice' },
	{ id: 'female-yujie', name: 'Yujie (Female)', description: 'Mature female voice' },
	{ id: 'female-chengshu', name: 'Chengshu (Female)', description: 'Calm female voice' },
	{ id: 'male-qn-badao', name: 'Badao (Male)', description: 'Deep male voice' },
	{ id: 'presenter_male', name: 'Presenter (Male)', description: 'News presenter style' },
	{ id: 'presenter_female', name: 'Presenter (Female)', description: 'News presenter style' },
	{ id: 'audiobook_male_1', name: 'Audiobook (Male)', description: 'Storyteller voice' },
	{ id: 'audiobook_female_1', name: 'Audiobook (Female)', description: 'Storyteller voice' },
];

// RunPod/Chatterbox default voices
const RUNPOD_DEFAULT_VOICES = [
	{ id: 'andy', name: 'Andy (Male)', description: 'Professional male voice' },
	{ id: 'sarah', name: 'Sarah (Female)', description: 'Professional female voice' },
	{ id: 'tom', name: 'Tom (Male)', description: 'Casual male voice' },
	{ id: 'lucy', name: 'Lucy (Female)', description: 'Friendly female voice' },
];

// API: Get voice settings
app.get('/api/voice-settings', (req, res) => {
	try {
		const settings = loadVoiceSettings();
		res.json(settings);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// API: Update voice settings
app.post('/api/voice-settings', (req, res) => {
	try {
		const { provider, defaultVoice, audioMode } = req.body;
		const settings = loadVoiceSettings();
		
		if (provider) settings.provider = provider;
		if (defaultVoice) settings.defaultVoice = { ...settings.defaultVoice, ...defaultVoice };
		if (audioMode) settings.audioMode = audioMode;
		
		saveVoiceSettings(settings);
		res.json({ success: true, settings });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// API: Check if course has pre-built scene components
app.get('/api/check-scene-components', (req, res) => {
	try {
		const courseId = req.query.course;
		if (!courseId) {
			return res.status(400).json({ error: 'course parameter required' });
		}
		
		const scenesPath = path.join(__dirname, 'courses', courseId, 'course', 'remotion', 'scenes');
		
		if (!fs.existsSync(scenesPath)) {
			return res.json({ hasScenes: false, sceneCount: 0, moduleCount: 0 });
		}
		
		// Count scene components
		let sceneCount = 0;
		let moduleCount = 0;
		
		const items = fs.readdirSync(scenesPath, { withFileTypes: true });
		for (const item of items) {
			if (item.isDirectory() && item.name.startsWith('module')) {
				moduleCount++;
				const moduleDir = path.join(scenesPath, item.name);
				const files = fs.readdirSync(moduleDir).filter(f => f.endsWith('.tsx') && f !== 'index.ts');
				sceneCount += files.length;
			}
		}
		
		res.json({
			hasScenes: sceneCount > 0,
			sceneCount,
			moduleCount,
			scenesPath: `courses/${courseId}/course/remotion/scenes/`
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// API: Get available voices for current provider
app.get('/api/voices', (req, res) => {
	try {
		const settings = loadVoiceSettings();
		const provider = req.query.provider || settings.provider;
		
		let voices = [];
		if (provider === 'minimax') {
			voices = [...MINIMAX_DEFAULT_VOICES];
			// Add custom voices
			const customMinimax = settings.customVoices.filter(v => v.provider === 'minimax');
			voices.push(...customMinimax.map(v => ({ ...v, isCustom: true })));
		} else if (provider === 'openai') {
			voices = [...OPENAI_TTS_VOICES];
		} else {
			voices = [...RUNPOD_DEFAULT_VOICES];
			const customRunpod = settings.customVoices.filter(v => v.provider === 'runpod');
			voices.push(...customRunpod.map(v => ({ ...v, isCustom: true })));
		}
		
		res.json({ provider, voices, defaultVoice: settings.defaultVoice[provider] });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// API: Add custom voice
app.post('/api/voices/custom', (req, res) => {
	try {
		const { id, name, description, provider } = req.body;
		
		if (!id || !name) {
			return res.status(400).json({ error: 'Voice ID and name are required' });
		}
		
		const settings = loadVoiceSettings();
		const targetProvider = provider || settings.provider;
		
		// Check for duplicates
		const exists = settings.customVoices.find(v => v.id === id && v.provider === targetProvider);
		if (exists) {
			return res.status(400).json({ error: 'Voice with this ID already exists' });
		}
		
		settings.customVoices.push({
			id,
			name,
			description: description || 'Custom voice',
			provider: targetProvider,
			addedAt: new Date().toISOString()
		});
		
		saveVoiceSettings(settings);
		res.json({ success: true, voice: { id, name, description, provider: targetProvider } });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// API: Delete custom voice
app.delete('/api/voices/custom/:id', (req, res) => {
	try {
		const { id } = req.params;
		const provider = req.query.provider;
		
		const settings = loadVoiceSettings();
		const initialLength = settings.customVoices.length;
		
		settings.customVoices = settings.customVoices.filter(v => {
			if (provider) {
				return !(v.id === id && v.provider === provider);
			}
			return v.id !== id;
		});
		
		if (settings.customVoices.length === initialLength) {
			return res.status(404).json({ error: 'Custom voice not found' });
		}
		
		saveVoiceSettings(settings);
		res.json({ success: true });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// API: Test voice (generate sample audio)
app.post('/api/voices/test', async (req, res) => {
	try {
		const { voiceId, provider, testText } = req.body;
		
		if (!voiceId) {
			return res.status(400).json({ error: 'Voice ID is required' });
		}
		
		const settings = loadVoiceSettings();
		const targetProvider = provider || settings.provider;
		const text = testText || 'This is a voice test. Hello, how does this voice sound to you?';
		
		console.log(`[voice-test] Testing voice: ${voiceId} with provider: ${targetProvider}`);
		
		if (targetProvider === 'openai') {
			// Use OpenAI TTS API
			const apiKey = process.env.OPENAI_API_KEY;
			
			if (!apiKey) {
				return res.status(400).json({ 
					error: 'OpenAI API key not configured. Set OPENAI_API_KEY in .env' 
				});
			}
			
			console.log(`[voice-test] Calling OpenAI TTS with voice: ${voiceId}`);
			
			const response = await fetch('https://api.openai.com/v1/audio/speech', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${apiKey}`
				},
				body: JSON.stringify({
					model: 'tts-1',
					voice: voiceId,
					input: text,
					response_format: 'mp3'
				})
			});
			
			if (!response.ok) {
				const errorText = await response.text();
				console.log(`[voice-test] OpenAI error: ${response.status} - ${errorText}`);
				return res.status(400).json({ 
					success: false, 
					error: `OpenAI TTS error: ${response.status} - ${errorText}` 
				});
			}
			
			// OpenAI returns audio directly as binary
			const audioBuffer = await response.arrayBuffer();
			const audioBase64 = Buffer.from(audioBuffer).toString('base64');
			
			console.log(`[voice-test] OpenAI success, audio size: ${audioBuffer.byteLength} bytes`);
			
			res.json({
				success: true,
				audio: audioBase64,
				format: 'mp3',
				voiceId,
				provider: targetProvider
			});
			
		} else if (targetProvider === 'minimax') {
			// Use Minimax Direct API
			const apiKey = process.env.MINIMAX_API_KEY;
			const groupId = process.env.MINIMAX_GROUP_ID;
			
			// Debug logging
			console.log(`[voice-test] MINIMAX_API_KEY loaded: ${apiKey ? 'Yes (' + apiKey.substring(0, 10) + '...)' : 'No'}`);
			console.log(`[voice-test] MINIMAX_GROUP_ID loaded: ${groupId ? 'Yes (' + groupId + ')' : 'No'}`);
			
			if (!apiKey || !groupId) {
				return res.status(400).json({ 
					error: 'Minimax credentials not configured. Set MINIMAX_API_KEY and MINIMAX_GROUP_ID in .env' 
				});
			}
			
			// MiniMax v2 API: use api.minimax.io domain (not .chat)
			const requestUrl = `https://api.minimax.io/v1/t2a_v2`;
			console.log(`[voice-test] Calling: ${requestUrl}`);
			
			const response = await fetch(requestUrl, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${apiKey}`
				},
				body: JSON.stringify({
					model: 'speech-02-hd',
					text: text,
					stream: false,
					output_format: 'hex',
					voice_setting: {
						voice_id: voiceId,
						speed: 1,
						vol: 1,
						pitch: 0
					},
					audio_setting: {
						sample_rate: 32000,
						bitrate: 128000,
						format: 'wav',
						channel: 1
					}
				})
			});
			
			if (!response.ok) {
				const errorText = await response.text();
				console.log(`[voice-test] Minimax HTTP error: ${response.status} - ${errorText}`);
				return res.status(400).json({ 
					success: false, 
					error: `Minimax API error: ${response.status} - ${errorText}` 
				});
			}
			
			const data = await response.json();
			console.log(`[voice-test] Minimax response keys:`, Object.keys(data));
			
			// Check for error in v2 response format
			if (data.status_code && data.status_code !== 0) {
				console.log(`[voice-test] Minimax error code: ${data.status_code}, msg: ${data.status_msg}`);
				return res.status(400).json({ 
					success: false, 
					error: `Minimax error: ${data.status_msg || 'Unknown error'}` 
				});
			}
			
			// Also check base_resp format
			if (data.base_resp?.status_code !== 0 && data.base_resp?.status_code !== undefined) {
				console.log(`[voice-test] Minimax base_resp error: ${data.base_resp?.status_code}, msg: ${data.base_resp?.status_msg}`);
				return res.status(400).json({ 
					success: false, 
					error: `Minimax error: ${data.base_resp?.status_msg || 'Unknown error'}` 
				});
			}
			
			// Try multiple audio field locations
			const audioHex = data.data?.audio || data.audio_file || data.audio;
			
			if (audioHex) {
				// Convert hex to base64
				const audioBuffer = Buffer.from(audioHex, 'hex');
				const audioBase64 = audioBuffer.toString('base64');
				
				console.log(`[voice-test] Minimax audio received: ${audioBuffer.length} bytes`);
				
				res.json({ 
					success: true, 
					audioData: audioBase64,
					format: 'wav',
					voiceId,
					provider: targetProvider
				});
			} else {
				console.log(`[voice-test] Minimax no audio in response:`, JSON.stringify(data).substring(0, 500));
				res.status(400).json({ success: false, error: 'No audio data returned from Minimax' });
			}
		} else {
			// Use RunPod/existing service
			const apiKey = process.env.RESEMBLE_API_KEY || process.env.RUNPOD_API_KEY;
			
			if (!apiKey) {
				return res.status(400).json({ 
					error: 'RunPod API key not configured. Set RESEMBLE_API_KEY or RUNPOD_API_KEY in .env' 
				});
			}
			
			// For RunPod, we'd use the existing voice service
			// Simplified test - just validate the voice exists in our list
			const validVoices = RUNPOD_DEFAULT_VOICES.map(v => v.id);
			const customVoices = settings.customVoices.filter(v => v.provider === 'runpod').map(v => v.id);
			
			if (!validVoices.includes(voiceId) && !customVoices.includes(voiceId)) {
				return res.status(400).json({ 
					success: false, 
					error: `Voice '${voiceId}' not found. Available: ${validVoices.join(', ')}` 
				});
			}
			
			// For now, return success without actual audio for RunPod testing
			// Full implementation would call the RunPod API
			res.json({ 
				success: true, 
				message: `Voice '${voiceId}' is valid for RunPod`,
				voiceId,
				provider: targetProvider,
				note: 'RunPod voice test requires full audio generation'
			});
		}
	} catch (error) {
		console.error('[voice-test] Error:', error);
		res.status(500).json({ success: false, error: error.message });
	}
});

// API: Upload audio file for a specific slide
app.post('/api/upload-audio', audioUpload.single('audio'), (req, res) => {
	try {
		const { moduleNumber, slideName, courseId } = req.body;
		const file = req.file;
		
		if (!file) {
			return res.status(400).json({ error: 'No audio file provided' });
		}
		
		if (!moduleNumber || !slideName) {
			// Clean up temp file
			fs.unlinkSync(file.path);
			return res.status(400).json({ error: 'Module number and slide name are required' });
		}
		
		// Use course-specific audio directory
		const course = courseId || 'default';
		const audioDir = path.join(__dirname, 'public', 'audio', course);
		const targetFileName = `module${moduleNumber}-${slideName}.wav`;
		const targetPath = path.join(audioDir, targetFileName);
		
		// Ensure audio directory exists
		if (!fs.existsSync(audioDir)) {
			fs.mkdirSync(audioDir, { recursive: true });
		}
		
		// Convert to WAV format using ffmpeg
		try {
			execSync(
				`ffmpeg -y -i "${file.path}" -acodec pcm_s16le -ar 44100 "${targetPath}"`,
				{ stdio: 'pipe' }
			);
			// Clean up temp file
			fs.unlinkSync(file.path);
			
			console.log(`Audio uploaded and converted: ${targetFileName}`);
			res.json({ success: true, fileName: targetFileName });
		} catch (ffmpegError) {
			// Clean up temp file
			if (fs.existsSync(file.path)) {
				fs.unlinkSync(file.path);
			}
			console.error('FFmpeg error:', ffmpegError.message);
			res.status(500).json({ error: 'Failed to convert audio file. Ensure ffmpeg is installed.' });
		}
	} catch (error) {
		console.error('Upload error:', error);
		res.status(500).json({ error: error.message });
	}
});

// API: Add slides to existing module
app.post('/api/modules/:moduleNumber/add-slides', (req, res) => {
	try {
		const moduleNumber = parseInt(req.params.moduleNumber);
		const { slides } = req.body;
		
		if (!slides || !Array.isArray(slides) || slides.length === 0) {
			return res.status(400).json({ error: 'Slides array is required and must not be empty' });
		}
		
		const contentPath = path.join(__dirname, 'src', 'videos', 'moduleContent.ts');
		let content = fs.readFileSync(contentPath, 'utf-8');
		
		// Find the module
		const moduleRegex = new RegExp(`export const module${moduleNumber}Content: ModuleContent = \\{([\\s\\S]*?)\\};`);
		const moduleMatch = content.match(moduleRegex);
		
		if (!moduleMatch) {
			return res.status(404).json({ error: `Module ${moduleNumber} not found` });
		}
		
		const existingModuleBody = moduleMatch[1];
		
		// Extract existing slides array
		const slidesMatch = existingModuleBody.match(/slides:\s*\[([\s\S]*?)\]\s*,?\s*\}/);
		if (!slidesMatch) {
			return res.status(400).json({ error: 'Could not find slides array in module' });
		}
		
		const existingSlidesContent = slidesMatch[1];
		const slidesEndPos = existingModuleBody.indexOf(']', existingModuleBody.indexOf('slides:'));
		
		// Build new slides code
		const newSlidesCode = slides.map(slide => {
			let slideCode = `\t\t{\n\t\t\tname: "${(slide.name || '').replace(/"/g, '\\"')}",\n\t\t\ttype: "${slide.type || 'content-single'}",\n\t\t\tscript: "${(slide.script || '').replace(/"/g, '\\"')}"`;
			
			if (slide.type === 'title' && slide.subtitle) {
				slideCode += `,\n\t\t\tsubtitle: "${(slide.subtitle || '').replace(/"/g, '\\"')}"`;
			}
			
			if (slide.title) {
				slideCode += `,\n\t\t\ttitle: "${(slide.title || '').replace(/"/g, '\\"')}"`;
			}
			
			if (slide.points && Array.isArray(slide.points) && slide.points.length > 0) {
				const pointsCode = slide.points
					.filter(p => p && p.trim())
					.map(p => `\t\t\t\t"${p.replace(/"/g, '\\"')}"`)
					.join(',\n');
				slideCode += `,\n\t\t\tpoints: [\n${pointsCode}\n\t\t\t]`;
			}
			
			if (slide.code) {
				slideCode += `,\n\t\t\tcode: \`${slide.code.replace(/`/g, '\\`')}\``;
			}
			
			if (slide.language) {
				slideCode += `,\n\t\t\tlanguage: "${slide.language}"`;
			}
			
			if (slide.imageSrc) {
				slideCode += `,\n\t\t\timageSrc: "${(slide.imageSrc || '').replace(/"/g, '\\"')}"`;
			}
			
			slideCode += '\n\t\t}';
			return slideCode;
		}).join(',\n');
		
		// Insert new slides before the closing bracket
		// Find the position of the closing bracket in the slides array
		const moduleStart = content.indexOf(moduleMatch[0]);
		const slidesArrayStart = content.indexOf('slides: [', moduleStart);
		const slidesArrayEnd = content.indexOf(']', slidesArrayStart);
		
		// Check if there are existing slides (need comma)
		const hasExistingSlides = existingSlidesContent.trim().length > 0;
		const separator = hasExistingSlides ? ',\n' : '';
		
		// Insert new slides
		content = content.substring(0, slidesArrayEnd) + separator + newSlidesCode + content.substring(slidesArrayEnd);
		
		fs.writeFileSync(contentPath, content);
		console.log(`Added ${slides.length} slides to module ${moduleNumber}`);
		
		res.json({ success: true, moduleNumber, slidesAdded: slides.length });
	} catch (error) {
		console.error('Error adding slides:', error);
		res.status(500).json({ error: error.message });
	}
});

// API: Split audio file into chunks
app.post('/api/split-audio', audioUpload.single('audio'), (req, res) => {
	try {
		const { chunkSize = 10, courseId, moduleNumber, slideName, autoCreateSlides = false } = req.body;
		const file = req.file;
		
		if (!file) {
			return res.status(400).json({ error: 'No audio file provided' });
		}

		const scriptPath = path.join(__dirname, 'scripts', 'splitAudioIntoChunks.ts');
		const outputDir = courseId 
			? path.join(__dirname, 'public', 'audio', courseId)
			: path.dirname(file.path);

		// Build command arguments
		const args = [
			'tsx',
			scriptPath,
			file.path,
			`--chunk-size=${chunkSize || 10}`
		];

		if (outputDir) {
			args.push(`--output-dir=${outputDir}`);
		}
		if (courseId) {
			args.push(`--course-id=${courseId}`);
		}
		if (moduleNumber) {
			args.push(`--module=${moduleNumber}`);
		}
		if (slideName) {
			args.push(`--slide-name=${slideName}`);
		}

		// Execute split script
		exec(`npx ${args.join(' ')}`, { cwd: __dirname, maxBuffer: 10 * 1024 * 1024 }, async (error, stdout, stderr) => {
			// Clean up temp file
			if (fs.existsSync(file.path)) {
				fs.unlinkSync(file.path);
			}

			if (error) {
				console.error('Audio split error:', error);
				return res.status(500).json({ 
					error: error.message, 
					stderr: stderr || stdout 
				});
			}

			// Parse output to get chunk filenames
			const chunkMatches = stdout.match(/✓ Chunk \d+\/\d+: ([^\s]+)/g) || [];
			const chunks = chunkMatches.map(match => {
				const filename = match.match(/✓ Chunk \d+\/\d+: ([^\s]+)/)[1];
				return filename;
			});

			const result = { 
				success: true, 
				chunks,
				output: stdout 
			};

			// Auto-create slides if requested (using internal function call)
			if (autoCreateSlides === 'true' || autoCreateSlides === true) {
				if (!moduleNumber || !slideName) {
					result.warning = 'Cannot auto-create slides: module number and slide name required';
				} else {
					try {
						// Generate slide entries from chunks
						const newSlides = chunks.map((chunk, index) => {
							// Extract part number from filename (e.g., "module1-concept-part01.wav" -> "part01")
							const partMatch = chunk.match(/-part(\d+)\.wav$/);
							const partNum = partMatch ? partMatch[1] : String(index + 1).padStart(2, '0');
							
							// Generate slide name: module-{N}-{slideName}-part{NN}
							const slideNameFormatted = `module-${moduleNumber}-${slideName}-part${partNum}`;
							
							return {
								name: slideNameFormatted,
								type: 'content-single',
								script: `[TODO: Add script for ${slideName} part ${index + 1}]`,
								title: `${slideName.charAt(0).toUpperCase() + slideName.slice(1)} - Part ${index + 1}`,
								points: []
							};
						});

						// Call add-slides function directly (internal)
						const contentPath = path.join(__dirname, 'src', 'videos', 'moduleContent.ts');
						let content = fs.readFileSync(contentPath, 'utf-8');
						
						const moduleRegex = new RegExp(`export const module${moduleNumber}Content: ModuleContent = \\{([\\s\\S]*?)\\};`);
						const moduleMatch = content.match(moduleRegex);
						
						if (!moduleMatch) {
							result.warning = `Module ${moduleNumber} not found in moduleContent.ts`;
						} else {
							const existingModuleBody = moduleMatch[1];
							const slidesMatch = existingModuleBody.match(/slides:\s*\[([\s\S]*?)\]\s*,?\s*\}/);
							
							if (!slidesMatch) {
								result.warning = 'Could not find slides array in module';
							} else {
								const existingSlidesContent = slidesMatch[1];
								const hasExistingSlides = existingSlidesContent.trim().length > 0;
								const separator = hasExistingSlides ? ',\n' : '';
								
								// Build new slides code
								const newSlidesCode = newSlides.map(slide => {
									let slideCode = `\t\t{\n\t\t\tname: "${(slide.name || '').replace(/"/g, '\\"')}",\n\t\t\ttype: "${slide.type || 'content-single'}",\n\t\t\tscript: "${(slide.script || '').replace(/"/g, '\\"')}"`;
									
									if (slide.title) {
										slideCode += `,\n\t\t\ttitle: "${(slide.title || '').replace(/"/g, '\\"')}"`;
									}
									
									if (slide.points && Array.isArray(slide.points) && slide.points.length > 0) {
										const pointsCode = slide.points
											.filter(p => p && p.trim())
											.map(p => `\t\t\t\t"${p.replace(/"/g, '\\"')}"`)
											.join(',\n');
										slideCode += `,\n\t\t\tpoints: [\n${pointsCode}\n\t\t\t]`;
									}
									
									slideCode += '\n\t\t}';
									return slideCode;
								}).join(',\n');
								
								// Insert new slides before the closing bracket
								const moduleStart = content.indexOf(moduleMatch[0]);
								const slidesArrayStart = content.indexOf('slides: [', moduleStart);
								const slidesArrayEnd = content.indexOf(']', slidesArrayStart);
								
								content = content.substring(0, slidesArrayEnd) + separator + newSlidesCode + content.substring(slidesArrayEnd);
								
								fs.writeFileSync(contentPath, content);
								console.log(`Auto-created ${newSlides.length} slides in module ${moduleNumber}`);
								
								result.slidesCreated = newSlides.length;
								result.message = `Created ${newSlides.length} slides in module ${moduleNumber}`;
							}
						}
					} catch (slideError) {
						console.error('Error auto-creating slides:', slideError);
						result.warning = `Audio split successful, but failed to create slides: ${slideError.message}`;
					}
				}
			}

			res.json(result);
		});
	} catch (error) {
		console.error('Split audio error:', error);
		res.status(500).json({ error: error.message });
	}
});

// API: Upload image for a slide
app.post('/api/upload-image', imageUpload.single('image'), (req, res) => {
	try {
		const { moduleNumber, slideName, courseId } = req.body;
		const file = req.file;
		
		if (!file) {
			return res.status(400).json({ error: 'No image file provided' });
		}
		
		if (!moduleNumber || !slideName) {
			fs.unlinkSync(file.path);
			return res.status(400).json({ error: 'Module number and slide name are required' });
		}
		
		// Determine file extension from mimetype
		const mimeToExt = {
			'image/png': '.png',
			'image/jpeg': '.jpg',
			'image/jpg': '.jpg',
			'image/gif': '.gif',
			'image/webp': '.webp',
			'image/svg+xml': '.svg'
		};
		const ext = mimeToExt[file.mimetype] || path.extname(file.originalname) || '.png';
		
		// Create course-specific assets directory
		const course = courseId || 'default';
		const assetsDir = path.join(__dirname, 'public', 'assets', course);
		const targetFileName = `module${moduleNumber}-${slideName}${ext}`;
		const targetPath = path.join(assetsDir, targetFileName);
		
		// Ensure assets directory exists
		if (!fs.existsSync(assetsDir)) {
			fs.mkdirSync(assetsDir, { recursive: true });
		}
		
		// Move file to assets directory
		fs.renameSync(file.path, targetPath);
		
		// Update moduleContent.ts with new imageSrc
		const relativePath = `assets/${course}/${targetFileName}`;
		const contentPath = path.join(__dirname, 'src', 'videos', 'moduleContent.ts');
		let content = fs.readFileSync(contentPath, 'utf-8');
		
		// Find the slide and update imageSrc
		const slidePattern = new RegExp(
			`(name:\\s*"${slideName}"[^}]*?)(imageSrc:\\s*"[^"]*")`,
			'g'
		);
		
		if (content.match(slidePattern)) {
			// Update existing imageSrc
			content = content.replace(slidePattern, `$1imageSrc: "${relativePath}"`);
		} else {
			// Add imageSrc if not present (before the closing bracket of the slide)
			const addPattern = new RegExp(
				`(name:\\s*"${slideName}"[^}]*?)(\\n\\s*\\})`,
				'g'
			);
			content = content.replace(addPattern, `$1,\n\t\t\timageSrc: "${relativePath}"$2`);
		}
		
		fs.writeFileSync(contentPath, content);
		
		console.log(`Image uploaded: ${targetFileName} -> ${relativePath}`);
		res.json({ 
			success: true, 
			fileName: targetFileName, 
			imageSrc: relativePath,
			message: `Image saved. Regenerate modules to apply changes.`
		});
	} catch (error) {
		console.error('Image upload error:', error);
		res.status(500).json({ error: error.message });
	}
});

// API: Get slide images for a module
app.get('/api/slide-images', (req, res) => {
	try {
		const { module: moduleNumber, course } = req.query;
		const courseId = course || 'default';
		
		// Read moduleContent.ts to find slides with images
		const contentPath = path.join(__dirname, 'src', 'videos', 'moduleContent.ts');
		const content = fs.readFileSync(contentPath, 'utf-8');
		
		// Find module content
		const modulePattern = new RegExp(
			`module${moduleNumber}Content[\\s\\S]*?slides:\\s*\\[([\\s\\S]*?)\\]\\s*\\}`,
			'g'
		);
		const moduleMatch = modulePattern.exec(content);
		
		if (!moduleMatch) {
			return res.json({ slides: [] });
		}
		
		// Extract slides with their imageSrc
		const slides = [];
		const slideRegex = /name:\s*"([^"]+)"[^}]*?(?:imageSrc:\s*"([^"]+)")?[^}]*?\}/g;
		let slideMatch;
		
		while ((slideMatch = slideRegex.exec(moduleMatch[1])) !== null) {
			slides.push({
				name: slideMatch[1],
				imageSrc: slideMatch[2] || null,
				hasImage: !!slideMatch[2] && !slideMatch[2].includes('placeholder')
			});
		}
		
		res.json({ slides, courseId });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// API: Validate and convert audio files (fix MP3s renamed to .wav) - with streaming progress
app.post('/api/validate-audio', (req, res) => {
	const scriptPath = path.join(__dirname, 'scripts', 'validateAndConvertAudio.ts');
	
	// Get active course from request or from courses.json
	let courseId = req.body?.courseId || null;
	if (!courseId) {
		const coursesData = readCoursesJson();
		const activeCourse = coursesData.courses?.find(c => c.status === 'active');
		courseId = activeCourse?.id || 'default';
	}
	
	console.log(`[validate-audio] Using course: ${courseId}`);
	
	// Set headers for streaming
	res.setHeader('Content-Type', 'text/event-stream');
	res.setHeader('Cache-Control', 'no-cache');
	res.setHeader('Connection', 'keep-alive');
	
	const { spawn } = require('child_process');
	// Pass course ID as argument to script
	const childProcess = spawn('npx', ['tsx', scriptPath, courseId], { 
		cwd: __dirname,
		shell: true 
	});
	
	let buffer = '';
	let totalFiles = 0;
	let processedFiles = 0;
	let convertedFiles = 0;
	
	res.write(`data: ${JSON.stringify({ type: 'start', message: 'Starting audio validation...' })}\n\n`);
	
	childProcess.stdout.on('data', (data) => {
		buffer += data.toString();
		const lines = buffer.split('\n');
		buffer = lines.pop() || '';
		
		for (const line of lines) {
			if (!line.trim()) continue;
			
			// Parse file counts
			if (line.includes('.wav files')) {
				const match = line.match(/Found (\d+) \.wav files/);
				if (match) {
					totalFiles += parseInt(match[1]);
					res.write(`data: ${JSON.stringify({ 
						type: 'info', 
						message: line.trim(),
						total: totalFiles
					})}\n\n`);
				}
			} else if (line.includes('.mp3 files')) {
				const match = line.match(/Found (\d+) \.mp3 files/);
				if (match) {
					totalFiles += parseInt(match[1]);
					res.write(`data: ${JSON.stringify({ 
						type: 'info', 
						message: line.trim(),
						total: totalFiles
					})}\n\n`);
				}
			}
			// Parse file processing
			else if (line.includes('...')) {
				processedFiles++;
				const percent = totalFiles > 0 ? Math.round((processedFiles / totalFiles) * 100) : 0;
				res.write(`data: ${JSON.stringify({ 
					type: 'progress', 
					message: line.trim(),
					processed: processedFiles,
					total: totalFiles,
					percent: percent
				})}\n\n`);
				
				if (line.includes('converted')) {
					convertedFiles++;
				}
			}
			// Summary lines
			else if (line.includes('Summary:') || line.includes('Converted:') || line.includes('All audio files are valid')) {
				res.write(`data: ${JSON.stringify({ 
					type: 'info', 
					message: line.trim()
				})}\n\n`);
			}
		}
	});
	
	childProcess.stderr.on('data', (data) => {
		console.error('[validate-audio] stderr:', data.toString());
	});
	
	childProcess.on('close', (code) => {
		res.write(`data: ${JSON.stringify({ 
			type: 'done', 
			success: code === 0,
			converted: convertedFiles,
			total: totalFiles,
			message: code === 0 ? 'Validation complete' : 'Validation failed'
		})}\n\n`);
		res.end();
	});
	
	childProcess.on('error', (error) => {
		res.write(`data: ${JSON.stringify({ 
			type: 'error', 
			message: error.message 
		})}\n\n`);
		res.end();
	});
});

// API: Generate and measure audio in alternating workflow
app.post('/api/generate-and-measure-audio', (req, res) => {
	const { moduleRange, course, voice, provider } = req.body;
	
	// If course is provided, get module range from course
	let finalModuleRange = moduleRange;
	if (course && !moduleRange) {
		try {
			const coursePath = path.join(__dirname, 'src', 'videos', 'courseStructure.ts');
			if (fs.existsSync(coursePath)) {
				const courseContent = fs.readFileSync(coursePath, 'utf-8');
				const mappingMatch = courseContent.match(new RegExp(`'${course}':\\s*\\[([\\d,\\s]+)\\]`));
				if (mappingMatch) {
					const moduleNumbers = mappingMatch[1].split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
					if (moduleNumbers.length > 0) {
						if (moduleNumbers.length === 1) {
							finalModuleRange = moduleNumbers[0].toString();
						} else {
							finalModuleRange = moduleNumbers.join(',');
						}
					}
				}
			}
		} catch (e) {
			console.error('Error getting course modules:', e);
		}
	}
	
	const scriptPath = path.join(__dirname, 'scripts', 'generateAndMeasureAudio.ts');
	const finalVoice = voice || 'andy';
	const finalProvider = provider || '';
	
	// Build command with provider argument
	let command = finalModuleRange
		? `npx tsx "${scriptPath}" ${finalModuleRange} ${finalVoice}`
		: `npx tsx "${scriptPath}" all ${finalVoice}`;
	
	// Add provider if specified (for strict mode - no fallback)
	if (finalProvider) {
		command += ` ${finalProvider}`;
		console.log(`[generate-and-measure-audio] Using provider: ${finalProvider} (strict mode)`);
	}
	
	// Set headers for streaming progress
	res.setHeader('Content-Type', 'text/event-stream');
	res.setHeader('Cache-Control', 'no-cache');
	res.setHeader('Connection', 'keep-alive');
	
	// Count total slides for progress tracking
	let totalSlides = 0;
	try {
		const contentPath = path.join(__dirname, 'src', 'videos', 'moduleContent.ts');
		const content = fs.readFileSync(contentPath, 'utf-8');
		const slideMatches = content.match(/name:\s*"/g);
		totalSlides = slideMatches ? slideMatches.length : 0;
	} catch (e) {
		console.error('Could not count slides:', e);
	}
	
	const childProcess = exec(command, { cwd: __dirname, maxBuffer: 10 * 1024 * 1024 });
	
	let buffer = '';
	let currentModule = '';
	let currentSlide = '';
	let processedSlides = 0;
	let skippedSlides = 0;
	
	res.write(`data: ${JSON.stringify({ 
		type: 'start', 
		message: 'Starting audio generation...', 
		total: totalSlides 
	})}\n\n`);
	
	childProcess.stdout.on('data', (data) => {
		buffer += data.toString();
		const lines = buffer.split('\n');
		buffer = lines.pop() || '';
		
		for (const line of lines) {
			if (!line.trim()) continue;
			
			// Parse module start
			if (line.includes('=== Module')) {
				const match = line.match(/=== Module (\d+): (.+) ===/);
				if (match) {
					currentModule = match[1];
					const title = match[2].trim();
					res.write(`data: ${JSON.stringify({ 
						type: 'module', 
						module: currentModule,
						title: title,
						message: `Module ${currentModule}: ${title}`
					})}\n\n`);
				}
			}
			
			// Parse generation
			if (line.includes('[GENERATE]')) {
				const match = line.match(/\[GENERATE\] (.+)/);
				if (match) {
					processedSlides++;
					currentSlide = match[1];
					const progress = totalSlides > 0 ? Math.round((processedSlides / totalSlides) * 100) : 0;
					res.write(`data: ${JSON.stringify({ 
						type: 'generate', 
						module: currentModule,
						slide: currentSlide,
						current: processedSlides,
						total: totalSlides,
						percent: progress,
						message: `Generating ${processedSlides}/${totalSlides}: ${currentSlide}`
					})}\n\n`);
				}
			}
			
			// Parse skip (already exists)
			if (line.includes('[SKIP GENERATE]')) {
				skippedSlides++;
				const match = line.match(/\[SKIP GENERATE\] (.+)/);
				if (match) {
					currentSlide = match[1].replace(' (already exists)', '');
					res.write(`data: ${JSON.stringify({ 
						type: 'skip', 
						module: currentModule,
						slide: currentSlide,
						current: processedSlides + skippedSlides,
						total: totalSlides,
						message: `Skipped ${currentSlide} (exists)`
					})}\n\n`);
				}
			}
			
			// Parse measurement
			if (line.includes('[MEASURE]')) {
				const match = line.match(/\[MEASURE\] (.+)/);
				if (match) {
					currentSlide = match[1];
					res.write(`data: ${JSON.stringify({ 
						type: 'measure', 
						module: currentModule,
						slide: currentSlide,
						message: `Measuring audio: ${currentSlide}`
					})}\n\n`);
				}
			}
			
			// Parse duration result
			if (line.includes('Duration:')) {
				const match = line.match(/Duration:\s*([\d.]+)\s*seconds/);
				if (match) {
					res.write(`data: ${JSON.stringify({ 
						type: 'duration', 
						module: currentModule,
						slide: currentSlide,
						duration: parseFloat(match[1]),
						message: `Duration: ${match[1]} seconds`
					})}\n\n`);
				}
			}
			
			// Parse completion messages
			if (line.includes('Generated successfully') || line.includes('Updated audioDuration.ts')) {
				res.write(`data: ${JSON.stringify({ 
					type: 'progress', 
					message: line.trim()
				})}\n\n`);
			}
			
			// Parse summary
			if (line.includes('Generated:') || line.includes('Measured:') || line.includes('Skipped:')) {
				res.write(`data: ${JSON.stringify({ 
					type: 'summary', 
					message: line.trim()
				})}\n\n`);
			}
			
			// Parse errors
			if (line.includes('Failed:') || line.includes('✗') || line.includes('Fatal error:')) {
				res.write(`data: ${JSON.stringify({ 
					type: 'error', 
					message: line.trim()
				})}\n\n`);
			}
		}
	});
	
	childProcess.stderr.on('data', (data) => {
		const errorMsg = data.toString().trim();
		// Ignore deprecation warnings (they're not real errors)
		if (errorMsg.includes('DeprecationWarning') || errorMsg.includes('punycode')) {
			return;
		}
		console.error('[generate-and-measure] stderr:', errorMsg);
		res.write(`data: ${JSON.stringify({ 
			type: 'error', 
			message: errorMsg
		})}\n\n`);
	});
	
	childProcess.on('close', (code) => {
		if (code === 0) {
			res.write(`data: ${JSON.stringify({ 
				type: 'done', 
				success: true,
				message: 'Generate and measure workflow complete!'
			})}\n\n`);
		} else {
			res.write(`data: ${JSON.stringify({ 
				type: 'done', 
				success: false,
				message: `Some slides failed (exit code ${code}). Run "Generate ALL Audio" again to generate only the remaining files. Existing files are never overwritten.`
			})}\n\n`);
		}
		res.end();
	});
	
	childProcess.on('error', (error) => {
		console.error('Child process error:', error);
		res.write(`data: ${JSON.stringify({ 
			type: 'error', 
			message: `Failed to start process: ${error.message}`
		})}\n\n`);
		res.write(`data: ${JSON.stringify({ 
			type: 'done', 
			success: false,
			message: error.message
		})}\n\n`);
		res.end();
	});
});

// API: Extract word timings with progress streaming
app.post('/api/extract-timings', (req, res) => {
	const { moduleRange, course, courseId, method = 'whisper' } = req.body;
	const targetCourseId = courseId || course; // Support both 'course' and 'courseId' for compatibility

	// Enforce course match: Remotion uses moduleContent.ts as source of truth.
	// Video processing must use the same course that is in moduleContent.
	const activeCourseId = getActiveCourseFromModuleContent();
	if (!activeCourseId) {
		return res.status(400).json({
			error: 'No active course in moduleContent.ts',
			details: 'Activate a course first (restore or activate from GUI) before extracting timings.'
		});
	}
	if (targetCourseId && targetCourseId !== activeCourseId) {
		return res.status(400).json({
			error: 'Course mismatch',
			details: `Selected course "${targetCourseId}" does not match the course in Remotion ("${activeCourseId}"). Activate the course you want to process first.`,
			activeCourseId,
			selectedCourseId: targetCourseId
		});
	}
	const effectiveCourseId = targetCourseId || activeCourseId;

	// If course is provided, get module range from course
	let finalModuleRange = moduleRange;
	if (effectiveCourseId && !moduleRange) {
		try {
			const coursePath = path.join(__dirname, 'src', 'videos', 'courseStructure.ts');
			if (fs.existsSync(coursePath)) {
				const courseContent = fs.readFileSync(coursePath, 'utf-8');
				const mappingMatch = courseContent.match(new RegExp(`'${effectiveCourseId}':\\s*\\[([\\d,\\s]+)\\]`));
				if (mappingMatch) {
					const moduleNumbers = mappingMatch[1].split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
					if (moduleNumbers.length > 0) {
						if (moduleNumbers.length === 1) {
							finalModuleRange = moduleNumbers[0].toString();
						} else {
							finalModuleRange = moduleNumbers.join(',');
						}
					}
				}
			}
		} catch (e) {
			console.error('Error getting course modules:', e);
		}
	}
	
	// Choose script based on method
	const scriptName = method === 'gentle' 
		? 'extractWordTimingsFromContentGentle.ts'
		: 'extractWordTimingsFromContent.ts';
	const scriptPath = path.join(__dirname, 'scripts', scriptName);
	
	// Build command - Gentle needs courseId; Whisper uses allModules from moduleContent
	let command;
	if (method === 'gentle') {
		command = finalModuleRange
			? `npx tsx "${scriptPath}" ${finalModuleRange} ${effectiveCourseId}`
			: `npx tsx "${scriptPath}" all ${effectiveCourseId}`;
	} else {
		// Whisper script uses allModules from moduleContent (course already enforced above)
		command = finalModuleRange
			? `npx tsx "${scriptPath}" ${finalModuleRange}`
			: `npx tsx "${scriptPath}" all`;
	}
	// On Linux/Mac: stdbuf -oL makes stdout line-buffered so GUI gets progress in real time
	if (process.platform !== 'win32') {
		command = `stdbuf -oL ${command}`;
	}
	
	// Set headers for Server-Sent Events
	res.setHeader('Content-Type', 'text/event-stream');
	res.setHeader('Cache-Control', 'no-cache');
	res.setHeader('Connection', 'keep-alive');
	
	// Parse progress from stdout
	const childProcess = exec(command, { cwd: __dirname, maxBuffer: 10 * 1024 * 1024 });
	
	let buffer = '';
	let currentModule = '';
	let currentSlide = '';
	let totalSlides = 0;
	let processedSlides = 0;
	let moduleSlides = 0;
	
	// Send initial progress with method info
	const methodName = method === 'gentle' ? 'Gentle' : 'Whisper';
	res.write(`data: ${JSON.stringify({ type: 'start', message: `Starting word timing extraction using ${methodName}...` })}\n\n`);

	// Heartbeat: if no stdout for 12s, send "loading" (Node pipes buffer output; first data can take 30-60s)
	let gotFirstOutput = false;
	const heartbeat = setInterval(() => {
		if (!gotFirstOutput && !childProcess.killed) {
			res.write(`data: ${JSON.stringify({ type: 'progress', message: `Loading script and modules... (first output can take 30-60 seconds)` })}\n\n`);
		}
	}, 12000);

	childProcess.stdout.on('data', (data) => {
		gotFirstOutput = true;
		clearInterval(heartbeat);
		buffer += data.toString();
		const lines = buffer.split('\n');
		buffer = lines.pop() || ''; // Keep incomplete line in buffer
		
		for (const line of lines) {
			if (!line.trim()) continue;
			
			// Parse early "Extracting..." / "Processing N module(s)..." for immediate feedback
			if (line.includes('Extracting word timings')) {
				res.write(`data: ${JSON.stringify({ type: 'progress', message: `Script started. Loading modules...` })}\n\n`);
			}
			if (line.match(/Processing \d+ module\(s\)/)) {
				const n = line.match(/Processing (\d+) module\(s\)/)?.[1] || '?';
				res.write(`data: ${JSON.stringify({ type: 'progress', message: `Processing ${n} module(s)...` })}\n\n`);
			}
			
			// Parse module start
			if (line.includes('=== Module')) {
				const match = line.match(/=== Module (\d+): (.+) ===/);
				if (match) {
					currentModule = match[1];
					const title = match[2].trim();
					moduleSlides = 0;
					res.write(`data: ${JSON.stringify({ 
						type: 'module', 
						module: currentModule,
						title: title,
						message: `📚 Module ${currentModule}: ${title}`
					})}\n\n`);
				}
			}
			
			// Parse slide processing start (slide names can have hyphens, e.g. intro-wireless-networks)
			if (line.includes('Processing') && line.includes('...') && !line.includes('Extracted') && !line.includes('Processed')) {
				const match = line.match(/Processing ([\w-]+)\.\.\./);
				if (match) {
					currentSlide = match[1];
					moduleSlides++;
					processedSlides++;
					res.write(`data: ${JSON.stringify({ 
						type: 'slide', 
						module: currentModule,
						slide: currentSlide,
						processed: processedSlides,
						total: totalSlides,
						message: `Processing ${currentSlide}... (this takes 1-3 minutes)`
					})}\n\n`);
				}
			}
			
			// Parse slide completion (scripts output "Processed" not "Extracted")
			if (line.includes('✓ Processed') || line.includes('✓ Extracted')) {
				const match = line.match(/✓ (?:Processed|Extracted) (\d+) words for ([\w-]+)/);
				if (match) {
					res.write(`data: ${JSON.stringify({ 
						type: 'complete', 
						module: currentModule,
						slide: match[2],
						words: parseInt(match[1]),
						message: `✓ Completed ${match[2]} - ${match[1]} words extracted`
					})}\n\n`);
				}
			}
			
			// Parse warnings
			if (line.includes('⚠ Skipping') || line.includes('⚠ No words')) {
				res.write(`data: ${JSON.stringify({ 
					type: 'warning', 
					message: line.trim()
				})}\n\n`);
			}
			
			// Parse errors
			if (line.includes('✗ Failed')) {
				res.write(`data: ${JSON.stringify({ 
					type: 'error', 
					message: line.trim()
				})}\n\n`);
			}
			
			// Parse final summary
			if (line.includes('Processed:') || line.includes('Skipped:')) {
				const match = line.match(/(Processed|Skipped):\s*(\d+)/);
				if (match) {
					if (match[1] === 'Processed') {
						totalSlides = parseInt(match[2]) + (totalSlides || 0);
					}
					res.write(`data: ${JSON.stringify({ 
						type: 'summary', 
						message: line.trim()
					})}\n\n`);
				}
			}
			
			// Parse completion message
			if (line.includes('✅ Word timing extraction complete!')) {
				res.write(`data: ${JSON.stringify({ 
					type: 'summary', 
					message: '✅ Extraction complete!'
				})}\n\n`);
			}
		}
	});
	
	childProcess.stderr.on('data', (data) => {
		const msg = data.toString().trim();
		// Ignore deprecation warnings (they're not real errors)
		if (msg.includes('DeprecationWarning') || msg.includes('punycode')) {
			return;
		}
		res.write(`data: ${JSON.stringify({ 
			type: 'error', 
			message: msg
		})}\n\n`);
	});
	
	childProcess.on('close', (code) => {
		clearInterval(heartbeat);
		if (code === 0) {
			// Word timings extracted successfully - now generate line mappings
			res.write(`data: ${JSON.stringify({ 
				type: 'summary', 
				message: 'Generating line mappings for code highlighting...'
			})}\n\n`);
			
			const lineMappingScript = path.join(__dirname, 'scripts', 'generateLineMappingsFromContent.ts');
			const lineMappingCommand = finalModuleRange 
				? `npx tsx "${lineMappingScript}" ${finalModuleRange}`
				: `npx tsx "${lineMappingScript}" all`;
			
			exec(lineMappingCommand, { cwd: __dirname, maxBuffer: 10 * 1024 * 1024 }, (err, stdout, stderr) => {
				if (err) {
					console.error('Line mapping generation error:', err);
					res.write(`data: ${JSON.stringify({ 
						type: 'warning', 
						message: 'Line mapping generation had issues (cues may be limited)'
					})}\n\n`);
				} else {
					// Parse the number of mappings generated
					const mappingMatch = stdout.match(/Generated (\d+) mappings/);
					const count = mappingMatch ? mappingMatch[1] : 'some';
					res.write(`data: ${JSON.stringify({ 
						type: 'summary', 
						message: `Generated ${count} line mappings for code highlighting`
					})}\n\n`);
				}
				
				res.write(`data: ${JSON.stringify({ 
					type: 'done', 
					success: true,
					message: 'Word timing extraction and line mapping complete!'
				})}\n\n`);
				res.end();
			});
		} else {
			res.write(`data: ${JSON.stringify({ 
				type: 'done', 
				success: false,
				message: `Process exited with code ${code}`
			})}\n\n`);
			res.end();
		}
	});
	
	childProcess.on('error', (error) => {
		clearInterval(heartbeat);
		res.write(`data: ${JSON.stringify({ 
			type: 'error', 
			message: error.message
		})}\n\n`);
		res.end();
	});
});

// API: Check if timings are extracted (now checks course-specific JSON files)
app.get('/api/check-timings', (req, res) => {
	try {
		const course = req.query.course || 'default';
		const courseTimingsDir = path.join(__dirname, 'courses', course, 'timings');
		let hasTimings = false;
		
		// Get module numbers for this course from courses.json
		let moduleNumbers = [];
		try {
			const coursesData = readCoursesJson();
			if (coursesData.courseModuleMapping && coursesData.courseModuleMapping[course]) {
				moduleNumbers = coursesData.courseModuleMapping[course];
			}
		} catch (e) {
			// If can't get course modules, check all timings
		}
		
		// Check JSON timing files in course directory
		if (fs.existsSync(courseTimingsDir)) {
			for (const moduleNum of moduleNumbers) {
				const jsonPath = path.join(courseTimingsDir, `module${moduleNum}.json`);
				if (fs.existsSync(jsonPath)) {
					try {
						const content = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
						if (content.slides && Object.keys(content.slides).length > 0) {
							// Check if any slide has words
							for (const slide of Object.values(content.slides)) {
								if (slide.words && slide.words.length > 0) {
									hasTimings = true;
									break;
								}
							}
						}
					} catch (e) {
						// Invalid JSON, skip
					}
					if (hasTimings) break;
				}
			}
		}
		
		res.json({ hasTimings });
	} catch (error) {
		res.json({ hasTimings: false });
	}
});

// API: Get slide statuses for a module
app.get('/api/slide-statuses', (req, res) => {
	try {
		const moduleNumber = req.query.module;
		const courseId = req.query.course || 'aws-pulumi';
		
		if (!moduleNumber) {
			return res.status(400).json({ error: 'Module number is required' });
		}
		
		const contentPath = path.join(__dirname, 'src', 'videos', 'moduleContent.ts');
		const content = fs.readFileSync(contentPath, 'utf-8');
		
		// Extract module content
		const moduleRegex = new RegExp(`export const module${moduleNumber}Content: ModuleContent = \\{([\\s\\S]*?)\\};`);
		const match = content.match(moduleRegex);
		
		if (!match) {
			return res.json({ slides: [] });
		}
		
		const moduleBody = match[1];
		
		// Find slides array using bracket counting (handles nested arrays/objects)
		const slidesStart = moduleBody.indexOf('slides:');
		if (slidesStart === -1) {
			return res.json({ slides: [] });
		}
		
		// Find the opening bracket
		const bracketStart = moduleBody.indexOf('[', slidesStart);
		if (bracketStart === -1) {
			return res.json({ slides: [] });
		}
		
		// Count brackets to find the matching closing bracket
		// Also track backticks to skip braces/brackets inside template literals
		let bracketDepth = 0;
		let inBacktickArray = false;
		let slidesEnd = -1;
		
		for (let i = bracketStart; i < moduleBody.length; i++) {
			const char = moduleBody[i];
			const prevChar = i > 0 ? moduleBody[i - 1] : '';
			
			// Toggle backtick state (but not for escaped backticks)
			if (char === '`' && prevChar !== '\\') {
				inBacktickArray = !inBacktickArray;
				continue;
			}
			
			// Skip bracket counting while inside template literals
			if (inBacktickArray) continue;
			
			if (char === '[') {
				bracketDepth++;
			} else if (char === ']') {
				bracketDepth--;
				if (bracketDepth === 0) {
					slidesEnd = i;
					break;
				}
			}
		}
		
		if (slidesEnd === -1) {
			return res.json({ slides: [] });
		}
		
		const slidesContent = moduleBody.substring(bracketStart + 1, slidesEnd);
		
		// Better parsing: split by slide boundaries
		// Handles nested objects AND template literals (backticks with braces inside)
		const slideTexts = [];
		let depth = 0;
		let currentSlide = '';
		let inSlide = false;
		let inBacktick = false; // Track if we're inside a template literal
		
		for (let i = 0; i < slidesContent.length; i++) {
			const char = slidesContent[i];
			const prevChar = i > 0 ? slidesContent[i - 1] : '';
			
			// Toggle backtick state (but not for escaped backticks)
			if (char === '`' && prevChar !== '\\') {
				inBacktick = !inBacktick;
				if (inSlide) currentSlide += char;
				continue;
			}
			
			// Skip brace counting while inside template literals
			if (inBacktick) {
				if (inSlide) currentSlide += char;
				continue;
			}
			
			if (char === '{') {
				if (depth === 0) {
					// Starting a new slide
					inSlide = true;
					currentSlide = '{';
				} else {
					currentSlide += char;
				}
				depth++;
			} else if (char === '}') {
				depth--;
				currentSlide += char;
				if (depth === 0 && inSlide) {
					// Finished a slide
					slideTexts.push(currentSlide);
					currentSlide = '';
					inSlide = false;
				}
			} else if (inSlide) {
				currentSlide += char;
			}
		}
		
		const slideMatches = slideTexts;
		
		// Use course-specific directories
		const course = courseId || 'default';
		const audioDir = path.join(__dirname, 'public', 'audio', course);
		const courseTimingsDir = path.join(__dirname, 'courses', course, 'timings');
		let moduleTimings = null;
		
		// Load timings from course-specific JSON file
		const timingsJsonPath = path.join(courseTimingsDir, `module${moduleNumber}.json`);
		console.log(`[slide-statuses] Checking: ${timingsJsonPath}`);
		if (fs.existsSync(timingsJsonPath)) {
			try {
				moduleTimings = JSON.parse(fs.readFileSync(timingsJsonPath, 'utf-8'));
				console.log(`[slide-statuses] Loaded timings for module ${moduleNumber}, slides: ${Object.keys(moduleTimings.slides || {}).join(', ')}`);
			} catch (e) {
				console.error(`[slide-statuses] Failed to parse JSON:`, e.message);
			}
		} else {
			console.log(`[slide-statuses] JSON file not found`);
		}
		
		const slides = [];
		
		if (slideMatches) {
			slideMatches.forEach((slideStr) => {
				const nameMatch = slideStr.match(/name:\s*"([^"]+)"/);
				const typeMatch = slideStr.match(/type:\s*"([^"]+)"/);
				const scriptMatch = slideStr.match(/script:\s*"([^"]+)"/);
				const titleMatch = slideStr.match(/title:\s*"([^"]+)"/);
				const imageSrcMatch = slideStr.match(/imageSrc:\s*"([^"]+)"/);
				
				if (!nameMatch) return;
				
				const slideName = nameMatch[1];
				const audioFileName = `module${moduleNumber}-${slideName}.wav`;
				const audioPath = path.join(audioDir, audioFileName);
				
				// Check audio status
				let audioStatus = 'missing';
				let audioSize = 0;
				if (fs.existsSync(audioPath)) {
					const stats = fs.statSync(audioPath);
					audioSize = stats.size;
					audioStatus = stats.size > 0 ? 'complete' : 'missing';
				}
				
				// Check timings status from JSON
				let timingsStatus = 'missing';
				
				if (moduleTimings && moduleTimings.slides && moduleTimings.slides[slideName]) {
					const slideTimings = moduleTimings.slides[slideName];
					if (slideTimings.words && slideTimings.words.length > 0) {
						timingsStatus = 'complete';
					}
				}
				
				// Video status (check if module file exists and includes this slide)
				// A slide is "video complete" if the module is generated and includes this slide
				let videoStatus = 'pending';
				const moduleFile = path.join(__dirname, 'src', 'videos', `Module${moduleNumber}.tsx`);
				const configFile = path.join(__dirname, 'src', 'videos', `Module${moduleNumber}Config.ts`);
				
				if (fs.existsSync(moduleFile) && fs.existsSync(configFile)) {
					const moduleFileContent = fs.readFileSync(moduleFile, 'utf-8');
					// Check if slide is referenced in the module file
					if (moduleFileContent.includes(slideName) || moduleFileContent.includes(`"${slideName}"`)) {
						videoStatus = 'complete';
					}
				}
				
				slides.push({
					name: slideName,
					type: typeMatch ? typeMatch[1] : 'content-single',
					title: titleMatch ? titleMatch[1] : '',
					script: scriptMatch ? scriptMatch[1] : '',
					imageSrc: imageSrcMatch ? imageSrcMatch[1] : null,
					audioStatus,
					audioSize,
					timingsStatus,
					videoStatus
				});
			});
		}
		
		res.json({ slides });
	} catch (error) {
		console.error('Error getting slide statuses:', error);
		res.status(500).json({ error: error.message });
	}
});

// API: Get workflow status (check what's complete/incomplete)
app.get('/api/workflow-status', (req, res) => {
	const courseId = req.query.course || 'default';
	try {
		// Use course-specific audio directory
		const audioDir = path.join(__dirname, 'public', 'audio', courseId);
		const videosDir = path.join(__dirname, 'src', 'videos');
		const contentPath = path.join(__dirname, 'src', 'videos', 'moduleContent.ts');
		
		// Read module content
		const content = fs.readFileSync(contentPath, 'utf-8');
		const moduleMatches = content.match(/export const module\d+Content: ModuleContent = \{[\s\S]*?\};/g) || [];
		
		const workflowStatus = {
			modules: [],
			summary: {
				totalModules: moduleMatches.length,
				modulesGenerated: 0,
				audioFilesGenerated: 0,
				totalAudioFiles: 0
			}
		};
		
		// Get module numbers for this course
		let moduleNumbers = [];
		try {
			const coursePath = path.join(__dirname, 'src', 'videos', 'courseStructure.ts');
			if (fs.existsSync(coursePath)) {
				const courseContent = fs.readFileSync(coursePath, 'utf-8');
				const mappingMatch = courseContent.match(new RegExp(`'${courseId}':\\s*\\[([\\d,\\s]+)\\]`));
				if (mappingMatch) {
					moduleNumbers = mappingMatch[1].split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
				}
			}
		} catch (e) {
			// Fallback: include all modules
		}
		
		// If no course mapping, include all modules
		if (moduleNumbers.length === 0) {
			moduleNumbers = moduleMatches.map((_, i) => i + 1);
		}
		
		// Check each module
		moduleMatches.forEach((match, index) => {
			const moduleNumber = index + 1;
			
			// Skip if not in this course
			if (!moduleNumbers.includes(moduleNumber)) {
				return;
			}
			const titleMatch = match.match(/title:\s*"([^"]+)"/);
			const slidesContent = extractSlidesContent(match);
			const slideNames = slidesContent ? extractSlideNames(slidesContent) : [];
			
			// Check if module files exist
			const moduleFile = path.join(videosDir, `Module${moduleNumber}.tsx`);
			const configFile = path.join(videosDir, `Module${moduleNumber}Config.ts`);
			const moduleGenerated = fs.existsSync(moduleFile) && fs.existsSync(configFile);
			
			// Check audio files
			const audioFiles = [];
			let audioComplete = 0;
			
			if (fs.existsSync(audioDir)) {
				slideNames.forEach(slideName => {
					const audioFileName = `module${moduleNumber}-${slideName}.wav`;
					const audioPath = path.join(audioDir, audioFileName);
					const exists = fs.existsSync(audioPath);
					
					audioFiles.push({
						name: slideName,
						fileName: audioFileName,
						exists,
						size: exists ? fs.statSync(audioPath).size : 0
					});
					
					if (exists && fs.statSync(audioPath).size > 0) {
						audioComplete++;
					}
				});
			}
			
			// Check audio durations (with course prefix)
			const audioDurationPath = path.join(__dirname, 'src', 'utils', 'audioDuration.ts');
			let audioMeasured = false;
			if (fs.existsSync(audioDurationPath)) {
				const audioDurationContent = fs.readFileSync(audioDurationPath, 'utf-8');
				// Audio duration keys now include course prefix: {courseId}/module{N}-{name}
				const audioKeys = slideNames.map(name => `${courseId}/module${moduleNumber}-${name}`);
				// Check that each key exists and has a numeric value
				audioMeasured = audioKeys.length > 0 && audioKeys.every(key => {
					const keyPattern = new RegExp(`"${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"\\s*:\\s*[\\d.]+`);
					return keyPattern.test(audioDurationContent);
				});
			}
			
			// Check word timings from course-specific directory
			const courseTimingsDir = path.join(__dirname, 'courses', courseId, 'timings');
			const timingsJsonPath = path.join(courseTimingsDir, `module${moduleNumber}.json`);
			let timingsExtracted = false;
			if (fs.existsSync(timingsJsonPath)) {
				try {
					const moduleTimings = JSON.parse(fs.readFileSync(timingsJsonPath, 'utf-8'));
					if (moduleTimings.slides) {
						for (const slideName of slideNames) {
							const slideTimings = moduleTimings.slides[slideName];
							if (slideTimings && slideTimings.words && slideTimings.words.length > 0) {
								timingsExtracted = true;
								break;
							}
						}
					}
				} catch (e) {
					// Invalid JSON
				}
			}
			
			// Determine status: basicPreview (Steps 1-3) vs fullyAnimated (Steps 1-4)
			const basicPreview = moduleGenerated && audioComplete === slideNames.length && audioMeasured;
			// Fully animated requires ALL slides to have word timings
			const fullyAnimated = basicPreview && timingsExtracted;
			
			workflowStatus.modules.push({
				moduleNumber,
				title: titleMatch ? titleMatch[1] : `Module ${moduleNumber}`,
				moduleGenerated,
				audioFiles,
				audioComplete,
				audioTotal: slideNames.length,
				audioProgress: slideNames.length > 0 ? (audioComplete / slideNames.length) * 100 : 0,
				audioMeasured,
				timingsExtracted,
				readyForRemotion: basicPreview, // Legacy: basic preview
				animationStatus: fullyAnimated ? 'fullyAnimated' : (basicPreview ? 'basicPreview' : 'incomplete')
			});
			
			if (moduleGenerated) workflowStatus.summary.modulesGenerated++;
			workflowStatus.summary.audioFilesGenerated += audioComplete;
			workflowStatus.summary.totalAudioFiles += slideNames.length;
		});
		
		// Calculate overall progress
		workflowStatus.summary.overallProgress = workflowStatus.summary.totalModules > 0
			? ((workflowStatus.summary.modulesGenerated / workflowStatus.summary.totalModules) * 50 +
			   (workflowStatus.summary.audioFilesGenerated / workflowStatus.summary.totalAudioFiles) * 50)
			: 0;
		
		res.json(workflowStatus);
	} catch (error) {
		console.error('Error getting workflow status:', error);
		res.status(500).json({ error: error.message });
	}
});

// API: Get checkpoint status for batch operations
app.get('/api/checkpoint-status', (req, res) => {
	try {
		const { operation, course } = req.query;
		const checkpointPath = path.join(__dirname, '.checkpoints', `${operation}-${course || 'default'}.json`);
		
		if (!fs.existsSync(checkpointPath)) {
			return res.json({ exists: false });
		}
		
		const checkpoint = JSON.parse(fs.readFileSync(checkpointPath, 'utf-8'));
		return res.json({
			exists: true,
			started: checkpoint.started,
			completed: checkpoint.completed?.length || 0,
			failed: checkpoint.failed?.length || 0,
			skipped: checkpoint.skipped?.length || 0,
			failedItems: checkpoint.failed || [],
			canResume: (checkpoint.failed?.length || 0) > 0
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// API: Clear checkpoint
app.post('/api/clear-checkpoint', (req, res) => {
	try {
		const { operation, course } = req.body;
		const checkpointPath = path.join(__dirname, '.checkpoints', `${operation}-${course || 'default'}.json`);
		
		if (fs.existsSync(checkpointPath)) {
			fs.unlinkSync(checkpointPath);
			res.json({ success: true, message: 'Checkpoint cleared' });
		} else {
			res.json({ success: true, message: 'No checkpoint to clear' });
		}
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// API: Generate audio for single slide (supports OpenAI, MiniMax, RunPod)
// For multi-audio code slides: pass base name to generate all chunks (-1, -2, -3)
app.post('/api/generate-audio-slide', async (req, res) => {
	const { moduleNumber, slideName, force, voice, provider } = req.body;
	
	if (!moduleNumber || !slideName) {
		return res.status(400).json({ error: 'Module number and slide name are required' });
	}
	
	const settings = loadVoiceSettings();
	const finalProvider = provider || settings.provider || 'openai';
	const finalVoice = voice || settings.defaultVoice?.[finalProvider] || 'onyx';
	
	console.log(`[generate-audio-slide] Module ${moduleNumber}, Slide: ${slideName}, Provider: ${finalProvider}, Voice: ${finalVoice}`);
	
	try {
		let itemsToGenerate = []; // { audioFileName, script }
		let courseId = 'default';
		const moduleContentPath = path.join(__dirname, 'src', 'videos', 'moduleContent.ts');

		try {
			// Clear require cache so we always read current moduleContent (fixes stale content after file change)
			try {
				const resolved = require.resolve(moduleContentPath);
				delete require.cache[resolved];
			} catch (_) { /* ignore if resolve fails */ }
			const { allModules } = require(moduleContentPath);
			const mod = allModules.find(m => m.moduleNumber === parseInt(moduleNumber));
			if (!mod) return res.status(404).json({ error: `Module ${moduleNumber} not found` });
			courseId = mod.courseId || 'default';
			const slide = mod.slides.find(s => s.name === slideName || slideName.startsWith(s.name + '-'));
			if (!slide) return res.status(404).json({ error: `Slide ${slideName} not found in module ${moduleNumber}` });

			const baseName = slide.name;
			const scripts = (slide.scripts && slide.scripts.length >= 1) ? slide.scripts : (slide.script ? [slide.script] : []);

			const chunkMatch = slideName.match(/^(.+)-(\d+)$/);
			const chunkIndex = chunkMatch && chunkMatch[1] === baseName ? parseInt(chunkMatch[2]) - 1 : -1;

			if (slide.type === 'code' && scripts.length > 1) {
				if (chunkIndex >= 0 && chunkIndex < scripts.length) {
					itemsToGenerate.push({
						audioFileName: `module${moduleNumber}-${baseName}-${chunkIndex + 1}`,
						script: scripts[chunkIndex]
					});
				} else {
					for (let i = 0; i < scripts.length; i++) {
						itemsToGenerate.push({
							audioFileName: `module${moduleNumber}-${baseName}-${i + 1}`,
							script: scripts[i]
						});
					}
				}
			} else {
				itemsToGenerate.push({
					audioFileName: `module${moduleNumber}-${baseName}`,
					script: scripts[0] || ''
				});
			}
		} catch (e) {
			const content = fs.readFileSync(moduleContentPath, 'utf-8');
			// Match module block: slides array ends with "];" then "};" (not "], }")
			const modulePattern = new RegExp(`module${moduleNumber}Content[\\s\\S]*?slides:\\s*\\[([\\s\\S]*?)\\]\\s*;?\\s*\\}\\s*;`, 'm');
			const moduleMatch = content.match(modulePattern);
			if (!moduleMatch) return res.status(404).json({ error: `Module ${moduleNumber} not found` });
			const courseIdMatch = moduleMatch[0].match(/courseId:\s*["']([^"']+)["']/);
			courseId = courseIdMatch ? courseIdMatch[1] : 'default';
			const slidePattern = new RegExp(`name:\\s*["']${slideName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["'][\\s\\S]*?script:\\s*"((?:[^"\\\\]|\\\\.)*)"`, 'm');
			const slideMatch = moduleMatch[1].match(slidePattern);
			if (!slideMatch) return res.status(404).json({ error: `Slide ${slideName} not found in module ${moduleNumber}` });
			itemsToGenerate = [{
				audioFileName: `module${moduleNumber}-${slideName}`,
				script: slideMatch[1].replace(/\\"/g, '"').replace(/\\n/g, ' ')
			}];
		}

		const audioDir = path.join(__dirname, 'public', 'audio', courseId);
		if (!fs.existsSync(audioDir)) fs.mkdirSync(audioDir, { recursive: true });

		if (finalProvider === 'openai' || finalProvider === 'minimax' || finalProvider === 'runpod' || finalProvider === 'elevenlabs') {
			const { UnifiedVoiceService } = require('./src/utils/unifiedVoiceService');
			const voiceService = new UnifiedVoiceService();
			let totalSize = 0;
			for (const item of itemsToGenerate) {
				const audioPath = path.join(audioDir, `${item.audioFileName}.wav`);
				if (fs.existsSync(audioPath) && !force) continue;
				const result = await voiceService.generateAudio({
					prompt: item.script,
					voice: finalVoice,
					format: 'wav',
					provider: finalProvider
				});
				if (result.audioData) {
					const base64 = result.audioData.includes(",") ? result.audioData.split(",")[1] : result.audioData;
					const buf = Buffer.from(base64, "base64");
					fs.writeFileSync(audioPath, buf);
					totalSize += buf.length;
				} else if (result.audioUrl) {
					const resp = await fetch(result.audioUrl);
					const buf = Buffer.from(await resp.arrayBuffer());
					fs.writeFileSync(audioPath, buf);
					totalSize += buf.length;
				}
			}
			res.json({ success: true, path: path.join(audioDir, itemsToGenerate[0].audioFileName + '.wav'), size: totalSize, provider: finalProvider, chunksGenerated: itemsToGenerate.length });
		} else {
			const scriptPath = path.join(__dirname, 'scripts', 'generateAudioForSlide.ts');
			const runOne = (item) => {
				const targetName = item.audioFileName.replace(`module${moduleNumber}-`, '').replace('.wav', '');
				const cmd = force ? `npx tsx "${scriptPath}" ${moduleNumber} ${targetName} ${finalVoice} ${finalProvider} --force` : `npx tsx "${scriptPath}" ${moduleNumber} ${targetName} ${finalVoice} ${finalProvider}`;
				return new Promise((resolve, reject) => {
					exec(cmd, { cwd: __dirname }, (err, out, stderr) => err ? reject(new Error(stderr || err.message)) : resolve(out));
				});
			};
			Promise.all(itemsToGenerate.map(runOne))
				.then(outputs => res.json({ success: true, output: outputs.join('\n') }))
				.catch(err => res.status(500).json({ error: err.message }));
		}
	} catch (error) {
		console.error('[generate-audio-slide] Error:', error);
		res.status(500).json({ error: error.message });
	}
});

// Helper: Validate exported video
function validateExportedVideo(moduleNumber, courseId, videoPath, fileSize) {
	const validation = {
		valid: true,
		errors: [],
		warnings: [],
		checks: {}
	};
	
	try {
		// Check 1: File exists and has reasonable size
		if (fileSize < 1000) { // Less than 1KB is suspicious
			validation.valid = false;
			validation.errors.push(`Video file is too small (${(fileSize / 1024).toFixed(1)}KB) - likely corrupted or incomplete`);
		} else if (fileSize < 100000) { // Less than 100KB is very small
			validation.warnings.push(`Video file is very small (${(fileSize / 1024).toFixed(1)}KB) - may be incomplete`);
		}
		validation.checks.fileSize = { valid: fileSize >= 1000, size: fileSize, sizeMB: (fileSize / 1024 / 1024).toFixed(2) };
		
		// Check 2: Verify expected duration matches (if config exists)
		const configPath = path.join(__dirname, 'src', 'videos', `Module${moduleNumber}Config.ts`);
		if (fs.existsSync(configPath)) {
			try {
				const configContent = fs.readFileSync(configPath, 'utf-8');
				const durationMatch = configContent.match(/totalDuration:\s*([\d.]+)/);
				if (durationMatch) {
					const expectedDuration = parseFloat(durationMatch[1]);
					validation.checks.expectedDuration = expectedDuration;
					// Note: Actual video duration would require ffprobe/ffmpeg, which we don't have here
					// This is a limitation - we can only check file size, not actual duration
					validation.warnings.push('Video duration validation requires ffprobe (not available) - manually verify duration matches expected');
				}
			} catch (e) {
				validation.warnings.push('Could not read module config to verify expected duration');
			}
		}
		
		// Check 3: Verify module content matches (check slide count)
		const contentPath = path.join(__dirname, 'src', 'videos', 'moduleContent.ts');
		if (fs.existsSync(contentPath)) {
			try {
				const content = fs.readFileSync(contentPath, 'utf-8');
				const moduleMatch = content.match(new RegExp(`export const module${moduleNumber}Content: ModuleContent = \\{([\\s\\S]*?)\\};`));
				if (moduleMatch) {
					const slidesContent = extractSlidesContent(moduleMatch[1]);
					if (slidesContent) {
						const slideNames = extractSlideNames(slidesContent);
						validation.checks.slideCount = slideNames.length;
						validation.checks.slides = slideNames;
					}
				}
			} catch (e) {
				validation.warnings.push('Could not verify slide count from module content');
			}
		}
		
		// Check 4: Verify audio files exist for all slides
		const audioDir = path.join(__dirname, 'public', 'audio', courseId);
		if (validation.checks.slides && fs.existsSync(audioDir)) {
			const missingAudio = [];
			validation.checks.slides.forEach(slideName => {
				const audioFile = path.join(audioDir, `module${moduleNumber}-${slideName}.wav`);
				if (!fs.existsSync(audioFile) || fs.statSync(audioFile).size === 0) {
					missingAudio.push(slideName);
				}
			});
			if (missingAudio.length > 0) {
				validation.warnings.push(`Missing audio files for ${missingAudio.length} slide(s): ${missingAudio.slice(0, 3).join(', ')}${missingAudio.length > 3 ? '...' : ''}`);
			}
			validation.checks.audioFiles = { total: validation.checks.slides.length, missing: missingAudio.length };
		}
		
		// Overall validation
		if (validation.errors.length > 0) {
			validation.valid = false;
		}
		
	} catch (error) {
		validation.valid = false;
		validation.errors.push(`Validation error: ${error.message}`);
	}
	
	return validation;
}

// API: Render video to MP4
app.post('/api/render-video', (req, res) => {
	const { moduleNumber, courseId } = req.body;
	
	if (!moduleNumber) {
		return res.status(400).json({ error: 'Module number is required' });
	}
	
	// Use course-specific output directory
	const course = courseId || 'default';
	const outDir = path.join(__dirname, 'out', course);
	if (!fs.existsSync(outDir)) {
		fs.mkdirSync(outDir, { recursive: true });
	}
	
	const compositionId = `module-${moduleNumber}`;
	const outputPath = path.join(outDir, `${compositionId}.mp4`);
	const indexPath = path.join(__dirname, 'src', 'index.tsx');
	
	// Set headers for streaming progress
	res.setHeader('Content-Type', 'text/event-stream');
	res.setHeader('Cache-Control', 'no-cache');
	res.setHeader('Connection', 'keep-alive');
	
	// Build render command with options for better compatibility
	// --timeout increases browser connection timeout (default 30000)
	const command = `npx remotion render "${indexPath}" ${compositionId} "${outputPath}" --timeout=120000`;
	
	const childProcess = exec(command, { 
		cwd: __dirname, 
		maxBuffer: 10 * 1024 * 1024,
		timeout: 0, // No timeout for the exec itself (rendering can take a while)
		env: { 
			...process.env, 
			NODE_ENV: 'production',
			// Increase Puppeteer timeout for browser connection
			PUPPETEER_TIMEOUT: '120000'
		}
	});
	
	res.write(`data: ${JSON.stringify({ type: 'start', message: `Starting video render for Module ${moduleNumber}...` })}\n\n`);
	
	console.log(`[render-video] Starting render for ${compositionId}`);
	
	let buffer = '';
	let stderrBuffer = '';
	let phase = 'bundling'; // 'bundling' or 'rendering'
	let lastBundlePercent = 0;
	let lastRenderPercent = 0;
	
	// Helper to send phase-aware progress
	// Phases: bundling (0-30%), copying (30-35%), rendering (35-90%), encoding (90-99%), complete (100%)
	const sendProgress = (percent, message, currentPhase) => {
		let overallPercent;
		if (currentPhase === 'bundling') {
			overallPercent = Math.round(percent * 0.30); // 0-30%
		} else if (currentPhase === 'copying') {
			overallPercent = 32;
		} else if (currentPhase === 'rendering') {
			overallPercent = 35 + Math.round(percent * 0.55); // 35-90%
		} else if (currentPhase === 'encoding') {
			overallPercent = 90 + Math.round(percent * 0.09); // 90-99%
		} else {
			overallPercent = 100;
		}
		res.write(`data: ${JSON.stringify({ 
			type: 'progress', 
			message: `[${currentPhase.toUpperCase()}] ${message}`,
			percent: overallPercent,
			phase: currentPhase
		})}\n\n`);
	};
	
	childProcess.stdout.on('data', (data) => {
		buffer += data.toString();
		const lines = buffer.split('\n');
		buffer = lines.pop() || '';
		
		for (const line of lines) {
			if (!line.trim()) continue;
			
			// Parse bundling progress (e.g., "Bundling 45%")
			const bundleMatch = line.match(/Bundling\s+(\d+)%/i);
			if (bundleMatch) {
				const percent = parseInt(bundleMatch[1]);
				if (percent > lastBundlePercent) {
					lastBundlePercent = percent;
					sendProgress(percent, `Bundling ${percent}%`, 'bundling');
				}
				continue;
			}
			
			// Parse "Copying public dir" phase (between bundling and rendering)
			if (line.includes('Copying public dir')) {
				phase = 'copying';
				res.write(`data: ${JSON.stringify({ 
					type: 'progress', 
					message: '[PREPARING] Copying assets...',
					percent: 32,
					phase: 'copying'
				})}\n\n`);
				continue;
			}
			
			// Parse "Getting compositions" - about to start rendering
			if (line.includes('Getting compositions') || line.includes('Composition')) {
				phase = 'rendering';
				res.write(`data: ${JSON.stringify({ 
					type: 'progress', 
					message: '[RENDERING] Starting frame render...',
					percent: 35,
					phase: 'rendering'
				})}\n\n`);
				continue;
			}
			
			// Parse rendering progress: "Rendered X/Y" format
			// Only send updates every 5% to reduce noise
			const frameMatch = line.match(/Rendered\s+(\d+)\/(\d+)/i);
			if (frameMatch) {
				phase = 'rendering';
				const current = parseInt(frameMatch[1]);
				const total = parseInt(frameMatch[2]);
				const percent = Math.round((current / total) * 100);
				// Only update on 5% milestones to reduce verbosity
				if (percent >= lastRenderPercent + 5 || percent === 100) {
					lastRenderPercent = percent;
					const overallPercent = 35 + Math.round(percent * 0.55);
					res.write(`data: ${JSON.stringify({ 
						type: 'progress', 
						message: `Rendering ${percent}%`,
						percent: overallPercent,
						phase: 'rendering'
					})}\n\n`);
				}
				continue;
			}
			
			// Parse encoding progress: "Encoded X/Y"
			// Only send updates every 10% to reduce noise
			const encodedMatch = line.match(/Encoded\s+(\d+)\/(\d+)/i);
			if (encodedMatch) {
				phase = 'encoding';
				const current = parseInt(encodedMatch[1]);
				const total = parseInt(encodedMatch[2]);
				const percent = Math.round((current / total) * 100);
				// Only update on 10% milestones
				const lastEncodingMilestone = Math.floor(lastRenderPercent / 10) * 10;
				const currentMilestone = Math.floor(percent / 10) * 10;
				if (currentMilestone > lastEncodingMilestone || percent === 100) {
					const overallPercent = 90 + Math.round(percent * 0.09);
					res.write(`data: ${JSON.stringify({ 
						type: 'progress', 
						message: `Encoding ${percent}%`,
						percent: overallPercent,
						phase: 'encoding'
					})}\n\n`);
				}
				continue;
			}
			
			// Parse final output line (e.g., "+   out/test.mp4 300 kB")
			if (line.includes('.mp4') && (line.includes('kB') || line.includes('MB'))) {
				res.write(`data: ${JSON.stringify({ 
					type: 'progress', 
					message: '[COMPLETE] Video file created',
					percent: 100,
					phase: 'complete'
				})}\n\n`);
			}
		}
	});
	
	childProcess.stderr.on('data', (data) => {
		const rawMessage = data.toString();
		const lines = rawMessage.split('\n');
		
		for (const line of lines) {
			const message = line.trim();
			if (!message) continue;
			
			// Skip verbose Chrome console logs (delayRender, Symbol, etc.)
			if (message.includes('Symbol(') || 
			    message.includes('delayRender') || 
			    message.includes('CONSOLE') ||
			    message.includes('handle was cleared') ||
			    message.includes('source: http://localhost')) {
				continue; // Filter out verbose debug messages
			}
			
			// Parse rendering progress from stderr (Remotion outputs progress here)
			// Format: "Rendering frame 50/1000" or "Rendered 50 frames" or "(50%)"
			const frameMatch = message.match(/(?:Render(?:ing|ed)?)\s*(?:frame)?\s*(\d+)\s*(?:\/|of)\s*(\d+)/i);
			if (frameMatch) {
				phase = 'rendering';
				const current = parseInt(frameMatch[1]);
				const total = parseInt(frameMatch[2]);
				const percent = Math.round((current / total) * 100);
				if (percent >= lastRenderPercent) {
					lastRenderPercent = percent;
					sendProgress(percent, `Rendering frame ${current}/${total} (${percent}%)`, 'rendering');
				}
				continue;
			}
			
			// Also check for "Stitching" or encoding phase
			if (message.includes('Stitching') || message.includes('Encoding') || message.includes('stitching')) {
				phase = 'rendering';
				sendProgress(95, 'Stitching video...', 'rendering');
				continue;
			}
			
			// Check for "Rendered X frames" summary
			const renderedMatch = message.match(/Rendered\s+(\d+)\s+frames/i);
			if (renderedMatch) {
				phase = 'rendering';
				sendProgress(90, `Rendered ${renderedMatch[1]} frames`, 'rendering');
				continue;
			}
			
			// Classify errors
			const isError = message.includes('Error') || message.includes('error:') || 
			                message.includes('TimeoutError') || message.includes('failed') ||
			                message.includes('ENOENT') || message.includes('Cannot');
			
			if (isError) {
				console.error('[render-video] Error:', message);
				res.write(`data: ${JSON.stringify({ type: 'error', message })}\n\n`);
			} else if (message.includes('Render') || message.includes('frame') || message.includes('video')) {
				// Log other rendering-related messages
				console.log('[render-video] Info:', message);
				phase = 'rendering';
				res.write(`data: ${JSON.stringify({ type: 'progress', message: '[RENDERING] ' + message, phase: 'rendering' })}\n\n`);
			}
		}
	});
	
	childProcess.on('close', (code) => {
		// Check if output file exists (even on non-zero exit code)
		// Windows EPERM errors can occur during cleanup even when render succeeds
		const fileExists = fs.existsSync(outputPath);
		const hasEpermError = stderrBuffer.includes('EPERM') || stderrBuffer.includes('kill EPERM');
		
		if (code === 0 || (fileExists && hasEpermError)) {
			// Wait a moment for file system to catch up (Windows)
			setTimeout(() => {
				if (fs.existsSync(outputPath)) {
					const stats = fs.statSync(outputPath);
					if (stats.size > 0) {
						// Validate exported video
						const validation = validateExportedVideo(moduleNumber, course, outputPath, stats.size);
						
						const message = hasEpermError && code !== 0
							? `Video rendered successfully! (Windows cleanup warning ignored)`
							: `Video rendered successfully!`;
						
						res.write(`data: ${JSON.stringify({ 
							type: 'done', 
							success: true, 
							message: message,
							filePath: outputPath,
							fileSize: stats.size,
							downloadUrl: `/api/download-video?module=${moduleNumber}&course=${course}`,
							validation: validation
						})}\n\n`);
						res.end();
					} else {
						res.write(`data: ${JSON.stringify({ 
							type: 'done', 
							success: false, 
							message: 'Output file is empty' 
						})}\n\n`);
						res.end();
					}
				} else {
					res.write(`data: ${JSON.stringify({ 
						type: 'done', 
						success: false, 
						message: 'Render completed but output file not found' 
					})}\n\n`);
					res.end();
				}
			}, hasEpermError ? 1000 : 0);
		} else {
			// Check one more time if file exists (might have been created)
			if (fileExists) {
				const stats = fs.statSync(outputPath);
				if (stats.size > 0) {
					// Validate exported video
					const validation = validateExportedVideo(moduleNumber, course, outputPath, stats.size);
					
					res.write(`data: ${JSON.stringify({ 
						type: 'done', 
						success: true, 
						message: `Video rendered successfully! (Non-zero exit code but file exists)`,
						filePath: outputPath,
						fileSize: stats.size,
						downloadUrl: `/api/download-video?module=${moduleNumber}&course=${course}`,
						validation: validation
					})}\n\n`);
					res.end();
				} else {
					res.write(`data: ${JSON.stringify({ 
						type: 'done', 
						success: false, 
						message: `Render failed with exit code ${code}` 
					})}\n\n`);
					res.end();
				}
			} else {
				res.write(`data: ${JSON.stringify({ 
					type: 'done', 
					success: false, 
					message: `Render failed with exit code ${code}` 
				})}\n\n`);
				res.end();
			}
		}
	});
	
	childProcess.on('error', (error) => {
		res.write(`data: ${JSON.stringify({ 
			type: 'error', 
			message: `Render error: ${error.message}` 
		})}\n\n`);
		res.end();
	});
});

// API: Download rendered video
app.get('/api/download-video', (req, res) => {
	const { module } = req.query;
	
	if (!module) {
		return res.status(400).json({ error: 'Module number is required' });
	}
	
	const course = req.query.course || 'default';
	const videoPath = path.join(__dirname, 'out', course, `module-${module}.mp4`);
	
	if (!fs.existsSync(videoPath)) {
		return res.status(404).json({ error: 'Video file not found. Please render it first.' });
	}
	
	res.download(videoPath, `module-${module}.mp4`, (err) => {
		if (err) {
			console.error('Download error:', err);
			res.status(500).json({ error: 'Failed to download video' });
		}
	});
});

// API: Generate preview modules (fixed durations, no audio) and prepare for Remotion
// Lets user view segments in Remotion Studio before generating audio
app.post('/api/generate-preview-modules', (req, res) => {
	try {
		const { course } = req.body;
		const moduleContentPath = path.join(__dirname, 'src', 'videos', 'moduleContent.ts');
		if (!fs.existsSync(moduleContentPath)) {
			return res.status(400).json({
				error: 'No course content found',
				details: 'Save a plan and activate a course first. moduleContent.ts is missing.'
			});
		}

		const command = `npx tsx scripts/generateModulesFromContent.ts all --preview`;
		console.log(`[generate-preview-modules] Running: ${command}`);

		execSync(command, {
			cwd: __dirname,
			stdio: 'pipe',
			encoding: 'utf-8'
		});

		console.log('[generate-preview-modules] Preview modules generated successfully');
		res.json({
			success: true,
			message: 'Preview modules generated. Open Remotion Studio to view segments.',
			remotionUrl: 'http://localhost:3000'
		});
	} catch (error) {
		console.error('[generate-preview-modules] Error:', error);
		const details = (error.stderr || error.stdout || '').toString();
		res.status(500).json({
			error: error.message || 'Failed to generate preview modules',
			details: details || undefined
		});
	}
});

// API: Render all modules (batch/overnight rendering)
app.post('/api/render-course', (req, res) => {
	const { modules, concurrency, scale, course } = req.body;
	
	// Build command arguments
	let args = [];
	if (modules && Array.isArray(modules) && modules.length > 0) {
		args.push(`--modules=${modules.join(',')}`);
	} else if (course) {
		// Get modules for this course
		try {
			const coursePath = path.join(__dirname, 'src', 'videos', 'courseStructure.ts');
			if (fs.existsSync(coursePath)) {
				const courseContent = fs.readFileSync(coursePath, 'utf-8');
				const mappingMatch = courseContent.match(new RegExp(`'${course}':\\s*\\[([\\d,\\s]+)\\]`));
				if (mappingMatch) {
					const moduleNumbers = mappingMatch[1].split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
					if (moduleNumbers.length > 0) {
						args.push(`--modules=${moduleNumbers.join(',')}`);
					}
				}
			}
		} catch (e) {
			console.error('Error getting course modules:', e);
		}
	}
	
	args.push(`--concurrency=${concurrency || 4}`);
	if (scale && scale !== 1) {
		args.push(`--scale=${scale}`);
	}
	
	const scriptPath = path.join(__dirname, 'scripts', 'renderAllModules.ts');
	const command = `npx tsx "${scriptPath}" ${args.join(' ')}`;
	
	console.log(`[render-course] Starting batch render: ${command}`);
	
	// Set headers for streaming
	res.setHeader('Content-Type', 'text/event-stream');
	res.setHeader('Cache-Control', 'no-cache');
	res.setHeader('Connection', 'keep-alive');
	
	res.write(`data: ${JSON.stringify({ type: 'start', message: 'Starting batch video render...' })}\n\n`);
	
	const childProcess = exec(command, { 
		cwd: __dirname, 
		maxBuffer: 50 * 1024 * 1024,
		timeout: 0
	});
	
	let currentModule = '';
	
	childProcess.stdout.on('data', (data) => {
		const lines = data.toString().split('\n');
		for (const line of lines) {
			if (!line.trim()) continue;
			
			// Parse module start
			if (line.includes('Rendering Module')) {
				const match = line.match(/Rendering Module (\d+)/);
				if (match) {
					currentModule = match[1];
					res.write(`data: ${JSON.stringify({ 
						type: 'module_start', 
						module: currentModule,
						message: `Starting Module ${currentModule}...`
					})}\n\n`);
				}
				continue;
			}
			
			// Parse module complete
			if (line.includes('completed in')) {
				const match = line.match(/Module (\d+) completed in (\d+)s/);
				if (match) {
					res.write(`data: ${JSON.stringify({ 
						type: 'module_complete', 
						module: match[1],
						duration: parseInt(match[2]),
						message: `Module ${match[1]} completed in ${match[2]}s`
					})}\n\n`);
				}
				continue;
			}
			
			// Parse progress
			if (line.includes('Rendered') || line.includes('Bundling') || line.includes('Encoded')) {
				res.write(`data: ${JSON.stringify({ 
					type: 'progress', 
					module: currentModule,
					message: line.trim()
				})}\n\n`);
			}
		}
	});
	
	childProcess.stderr.on('data', (data) => {
		const message = data.toString().trim();
		if (message && !message.includes('Symbol(') && !message.includes('CONSOLE')) {
			console.error('[render-course] stderr:', message);
		}
	});
	
	childProcess.on('close', (code) => {
		res.write(`data: ${JSON.stringify({ 
			type: 'done', 
			success: code === 0,
			message: code === 0 ? 'Batch render complete!' : `Batch render failed with code ${code}`
		})}\n\n`);
		res.end();
	});
	
	childProcess.on('error', (error) => {
		res.write(`data: ${JSON.stringify({ type: 'error', message: error.message })}\n\n`);
		res.end();
	});
});

// API: Generate timings for single slide
app.post('/api/generate-timings-slide', (req, res) => {
	const { moduleNumber, slideName } = req.body;
	
	if (!moduleNumber || !slideName) {
		return res.status(400).json({ error: 'Module number and slide name are required' });
	}
	
	const command = `npx tsx scripts/extractTimingsForSlide.ts ${moduleNumber} ${slideName}`;
	
	// Set headers for streaming
	res.setHeader('Content-Type', 'text/event-stream');
	res.setHeader('Cache-Control', 'no-cache');
	res.setHeader('Connection', 'keep-alive');
	
	const childProcess = exec(command, { cwd: __dirname, maxBuffer: 10 * 1024 * 1024 });
	
	let buffer = '';
	
	res.write(`data: ${JSON.stringify({ type: 'start', message: `Extracting timings for ${slideName}...` })}\n\n`);
	
	childProcess.stdout.on('data', (data) => {
		buffer += data.toString();
		const lines = buffer.split('\n');
		buffer = lines.pop() || '';
		
		for (const line of lines) {
			if (!line.trim()) continue;
			
			// Log all output for debugging
			console.log(`[extract-timings] ${line.trim()}`);
			
			if (line.includes('✅ Extracted') || line.includes('✓ Saved')) {
				res.write(`data: ${JSON.stringify({ type: 'complete', message: line.trim() })}\n\n`);
			} else if (line.includes('✗ Failed') || line.includes('⚠') || line.includes('Error')) {
				res.write(`data: ${JSON.stringify({ type: 'warning', message: line.trim() })}\n\n`);
			} else if (line.includes('Processing') || line.includes('Extracting')) {
				res.write(`data: ${JSON.stringify({ type: 'progress', message: line.trim() })}\n\n`);
			} else {
				// Send all other output as info
				res.write(`data: ${JSON.stringify({ type: 'info', message: line.trim() })}\n\n`);
			}
		}
	});
	
	childProcess.stderr.on('data', (data) => {
		const errorMsg = data.toString().trim();
		console.error(`[extract-timings stderr] ${errorMsg}`);
		res.write(`data: ${JSON.stringify({ type: 'error', message: errorMsg })}\n\n`);
	});
	
	childProcess.on('close', (code) => {
		if (code === 0) {
			// Word timings extracted - now generate line mappings for this module
			res.write(`data: ${JSON.stringify({ type: 'progress', message: 'Generating line mappings...' })}\n\n`);
			
			const lineMappingScript = path.join(__dirname, 'scripts', 'generateLineMappingsFromContent.ts');
			const lineMappingCommand = `npx tsx "${lineMappingScript}" ${moduleNumber}`;
			
			exec(lineMappingCommand, { cwd: __dirname, maxBuffer: 10 * 1024 * 1024 }, (err, stdout, stderr) => {
				if (err) {
					console.error('Line mapping generation error:', err);
				}
				res.write(`data: ${JSON.stringify({ type: 'done', success: true, message: 'Timings and line mappings generated!' })}\n\n`);
				res.end();
			});
		} else {
			res.write(`data: ${JSON.stringify({ type: 'done', success: false, message: `Process exited with code ${code}` })}\n\n`);
			res.end();
		}
	});
	
	childProcess.on('error', (error) => {
		res.write(`data: ${JSON.stringify({ type: 'error', message: error.message })}\n\n`);
		res.end();
	});
});

// API: Get detailed module status (for finalize button)
// Supports multi-audio code slides (scripts array -> -1, -2, -3 audio files)
app.get('/api/module-status', (req, res) => {
	const moduleNumber = parseInt(req.query.moduleNumber);
	const courseId = req.query.course || 'default';
	if (!moduleNumber || isNaN(moduleNumber)) {
		return res.status(400).json({ error: 'Module number is required' });
	}

	function getAudioItemsForModule(modules, modNum, cId) {
		const mod = modules.find(m => m.moduleNumber === modNum);
		if (!mod) return [];
		const items = [];
		for (const slide of mod.slides) {
			const isMulti = slide.type === 'code' && slide.scripts && slide.scripts.length > 1;
			if (isMulti) {
				for (let i = 0; i < slide.scripts.length; i++) {
					items.push({
						displayName: `${slide.name}-${i + 1}`,
						audioFileName: `module${modNum}-${slide.name}-${i + 1}`,
						audioKey: `${cId}/module${modNum}-${slide.name}-${i + 1}`,
						timingsKey: slide.name
					});
				}
			} else {
				items.push({
					displayName: slide.name,
					audioFileName: `module${modNum}-${slide.name}`,
					audioKey: `${cId}/module${modNum}-${slide.name}`,
					timingsKey: slide.name
				});
			}
		}
		return items;
	}

	try {
		const moduleFile = path.join(__dirname, 'src', 'videos', `Module${moduleNumber}.tsx`);
		const configFile = path.join(__dirname, 'src', 'videos', `Module${moduleNumber}Config.ts`);
		const hasModuleFiles = fs.existsSync(moduleFile) && fs.existsSync(configFile);

		let audioItems = [];
		try {
			const { allModules } = require(path.join(__dirname, 'src', 'videos', 'moduleContent.ts'));
			audioItems = getAudioItemsForModule(allModules, moduleNumber, courseId);
		} catch (e) {
			const contentPath = path.join(__dirname, 'src', 'videos', 'moduleContent.ts');
			const content = fs.readFileSync(contentPath, 'utf-8');
			const moduleMatch = content.match(new RegExp(`export const module${moduleNumber}Content: ModuleContent = \\{([\\s\\S]*?)\\};`));
			if (moduleMatch) {
				const slidesContent = extractSlidesContent(moduleMatch[1]);
				const names = slidesContent ? extractSlideNames(slidesContent) : [];
				audioItems = names.map(name => ({
					displayName: name,
					audioFileName: `module${moduleNumber}-${name}`,
					audioKey: `${courseId}/module${moduleNumber}-${name}`,
					timingsKey: name
				}));
			}
		}

		const slideNames = [...new Set(audioItems.map(i => i.timingsKey))];
		const audioDir = path.join(__dirname, 'public', 'audio', courseId);
		const missingAudioFiles = [];
		const existingAudioFiles = [];
		audioItems.forEach(item => {
			const audioFile = path.join(audioDir, `${item.audioFileName}.wav`);
			if (fs.existsSync(audioFile) && fs.statSync(audioFile).size > 0) {
				existingAudioFiles.push(item.displayName);
			} else {
				missingAudioFiles.push(item.displayName);
			}
		});

		const audioDurationPath = path.join(__dirname, 'src', 'utils', 'audioDuration.ts');
		const missingAudioDurations = [];
		if (fs.existsSync(audioDurationPath)) {
			const audioDurationContent = fs.readFileSync(audioDurationPath, 'utf-8');
			audioItems.forEach(item => {
				const keyPattern = new RegExp(`"${item.audioKey.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"\\s*:\\s*[\\d.]+`);
				if (!keyPattern.test(audioDurationContent)) {
					missingAudioDurations.push(item.displayName);
				}
			});
		} else {
			missingAudioDurations.push(...audioItems.map(i => i.displayName));
		}

		const timingsJsonPath = path.join(__dirname, 'courses', courseId, 'timings', `module${moduleNumber}.json`);
		let hasAllTimings = false;
		const missingTimings = [];
		if (fs.existsSync(timingsJsonPath)) {
			try {
				const moduleTimings = JSON.parse(fs.readFileSync(timingsJsonPath, 'utf-8'));
				if (moduleTimings.slides) {
					slideNames.forEach(slideName => {
						const slideTimings = moduleTimings.slides[slideName];
						if (!slideTimings || !slideTimings.words || slideTimings.words.length === 0) {
							missingTimings.push(slideName);
						}
					});
					hasAllTimings = missingTimings.length === 0;
				} else {
					missingTimings.push(...slideNames);
				}
			} catch (e) {
				missingTimings.push(...slideNames);
			}
		} else {
			missingTimings.push(...slideNames);
		}

		const basicPreview = hasModuleFiles && missingAudioFiles.length === 0 && missingAudioDurations.length === 0;
		const fullyAnimated = basicPreview && hasAllTimings;

		res.json({
			moduleNumber,
			hasModuleFiles,
			missingAudioFiles,
			existingAudioFiles,
			missingAudioDurations,
			missingTimings,
			readyForRemotion: basicPreview,
			animationStatus: fullyAnimated ? 'fullyAnimated' : (basicPreview ? 'basicPreview' : 'incomplete'),
			canFinalize: fullyAnimated
		});
	} catch (error) {
		console.error('Error checking module status:', error);
		res.status(500).json({ error: error.message });
	}
});

// API: Diagnostic endpoint - check what's preventing Remotion from working
app.get('/api/diagnose', (req, res) => {
	try {
		const { moduleNumber, course } = req.query;
		const courseId = course || 'default';
		const diagnostics = {
			moduleNumber: moduleNumber || 'all',
			courseId: courseId,
			issues: [],
			warnings: [],
			success: []
		};

		// Check if module files exist and are valid
		if (moduleNumber) {
			const modNum = parseInt(moduleNumber);
			const moduleFile = path.join(__dirname, 'src', 'videos', `Module${modNum}.tsx`);
			const configFile = path.join(__dirname, 'src', 'videos', `Module${modNum}Config.ts`);
			
			if (!fs.existsSync(moduleFile)) {
				diagnostics.issues.push(`Module${modNum}.tsx does not exist`);
			} else {
				// Check for common syntax errors
				const content = fs.readFileSync(moduleFile, 'utf-8');
				if (content.includes('summarySlide') && !content.includes('const summarySlide')) {
					diagnostics.issues.push(`Module${modNum}.tsx references undefined 'summarySlide' variable`);
				}
				if (content.match(/const\s+[\w-]+-\w+\s*=/)) {
					diagnostics.issues.push(`Module${modNum}.tsx has invalid variable names with hyphens (e.g., 'slide-2Slide')`);
				}
				if (content.match(/audioFiles\.\w+-\w+/)) {
					diagnostics.issues.push(`Module${modNum}.tsx uses invalid property access (e.g., 'audioFiles.slide-2' should be 'audioFiles["slide-2"]')`);
				}
			}
			
			if (!fs.existsSync(configFile)) {
				diagnostics.issues.push(`Module${modNum}Config.ts does not exist`);
			}
			
			// Check if module is in Root.tsx
			const rootPath = path.join(__dirname, 'src', 'Root.tsx');
			if (fs.existsSync(rootPath)) {
				const rootContent = fs.readFileSync(rootPath, 'utf-8');
				if (!rootContent.includes(`Module${modNum}`)) {
					diagnostics.issues.push(`Module${modNum} is not registered in Root.tsx`);
				} else {
					diagnostics.success.push(`Module${modNum} is registered in Root.tsx`);
				}
			}
			
			// Check audio files and durations (use course-specific directory)
			const audioDir = path.join(__dirname, 'public', 'audio', courseId);
			const contentPath = path.join(__dirname, 'src', 'videos', 'moduleContent.ts');
			let moduleMatch = null;
			if (fs.existsSync(contentPath)) {
				const content = fs.readFileSync(contentPath, 'utf-8');
				moduleMatch = content.match(new RegExp(`export const module${modNum}Content: ModuleContent = \\{([\\s\\S]*?)\\};`));
			}
			if (moduleMatch && moduleMatch[1]) {
				const slidesContent = moduleMatch[1];
				const nameMatches = slidesContent.match(/name:\s*"([^"]+)"/g) || [];
				const slideNames = nameMatches.map(m => m.match(/"([^"]+)"/)[1]);
				
				// Check audio files
				const missingAudio = [];
				slideNames.forEach(name => {
					const audioFile = path.join(audioDir, `module${modNum}-${name}.wav`);
					if (!fs.existsSync(audioFile) || (fs.existsSync(audioFile) && fs.statSync(audioFile).size === 0)) {
						missingAudio.push(name);
					}
				});
				
				// Check audio durations (with course prefix)
				const audioDurationPath = path.join(__dirname, 'src', 'utils', 'audioDuration.ts');
				const audioKeys = slideNames.map(name => `${courseId}/module${modNum}-${name}`);
				const missingDurations = [];
				
				if (fs.existsSync(audioDurationPath)) {
					const audioDurationContent = fs.readFileSync(audioDurationPath, 'utf-8');
					audioKeys.forEach(key => {
						const keyPattern = new RegExp(`"${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"\\s*:\\s*[\\d.]+`);
						if (!keyPattern.test(audioDurationContent)) {
							missingDurations.push(key);
						}
					});
				} else {
					// If file doesn't exist, all durations are missing
					audioKeys.forEach(key => missingDurations.push(key));
				}
				
				// Report issues
				if (missingAudio.length > 0) {
					diagnostics.issues.push(`Missing audio files: ${missingAudio.join(', ')}. Run "Generate Audio" step.`);
				}
				
				if (missingDurations.length > 0) {
					diagnostics.issues.push(`Missing audio durations: ${missingDurations.join(', ')}. Run "Measure Audio" step.`);
				}
				
				// Only report success if BOTH audio files AND durations exist
				if (missingAudio.length === 0 && missingDurations.length === 0) {
					diagnostics.success.push(`All audio files exist`);
					diagnostics.success.push(`All audio durations exist`);
				} else if (missingAudio.length === 0) {
					diagnostics.success.push(`All audio files exist`);
				}
				// Note: We don't report durations as existing if audio files are missing
				// The missing audio files issue is already reported above
			}
		} else {
			// Check Root.tsx
			const rootPath = path.join(__dirname, 'src', 'Root.tsx');
			if (fs.existsSync(rootPath)) {
				const rootContent = fs.readFileSync(rootPath, 'utf-8');
				// Check for syntax errors
				if (rootContent.includes('summarySlide')) {
					diagnostics.warnings.push('Root.tsx may reference undefined variables');
				}
			}
		}

		diagnostics.status = diagnostics.issues.length === 0 ? 'ok' : 'error';
		res.json(diagnostics);
	} catch (error) {
		res.status(500).json({ error: error.message, issues: ['Failed to run diagnostics'] });
	}
});

// Serve GUI
app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, 'gui', 'index.html'));
});

app.listen(PORT, () => {
	console.log(`Skilleo AI GUI Server running on http://localhost:${PORT}`);
	console.log(`Remotion Studio should be on http://localhost:3000`);
});
