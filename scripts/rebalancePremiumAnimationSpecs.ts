// Rebalance premium animation specs so left-panel diagram nodes animate with cards.
// Fixes: hub nodes revealed late, card-only highlight phases, idle left panel during long gaps.

import * as fs from 'fs';
import * as path from 'path';

const COURSE_ID = 'agentic-ai-for-beginners';
const REPO_ROOT = path.join(__dirname, '..');
const SVG_ROOT = path.join(
	REPO_ROOT,
	'courses',
	COURSE_ID,
	'course/diagrams/svg'
);

/** Hand-tuned specs — do not overwrite. */
const SKIP_SPECS = new Set([
	'direct-prompting-vs-agentic-premium.animation.json',
]);

const PANEL_CHROME = new Set([
	'architecture-panel',
	'workflow-badge',
	'roles-panel',
	'integration-panel',
	'loop-panel',
	'cards',
	'architecture',
	'enterprise-labels',
	'panel',
	'divider',
]);

const HUB_IDS = new Set([
	'agent-core',
	'llm-core',
	'orchestrator',
	'goal',
	'rag-core',
	'pipeline-core',
]);

interface AnimationPhase {
	start: number;
	end: number;
	show?: string[];
	dim?: string[];
	highlight?: string[];
	label?: string;
	triggerWords?: string[];
}

interface AnimationSpec {
	diagram: string;
	sectionSummary?: string;
	phases: AnimationPhase[];
	bulletTriggerWords?: string[][];
}

function isCard(id: string): boolean {
	return /^card-\d+$/.test(id);
}

function isPanelNode(id: string): boolean {
	return !isCard(id) && !PANEL_CHROME.has(id);
}

function uniq(items: string[]): string[] {
	return [...new Set(items)];
}

function ensureArray(phase: AnimationPhase, key: 'show' | 'dim' | 'highlight'): string[] {
	if (!phase[key]) {
		phase[key] = [];
	}
	return phase[key] as string[];
}

function collectPanelNodes(spec: AnimationSpec): string[] {
	const ids = new Set<string>();
	for (const phase of spec.phases) {
		for (const id of phase.show ?? []) {
			if (isPanelNode(id)) ids.add(id);
		}
		for (const id of phase.highlight ?? []) {
			if (isPanelNode(id)) ids.add(id);
		}
	}
	return [...ids];
}

function findAllPremiumSpecs(): string[] {
	const results: string[] = [];
	function walk(dir: string) {
		for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
			const full = path.join(dir, entry.name);
			if (entry.isDirectory()) walk(full);
			else if (entry.name.endsWith('-premium.animation.json')) results.push(full);
		}
	}
	walk(SVG_ROOT);
	return results.sort();
}

function rebalanceHubEarly(spec: AnimationSpec, changes: string[]): void {
	const phases = spec.phases;
	if (phases.length < 3) return;

	for (const hubId of HUB_IDS) {
		let firstPhase = -1;
		for (let i = 0; i < phases.length; i++) {
			if ((phases[i].show ?? []).includes(hubId)) {
				firstPhase = i;
				break;
			}
		}
		if (firstPhase < 0) continue;
		if (firstPhase < phases.length - 2) continue;

		const targetIdx = phases[0].show?.length === 0 ? 1 : Math.min(2, phases.length - 2);
		const target = phases[targetIdx];
		const show = ensureArray(target, 'show');
		if (!show.includes(hubId)) {
			show.push(hubId);
			const dim = ensureArray(target, 'dim');
			const highlight = ensureArray(target, 'highlight');
			if (!highlight.includes(hubId) && !dim.includes(hubId)) {
				dim.push(hubId);
			}
			changes.push(`early hub: ${hubId} -> phase ${targetIdx} (${target.label ?? 'unnamed'})`);
		}
	}
}

function rebalanceCardOnlyHighlights(spec: AnimationSpec, changes: string[]): void {
	const phases = spec.phases;
	const panelNodes = collectPanelNodes(spec);
	const shownPanel = new Set<string>();

	for (let i = 0; i < phases.length; i++) {
		const phase = phases[i];
		const show = ensureArray(phase, 'show');
		const dim = ensureArray(phase, 'dim');
		const highlight = ensureArray(phase, 'highlight');

		const hlCards = highlight.filter(isCard);
		const hlPanel = highlight.filter(isPanelNode);
		const newPanel = show.filter(isPanelNode).filter((id) => !shownPanel.has(id));

		if (hlCards.length > 0 && hlPanel.length === 0 && newPanel.length === 0) {
			const visiblePanel = show.filter(isPanelNode);
			if (visiblePanel.length > 0) {
				const pick = visiblePanel[visiblePanel.length - 1];
				if (!highlight.includes(pick)) {
					highlight.push(pick);
					changes.push(
						`card-only phase ${i}: highlight visible panel "${pick}" (${phase.label ?? 'unnamed'})`
					);
				}
			} else {
				let nextPanel: string | null = null;
				for (let j = i + 1; j < phases.length; j++) {
					for (const id of phases[j].show ?? []) {
						if (isPanelNode(id) && !shownPanel.has(id) && !show.includes(id)) {
							nextPanel = id;
							break;
						}
					}
					if (nextPanel) break;
				}
				if (!nextPanel) {
					nextPanel =
						panelNodes.find((id) => !shownPanel.has(id) && !show.includes(id)) ?? null;
				}
				if (nextPanel) {
					show.push(nextPanel);
					highlight.push(nextPanel);
					const dim = ensureArray(phase, 'dim');
					for (const id of show.filter(isPanelNode)) {
						if (id !== nextPanel && !highlight.includes(id) && !dim.includes(id)) {
							dim.push(id);
						}
					}
					changes.push(
						`card-only phase ${i}: pulled forward "${nextPanel}" (${phase.label ?? 'unnamed'})`
					);
					shownPanel.add(nextPanel);
				}
			}
		}

		for (const id of show) {
			if (isPanelNode(id)) shownPanel.add(id);
		}
	}
}

