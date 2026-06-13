# Video Module Structure

This directory contains video compositions for the Pulumi Udemy course. Each module follows a consistent structure for scalability.

## Creating a New Module

1. **Copy the template pattern from Module1.tsx**
   - Use the Sequence components to build your video
   - Follow the timing pattern (8s content slides, 1s transitions)

2. **Create a config file** (e.g., `Module2Config.ts`)
   - Define module metadata
   - Set consistent FPS, dimensions, and timing

3. **Add to Root.tsx**
   - Import your module component
   - Add a Composition entry
   - Calculate duration using `calculateVideoDuration` utility

## Module Structure

Each module should include:
- **Title slide** - Module name and number
- **Content slides** - Key concepts with bullet points
- **Code slides** - Examples demonstrating concepts
- **Comparison slides** - When comparing tools/approaches
- **Transition slides** - Between major sections
- **Summary slide** - Recap of module content

## Timing Guidelines

- Content slides: 8 seconds (allows reading and comprehension)
- Code slides: 8-12 seconds (longer for complex examples)
- Comparison slides: 10-12 seconds (more content to read)
- Transitions: 1 second (quick visual break)
- Title slide: 8 seconds

## Target Runtime

Each module should be 6-12 minutes as specified in PROJECT.md:
- Module 1: ~6-8 minutes
- Module 2: ~6 minutes
- Module 3: ~10 minutes
- Module 4: ~10 minutes
- Module 5: ~8 minutes
- Module 6: ~8 minutes
- Module 7: ~4 minutes

## Rendering

To render a module video:
```bash
npx remotion render src/index.tsx module-1 out/module-1.mp4
```

Replace `module-1` with the composition ID from your config file.
