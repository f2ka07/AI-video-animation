// Service to parse and modify moduleContent.ts
// This will be used by the GUI server to read/write module data

import * as fs from 'fs';
import * as path from 'path';

export interface SlideContent {
	name: string;
	type: "title" | "content-two-card" | "content-single" | "code" | "comparison";
	script: string;
	title?: string;
	subtitle?: string;
	points?: string[];
	code?: string;
	language?: string;
	leftItems?: string[];
	rightItems?: string[];
	leftTitle?: string;
	rightTitle?: string;
	imageSrc?: string;
}

export interface ModuleContent {
	moduleNumber: number;
	title: string;
	subtitle: string;
	slides: SlideContent[];
}

// Helper: Extract slides array content using bracket counting
// Properly handles nested arrays/objects and template literals
function extractSlidesContent(moduleBody: string): string | null {
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

export function parseModuleContent(filePath: string): ModuleContent[] {
	const content = fs.readFileSync(filePath, 'utf-8');
	const modules: ModuleContent[] = [];
	
	// Extract all module exports
	const moduleRegex = /export const module(\d+)Content: ModuleContent = \{([\s\S]*?)\};/g;
	let match;
	
	while ((match = moduleRegex.exec(content)) !== null) {
		const moduleNumber = parseInt(match[1]);
		const moduleBody = match[2];
		
		// Extract title
		const titleMatch = moduleBody.match(/title:\s*"([^"]+)"/);
		const subtitleMatch = moduleBody.match(/subtitle:\s*"([^"]+)"/);
		
		// Extract slides using bracket counting (handles nested arrays/template literals)
		const slidesContent = extractSlidesContent(moduleBody);
		const slides: SlideContent[] = [];
		
		if (slidesContent) {
			// Match individual slide objects
			const slideRegex = /\{([\s\S]*?)\}/g;
			let slideMatch;
			
			while ((slideMatch = slideRegex.exec(slidesContent)) !== null) {
				const slideBody = slideMatch[1];
				
				const nameMatch = slideBody.match(/name:\s*"([^"]+)"/);
				const typeMatch = slideBody.match(/type:\s*"([^"]+)"/);
				const scriptMatch = slideBody.match(/script:\s*"([^"]+)"/);
				const titleMatch = slideBody.match(/title:\s*"([^"]+)"/);
				const subtitleMatch = slideBody.match(/subtitle:\s*"([^"]+)"/);
				
				// Extract points array
				const pointsMatch = slideBody.match(/points:\s*\[([\s\S]*?)\]/);
				const points: string[] = [];
				if (pointsMatch) {
					const pointsContent = pointsMatch[1];
					const pointRegex = /"([^"]+)"/g;
					let pointMatch;
					while ((pointMatch = pointRegex.exec(pointsContent)) !== null) {
						points.push(pointMatch[1]);
					}
				}
				
				// Extract code
				const codeMatch = slideBody.match(/code:\s*`([\s\S]*?)`/);
				
				slides.push({
					name: nameMatch ? nameMatch[1] : '',
					type: (typeMatch ? typeMatch[1] : 'content-single') as SlideContent['type'],
					script: scriptMatch ? scriptMatch[1] : '',
					title: titleMatch ? titleMatch[1] : undefined,
					subtitle: subtitleMatch ? subtitleMatch[1] : undefined,
					points: points.length > 0 ? points : undefined,
					code: codeMatch ? codeMatch[1] : undefined,
					language: slideBody.match(/language:\s*"([^"]+)"/)?.[1],
					imageSrc: slideBody.match(/imageSrc:\s*"([^"]+)"/)?.[1],
				});
			}
		}
		
		modules.push({
			moduleNumber,
			title: titleMatch ? titleMatch[1] : `Module ${moduleNumber}`,
			subtitle: subtitleMatch ? subtitleMatch[1] : '',
			slides
		});
	}
	
	return modules;
}

export function getModuleByNumber(filePath: string, moduleNumber: number): ModuleContent | null {
	const modules = parseModuleContent(filePath);
	return modules.find(m => m.moduleNumber === moduleNumber) || null;
}

// Test function
if (require.main === module) {
	const contentPath = path.join(__dirname, '../src/videos/moduleContent.ts');
	const modules = parseModuleContent(contentPath);
	console.log(`Found ${modules.length} modules`);
	modules.forEach(m => {
		console.log(`Module ${m.moduleNumber}: ${m.title} (${m.slides.length} slides)`);
	});
}