function rebalanceStaggerLeftWithCards(spec: AnimationSpec, changes: string[]): void {
	const phases = spec.phases;
	const scheduledPanelOrder: string[] = [];
	for (const phase of phases) {
		for (const id of phase.show ?? []) {
			if (isPanelNode(id) && !scheduledPanelOrder.includes(id)) {
				scheduledPanelOrder.push(id);
			}
		}
	}

	let panelCursor = 0;
	const revealed = new Set<string>();

	for (let i = 0; i < phases.length; i++) {
		const phase = phases[i];
		const show = ensureArray(phase, 'show');
		const highlight = ensureArray(phase, 'highlight');
		const dim = ensureArray(phase, 'dim');

		const newCards = show.filter(isCard).filter((id) => {
			const prevShow = new Set(phases.slice(0, i).flatMap((p) => p.show ?? []));
			return !prevShow.has(id);
		});

		if (newCards.length === 0) continue;

		const newPanelInPhase = show.filter(isPanelNode).filter((id) => !revealed.has(id));
		if (newPanelInPhase.length > 0) {
			for (const id of newPanelInPhase) revealed.add(id);
			panelCursor += newPanelInPhase.length;
			continue;
		}

		while (panelCursor < scheduledPanelOrder.length) {
			const candidate = scheduledPanelOrder[panelCursor];
			if (revealed.has(candidate)) {
				panelCursor++;
				continue;
			}
			show.push(candidate);
			if (!highlight.some(isPanelNode)) {
				highlight.push(candidate);
			}
			if (!dim.includes(candidate) && !highlight.includes(candidate)) {
				dim.push(candidate);
			}
			revealed.add(candidate);
			panelCursor++;
			changes.push(
				`stagger phase ${i}: paired "${candidate}" with ${newCards.join(', ')} (${phase.label ?? 'unnamed'})`
			);
			break;
		}
	}
}

function rebalanceSpec(spec: AnimationSpec): string[] {
	const changes: string[] = [];
	rebalanceHubEarly(spec, changes);
	rebalanceCardOnlyHighlights(spec, changes);
	rebalanceStaggerLeftWithCards(spec, changes);

	for (const phase of spec.phases) {
		phase.show = uniq(phase.show ?? []);
		phase.dim = uniq(phase.dim ?? []);
		phase.highlight = uniq(phase.highlight ?? []);
	}
	return changes;
}

function main(): void {
	const specs = findAllPremiumSpecs();
	let updated = 0;
	let skipped = 0;
	const report: { file: string; changes: string[] }[] = [];

	console.log(`Rebalancing ${specs.length} premium animation specs...\n`);

	for (const specPath of specs) {
		const base = path.basename(specPath);
		if (SKIP_SPECS.has(base)) {
			console.log(`SKIP (hand-tuned): ${path.relative(SVG_ROOT, specPath)}`);
			skipped++;
			continue;
		}

		const spec = JSON.parse(fs.readFileSync(specPath, 'utf-8')) as AnimationSpec;
		const changes = rebalanceSpec(spec);
		if (changes.length > 0) {
			fs.writeFileSync(specPath, `${JSON.stringify(spec, null, 2)}\n`, 'utf-8');
			updated++;
			report.push({ file: path.relative(SVG_ROOT, specPath), changes });
			console.log(`UPDATED: ${path.relative(SVG_ROOT, specPath)}`);
			for (const c of changes) console.log(`  - ${c}`);
		} else {
			console.log(`OK: ${path.relative(SVG_ROOT, specPath)}`);
		}
	}

	console.log(`\nDone: ${updated} updated, ${skipped} skipped, ${specs.length - updated - skipped} unchanged.`);

	const needsReview = report.filter((r) => r.changes.length > 4);
	if (needsReview.length > 0) {
		console.log('\nReview recommended (many auto-changes):');
		for (const r of needsReview) console.log(`  - ${r.file} (${r.changes.length} changes)`);
	}
}

main();
