# Store (archived code)

Retired implementations live here so `src/` stays focused on the active pipeline.

## Active architecture (what stays in `src/`)

| Layer | Path | Role |
|-------|------|------|
| Slide courses | `src/videos/GenericModule.tsx` + `moduleContent.ts` | One runtime component, content-driven |
| Scene courses | `courses/{id}/course/remotion/scenes/` + `BaseDiagramScene` | Per-module scene components |
| Timings | `public/timings/moduleN.json` | Gentle word timings (canonical) |
| SVG scenes | `courses/.../diagrams/svg/` + `*.animation.json` | Group IDs + phase specs |
| Root | `src/Root.tsx` | `GenericModule` or regenerated `ModuleN` after `activateCourse` |

## What is archived here

### `archived-components/`
Superseded SVG slide components (replaced by `BaseDiagramScene` for scenes, `GenericModule` for slides):
- `AnimatedDiagramScene`, `WordDrivenSvgSlide`, `EnhancedSvgAnimation`
- `SvgSequentialSlide`, `SvgContentSlide`, `StickTeacherBulletSlide`

### `archived-utils/`
- `svgElementMappings.ts` — only used by archived components; scene course uses `animation.json` instead

### `archived-videos/`
Generated `ModuleN.tsx` / `ModuleNConfig.ts` files. Not needed while `Root.tsx` uses `GenericModule`.
Scene courses regenerate these into `src/videos/` via `activateCourse` → `generateModulesFromScenes.ts`.

### `archived-scripts/`
One-off or superseded tooling. Canonical replacements noted in each folder.

### `archived-backups/`
Timestamped backups from `activateCourse` and old manual copies. Safe to delete locally.

## Restore something

```bash
# Example: restore a component for reference
cp store/archived-components/WordDrivenSvgSlide.tsx src/components/

# Scene course: regenerate ModuleN wrappers (do not copy from store)
npx tsx scripts/activateCourse.ts agentic-ai-for-beginners
```

## Re-run cleanup

```bash
npx tsx scripts/archiveToStore.ts
```

Moves new orphans/backups into `store/` without touching active `src/` files.
