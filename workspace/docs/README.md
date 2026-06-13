# my-slides - Automated Video Course Creator

A comprehensive video creation platform built on Remotion that generates professional course videos from TypeScript-defined content with AI-powered text-to-speech narration.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Installation](#installation)
- [Workflow](#workflow)
- [Course Management](#course-management)
- [Batch Rendering](#batch-rendering)
- [Configuration](#configuration)
- [Scripts Reference](#scripts-reference)
- [GUI Server](#gui-server)
- [Known Issues](#known-issues)

---

## Overview

This system automates the creation of educational video content through a multi-step pipeline:

1. **Content Definition** - Define modules and slides in `moduleContent.ts`
2. **Module Generation** - Auto-generate Remotion components from content
3. **Audio Generation** - Use AI TTS services (RunPod, Minimax, ElevenLabs) to create narration
4. **Audio Measurement** - Measure actual audio durations for precise timing
5. **Word Timing Extraction** - Extract word-level timestamps via Whisper API for synchronized highlighting
6. **Video Rendering** - Render final MP4 videos via Remotion

### Key Features

- Declarative content definition in TypeScript
- Multiple TTS service support with automatic fallback
- Word-level timing synchronization for code highlighting
- Web-based GUI for workflow management
- Support for multiple slide types (title, content, code, comparison, diagrams)
- Per-module timing data stored as JSON for runtime loading

---

## Architecture

```
my-slides/
  src/
    Root.tsx                    # Remotion entry point - registers all compositions
    index.tsx                   # Remotion bootstrap
    videos/
      moduleContent.ts          # MAIN CONTENT FILE - all slides defined here
      Module{N}.tsx             # Auto-generated module components
      Module{N}Config.ts        # Auto-generated module configurations
      courseStructure.ts        # Course-to-module mapping (TypeScript definitions)
    components/
      TitleSlide.tsx            # Title slide component
      AnimatedContentSlide.tsx  # Content slide with bullet points
      AnimatedCodeSlide.tsx     # Code slide with syntax highlighting
      AnimatedComparisonSlide.tsx # Two-column comparison slides
    hooks/
      useModuleTimings.ts       # Hook to load word timings from JSON
    utils/
      audioDuration.ts          # Auto-generated audio duration map
      unifiedVoiceService.ts    # Multi-service TTS with fallback
      wordTimings.ts            # Type definitions (deprecated for JSON)
  
  public/
    audio/
      {courseId}/               # Course-specific audio files
        module{N}-{slide}.wav   # Audio organized by course
      whoosh.wav                # Shared transition sound
    timings/                    # Per-module word timing JSON files
    assets/                     # SVG icons and images
  
  out/
    {courseId}/                 # Course-specific video output
      module-{N}.mp4            # Rendered videos organized by course
  
  courses.json                  # Course metadata and module mappings
  
  courses/                      # Course-specific content storage
    {courseId}/                 # Per-course directories
      content.json              # Course content in JSON format
      timings/                  # Per-module word timing files
        module{N}.json          # Word timings for each module
  
  scripts/
    generateModulesFromContent.ts    # Generate Module{N}.tsx files
    generateAudioFromContent.ts      # Generate audio for all slides
    measureActualAudio.ts            # Measure audio durations
    extractWordTimingsFromContent.ts # Extract word timings via Whisper
    generateLineMappingsFromContent.ts # Map words to code lines
    validateModuleContent.ts         # Validate content structure
    renderAllModules.ts              # Batch render all modules with presets
  
  gui/
    index.html                  # Main GUI entry with course management
    processing-wizard.html      # Step-by-step processing wizard
    slide-manager.html          # Slide-by-slide management
    app.js                      # GUI application logic
    wizard.js                   # Processing wizard logic
  
  courses.json                  # Course metadata with archive status
  gui-server.js                 # Express server for GUI API
  remotion.config.ts            # Remotion rendering configuration
```

---

## Installation

### Prerequisites

- Node.js 18+
- npm or pnpm
- FFmpeg (for audio conversion)

### Setup

```bash
# Install dependencies
npm install

# Create .env file with API keys
cp .env.example .env
# Edit .env with your API keys
```

### Required Environment Variables

```bash
# TTS Service (at least one required)
OPENAI_API_KEY=your-openai-key          # OpenAI TTS (also used for Whisper)
MINIMAX_API_KEY=your-minimax-key        # Minimax TTS (preferred)
RESEMBLE_API_KEY=your-runpod-api-key    # RunPod/Chatterbox TTS (or use RUNPOD_API_KEY)
RUNPOD_API_KEY=your-runpod-api-key      # Alternative alias for RESEMBLE_API_KEY
ELEVENLABS_API_KEY=your-elevenlabs-key   # ElevenLabs TTS

# Whisper API (for word timing extraction)
OPENAI_API_KEY=your-openai-key          # Same key used for both TTS and Whisper
# OR
WHISPER_API_KEY=your-whisper-api-key    # Alternative Whisper service
```

---

## Workflow

### Quick Start (GUI)

```bash
# Start the GUI server
npm run gui

# Open http://localhost:3001 in browser
# Use the AI Course Planner or Processing Wizard
```

### AI Course Planner

Generate complete course content from natural language:

```bash
# Simple prompt (CLI)
npm run plan-course -- "Create a course about Docker fundamentals for beginners"

# Structured input (CLI)
npm run plan-course -- --title "Docker Fundamentals" --topics "Installation,Commands,Dockerfiles" --modules 4

# Or use the GUI: Create Video -> AI Course Planner
```

The planner:
- Generates complete module and slide structure
- Respects 60-word limit per slide (25 seconds max audio)
- Outputs directly to `moduleContent.ts`
- Warns about scripts that may cause audio distortion

### Quick Start (CLI)

```bash
# 0. (Optional) Plan course with AI
npm run plan-course -- "Your course idea"

# 1. Generate module files from content
npm run generate-modules

# 2. Generate audio for all modules
npm run generate-audio-all

# 3. Measure audio durations
npm run measure-actual-audio

# 4. Extract word timings (optional, for code highlighting)
npm run extract-timings-from-content

# 5. Start Remotion Studio to preview
npm start

# 6. Render to MP4
npx remotion render src/index.tsx module-1 out/module-1.mp4
```

### Adding New Content

1. Edit `src/videos/moduleContent.ts`
2. Add a new `moduleXContent` export following the interface:

```typescript
export const module13Content: ModuleContent = {
  moduleNumber: 13,
  courseId: "your-course-id",  // Required: determines audio/video paths
  title: "Your Module Title",
  subtitle: "Module 13: Subtitle",
  slides: [
    {
      name: "title",
      type: "title",
      script: "Narration text for this slide...",
      subtitle: "Module 13: Subtitle"
    },
    {
      name: "concept1",
      type: "content-two-card",
      title: "Slide Title",
      script: "Narration for this slide...",
      points: ["Point 1", "Point 2", "Point 3"],
      imageSrc: "assets/icon.svg"
    },
    {
      name: "codeExample",
      type: "code",
      title: "Code Example",
      script: "Let me explain this code...",
      code: `const example = "hello";`,
      language: "typescript"
    }
  ]
};

// Add to allModules array at bottom of file
export const allModules: ModuleContent[] = [..., module13Content];
```

3. Run the workflow commands above

---

## Course Management

The system supports multiple courses/videos with an archive feature for organization.

### Course States

| State | Description |
|-------|-------------|
| `active` | Visible in all dropdowns, can be edited and processed |
| `archived` | Hidden from main UI, accessible in History section |

### Course Storage

Course metadata is stored in `courses.json`:

```json
{
  "courses": [
    {
      "id": "aws-pulumi",
      "title": "AWS Infrastructure as Code with Pulumi",
      "description": "Complete course on building AWS infrastructure",
      "moduleCount": 12,
      "status": "active",
      "archivedAt": null
    }
  ],
  "courseModuleMapping": {
    "aws-pulumi": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  }
}
```

### Archive Workflow

1. **Archive a course**: Click "Archive Video" button in the Segments view
2. **View archived courses**: Click "Archived Videos" in the navigation menu
3. **Restore a course**: Click "Restore" on any archived course

When all courses are archived, the UI shows a clean empty state with options to create or restore.

### Course Isolation (File Organization)

Each course has isolated directories for audio and video files to prevent conflicts:

```
public/audio/
  aws-pulumi/             # Audio files for aws-pulumi course
    module1-title.wav
    module1-intro.wav
    ...
  docker-fundamentals/    # Audio files for another course
    module1-title.wav     # No conflict with aws-pulumi!
    ...
  whoosh.wav              # Shared transition sound

out/
  aws-pulumi/             # Rendered videos for aws-pulumi
    module-1.mp4
    module-2.mp4
  docker-fundamentals/    # Rendered videos for another course
    module-1.mp4
```

This allows:
- **Reusable module numbers**: Different courses can use module 1, 2, 3... independently
- **No file overwrites**: Each course's audio/video files are isolated
- **Easy cleanup**: Delete a course's folder to remove all its files
- **Parallel development**: Work on multiple courses without conflicts

The `courseId` is stored in `moduleContent.ts` and used throughout the pipeline:

```typescript
export const module1Content: ModuleContent = {
  moduleNumber: 1,
  courseId: "docker-fundamentals",  // Determines audio/video paths
  title: "Getting Started with Docker",
  ...
};
```

---

## Batch Rendering

Render entire courses overnight with configurable quality presets.

### Render Presets

| Preset | Resolution | Speed | Use Case |
|--------|------------|-------|----------|
| `draft` | 540p, no audio | ~5x faster | Quick visual check |
| `fast` | 810p | ~2x faster | Review before final |
| `normal` | 1080p | Standard | Production (default) |
| `max` | 1080p, 8 threads | Best quality | Final delivery |

### CLI Commands

```bash
# Render entire course with default settings
npm run render:course

# Use a preset
npm run render:course:draft     # Quick preview
npm run render:course:fast      # Balanced
npm run render:course:max       # Best quality

# Custom options
npm run render:course -- --modules=1,2,3 --preset=fast
npm run render:course -- --scale=0.5 --concurrency=6 --quality=80
```

### GUI Batch Render

1. Go to Processing Wizard
2. Scroll to "Overnight Batch Rendering" section
3. Choose **Render on: Local** or **RunPod**
4. Click "Render Entire Course"
5. Leave running (Local: overnight; RunPod: ~10 min with GPU pod)

### Estimated Times (12 modules)

| Preset | Estimated Time |
|--------|----------------|
| draft | ~25 minutes |
| fast | ~1 hour |
| normal | ~2 hours |
| max | ~1.5 hours |

### RunPod Ephemeral Rendering

Render on RunPod CPU/GPU pods for faster, cloud-based rendering.

**Run GUI on RunPod (access via browser):**

```bash
npm run gui:runpod
```

This creates a pod with the GUI server, exposes port 3001, and prints the URL (e.g. `https://POD_ID-3001.proxy.runpod.net`). Open it in your browser. With RunPod selected (default), renders run on a separate GPU pod. Creates a pod, runs the batch render, downloads outputs, and destroys the pod.

**Prerequisites:**
- RunPod account and [API key](https://www.runpod.io/console/user/settings)
- SSH key added to [RunPod account settings](https://www.runpod.io/console/user/settings)
- For private GHCR: create RunPod container registry auth and set `RUNPOD_REGISTRY_AUTH_ID`

**Environment variables:**
- `RUNPOD_API_KEY` (required)
- `SLIDES_IMAGE` (required, e.g. `ghcr.io/owner/my-slides:latest`)
- `RUNPOD_REGISTRY_AUTH_ID` (optional, for private registry)
- `RUNPOD_SSH_KEY_PATH` (optional, default: `~/.ssh/id_ed25519`)
- `RUNPOD_DATA_CENTERS` (optional, e.g. `US-TX-1,EU-NL-1` to try regions with larger CPU pods)
- `RUNPOD_USE_GPU=true` (optional, use GPU pod for 9+ vCPU and 16GB+ RAM; ~$0.60+/hr)
- `RUNPOD_MIN_VCPU=9` (optional, min vCPUs for GPU pods; default 9)
- `RUNPOD_CONCURRENCY=28` (optional, render threads; default 28 for GPU to use all vCPUs)
- `RUNPOD_SCALE=0.75` (optional, 0.75=810p faster, 0.5=540p fastest)
- `RUNPOD_MIN_VCPU=16` (optional, 16=cheaper pod, 24=more power)

**Usage:**
```bash
# Use existing image (must be built and pushed first)
SLIDES_IMAGE=ghcr.io/owner/my-slides:latest npm run render:runpod

# Build and push image, then render (for local changes)
SLIDES_IMAGE=ghcr.io/owner/my-slides:latest npm run render:runpod -- --build

# With preset and modules
npm run render:runpod -- --preset=fast --modules=1,2,3

# Keep pod after render (for debugging)
npm run render:runpod -- --no-destroy
```

---

## Configuration

### Slide Types

| Type | Description | Required Fields |
|------|-------------|-----------------|
| `title` | Module title slide | `name`, `script`, `subtitle` |
| `content-two-card` | Content with image | `name`, `script`, `title`, `points`, `imageSrc` |
| `content-single` | Content without image | `name`, `script`, `title`, `points` |
| `code` | Code with syntax highlighting | `name`, `script`, `title`, `code`, `language` |
| `code-diagram` | Code with architecture diagram | `name`, `script`, `title`, `code`, `scene` |
| `comparison` | Two-column comparison | `name`, `script`, `title`, `leftTitle`, `leftItems`, `rightTitle`, `rightItems` |
| `sequential-bullet` | Sequential bullet points (one at a time) | `name`, `script`, `title`, `points` |
| `svg-content` | Content with full SVG on right | `name`, `script`, `title`, `points`, `svgPath` |
| `svg-sequential` | Sequential bullets with SVG on right | `name`, `script`, `title`, `points`, `svgPath` |

### TTS Voice Selection

TTS provider is user-selectable with Minimax as the preferred/default option. When a provider is specified, it uses ONLY that provider (no fallback) to maintain voice consistency across all audio files.

**Available Providers:**
- **Minimax** (preferred) - Supports cloned voices and custom voice models
- **OpenAI** - Reliable TTS with multiple voice options
- **RunPod** - Faster, cheaper option via Chatterbox
- **ElevenLabs** - High-quality voice synthesis

**Configuration:**
- Set provider via `voice-settings.json` (default: `minimax`)
- Override via CLI: `npm run generate-audio -- 1 andy minimax` (module, voice, provider)
- GUI: Select provider in Processing Wizard before generating audio

**Note:** Automatic fallback chain only occurs when no provider is explicitly specified (legacy behavior). For voice consistency, always specify a provider.

---

## Scripts Reference

### AI Planning

| Script | Command | Description |
|--------|---------|-------------|
| Plan Course | `npm run plan-course -- "prompt"` | Generate course from natural language |
| Plan (Structured) | `npm run plan-course -- --title "X" --topics "a,b,c"` | Generate with specific parameters |
| Plan (Preview) | `npm run plan-course -- "prompt" --preview` | Preview without saving |

### Content Generation

| Script | Command | Description |
|--------|---------|-------------|
| Generate Modules | `npm run generate-modules` | Create Module{N}.tsx from moduleContent.ts |
| Generate Audio | `npm run generate-audio-all` | Generate TTS audio for all slides |
| Generate Audio (single) | `npm run generate-audio-module -- 1` | Generate audio for module 1 only |
| Generate & Measure | `npm run generate-and-measure` | Generate audio and measure durations in one step |
| Measure Audio | `npm run measure-actual-audio` | Update audioDuration.ts with real durations |
| Measure & Update | `npm run measure-and-update` | Measure audio and update duration file |
| Extract Timings | `npm run extract-timings-from-content` | Extract word-level timings via Whisper |
| Activate Course | `npm run activate-course` | Activate course from JSON content files |
| Extract Source Code | `npm run extract-source-code` | Extract code examples from content |
| Generate Runnable Code | `npm run generate-runnable-code` | Generate executable code from examples |

### Validation

| Script | Command | Description |
|--------|---------|-------------|
| Validate Content | `npm run validate-content` | Check for missing slide properties |
| Validate Audio | `npm run validate-audio` | Check audio files and convert formats |
| Run Tests | `npm test` | Run module content validation tests |

### Development

| Script | Command | Description |
|--------|---------|-------------|
| Start Studio | `npm start` | Launch Remotion Studio at localhost:3000 |
| Start GUI | `npm run gui` | Launch GUI server at localhost:3001 |
| Clean Cache | `npm run clean-cache` | Clear Remotion cache files |
| Ensure Browser | `npm run ensure-browser` | Install Remotion's bundled Chromium |

### Rendering

| Script | Command | Description |
|--------|---------|-------------|
| Render Module | `npm run render:module` | Render module-1 to out/module-1.mp4 |
| Render Draft | `npm run render:draft` | Quick preview render (540p, no audio) |
| Render Fast | `npm run render:fast` | Balanced speed/quality render |
| Render Max | `npm run render:max` | Maximum quality render |
| Render Course | `npm run render:course` | Batch render all modules |
| Render Course Draft | `npm run render:course:draft` | Batch render with draft preset |
| Render Course Fast | `npm run render:course:fast` | Batch render with fast preset |
| Render Course Max | `npm run render:course:max` | Batch render with max preset |
| Render RunPod | `npm run render:runpod` | Ephemeral render on RunPod CPU pod |

---

## GUI Server

The GUI server (`gui-server.js`) provides a web interface for managing the video creation workflow.

### AI Planner Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/plan-course` | POST | Generate course plan via GPT-4 |
| `/api/save-plan` | POST | Save generated plan to moduleContent.ts |

Request body for `/api/plan-course`:
```json
{
  "prompt": "Simple natural language prompt",
  // OR structured:
  "title": "Course Title",
  "description": "Course description",
  "targetAudience": "Beginners",
  "keyTopics": ["Topic 1", "Topic 2"],
  "moduleCount": 4
}
```

### Course Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/courses` | GET | List active courses (default) |
| `/api/courses?status=archived` | GET | List archived courses |
| `/api/courses?status=all` | GET | List all courses |
| `/api/courses` | POST | Create a new course |
| `/api/courses/:id/archive` | POST | Archive a course |
| `/api/courses/:id/restore` | POST | Restore an archived course |

### Module Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/modules?course=X` | GET | List modules for a course |
| `/api/modules/:num` | GET | Get module details |
| `/api/generate-modules` | POST | Generate module files |
| `/api/generate-audio` | POST | Generate audio files |
| `/api/measure-audio` | POST | Measure audio durations |
| `/api/extract-timings` | POST | Extract word timings (SSE) |
| `/api/workflow-status` | GET | Get overall workflow status |
| `/api/upload-audio` | POST | Upload custom audio for a slide |
| `/api/diagnose` | GET | Diagnose module issues |

### Rendering Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/render-video` | POST | Render single module (SSE progress) |
| `/api/render-course` | POST | Batch render all modules (SSE progress) |
| `/api/download-video` | GET | Download rendered video |

### GUI Features

- Course management with archive/restore
- Module list with step completion status
- Processing wizard with progress streaming
- Slide-level status (audio, timings, video)
- Audio file upload for manual recordings
- Video rendering with progress (single or batch)
- Clean empty state when no active courses

---

## Known Issues

### Resolved

1. **Video rendering via GUI** - FIXED
   - Added `@remotion/renderer` package and `remotion.config.ts`
   - Run `npm run ensure-browser` if issues persist

2. **Highlight timing misalignment** - FIXED
   - Reduced `entranceTime` delays in all slide components
   - Highlights now sync properly with audio playback

### Moderate

3. **GUI module saving is incomplete**
   - The old save endpoint returns placeholder success
   - **Workaround**: Edit `moduleContent.ts` directly

4. **Audio duration fallback removed**
   - `audioDuration.ts` throws error if duration not found
   - New modules require running `npm run measure-actual-audio` before preview
   - **Impact**: Remotion will crash on unmeasured modules

5. **Whisper API rate limits**
   - Word timing extraction is slow (1-3 minutes per slide)
   - Large courses can take hours to process
   - No resume capability for interrupted extractions

6. **TTS service dependency**
   - Requires external API keys (RunPod, Minimax, or ElevenLabs) for automated generation
   - Rate limits apply based on provider
   - **Workaround**: Upload custom audio via GUI (`/api/upload-audio` endpoint)

7. **Rendering is CPU-bound**
   - Remotion uses browser screenshots, not GPU acceleration
   - Performance scales with CPU cores, not GPU
   - **Optimization**: Use render presets (`draft`, `fast`) for quicker iteration

### Normal

8. **Font rendering variations**
   - Code slides use system fonts which may vary by platform
   - No custom font embedding implemented

9. **Module file variable naming**
   - Slide names with hyphens (e.g., "slide-2") cause variable name issues
   - Generator converts to camelCase but edge cases may fail
   - **Workaround**: Use camelCase names in moduleContent.ts

10. **Cached Whisper responses**
    - Stored in `public/whisper-cache/` per slide
    - Old cache not automatically invalidated on script changes
    - **Workaround**: Delete cache file to regenerate timings

11. **Audio format handling**
    - Some TTS services return MP3 disguised as WAV
    - `validateAndConvertAudio.ts` fixes this but must be run manually
    - **Workaround**: Run `npm run validate-audio` after generation

---

## Development Notes

### Debugging Remotion Issues

```bash
# Run diagnostics for a specific module
curl http://localhost:3001/api/diagnose?moduleNumber=1

# Check module status
curl http://localhost:3001/api/module-status?moduleNumber=1
```

### Common Error Fixes

```bash
# "TimeoutError: Timed out while trying to connect to the browser"
# This affects CLI rendering only - Remotion Studio (npm start) still works
# Option 1: Use Remotion Studio UI to render instead of CLI
npm start
# Then click "Render" in the Studio UI

# Option 2: Install Remotion's bundled Chromium
npx @remotion/renderer ensure-chromium

# Option 3: Set Chrome path manually (Windows example)
set PUPPETEER_EXECUTABLE_PATH=C:\Program Files\Google\Chrome\Application\chrome.exe
npx remotion render src/index.tsx module-1 out/module-1.mp4

# "Audio duration not found"
npm run measure-actual-audio

# "Module not found in Root.tsx"
npm run generate-modules

# Corrupted audio files
npm run validate-audio
```

### Performance Tips

- Generate audio in batches (e.g., `npm run generate-audio -- 1-3`)
- Use `--force` flag sparingly (regenerates existing files)
- Run Remotion Studio in development mode for faster preview
- Use `render:draft` preset for quick visual checks
- Batch rendering overnight with `npm run render:course`
- Increase concurrency for faster renders: `--concurrency=6`
- `remotion.config.ts` uses 75% of CPU cores by default

---

## License

ISC

---

## Contributing

1. Keep all content in `moduleContent.ts` - never edit generated files
2. Run `npm run validate-content` before committing
3. Test with `npm start` before rendering final videos
