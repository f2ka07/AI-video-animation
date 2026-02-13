#!/bin/bash
# Master script to generate full course from content
# Run on GPU server: bash scripts/generateFullCourse.sh [module-range]
# 
# Examples:
#   bash scripts/generateFullCourse.sh 1        # Module 1 only
#   bash scripts/generateFullCourse.sh 1-3     # Modules 1, 2, 3
#   bash scripts/generateFullCourse.sh 1,3,5  # Modules 1, 3, 5
#   bash scripts/generateFullCourse.sh all     # All modules (default)
# 
# PREREQUISITE: Edit src/videos/moduleContent.ts with your content
# Then run this script - everything else is automated!

set -e  # Exit on error

MODULE_RANGE=${1:-"all"}

echo "=========================================="
echo "Full Course Generation Pipeline"
echo "Module Range: $MODULE_RANGE"
echo "=========================================="
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found"
    echo "   Please create .env with your API keys"
    exit 1
fi

# Check if moduleContent.ts exists
if [ ! -f src/videos/moduleContent.ts ]; then
    echo "❌ Error: src/videos/moduleContent.ts not found"
    echo "   Please create moduleContent.ts with your content"
    exit 1
fi

# Step 1: Generate audio for specified modules
# Modules depend on audioDuration.ts, so audio must be generated first
# NOTE: Existing audio files are NOT regenerated to avoid costs
echo "Step 1: Generating audio files from content..."
echo "  (Existing audio files will be skipped to avoid regeneration costs)"
npx tsx scripts/generateAudioFromContent.ts "$MODULE_RANGE"

# Step 2: Measure audio durations
# This creates audioDuration.ts which modules require
echo ""
echo "Step 2: Measuring audio durations..."
npm run measure-actual-audio

# Step 3: Generate Remotion composition files (FINAL STEP)
# This creates ModuleX.tsx and ModuleXConfig.ts - the Remotion files needed for rendering
# Modules use getAudioDuration() which requires Step 2 to be complete
echo ""
echo "Step 3: Generating Remotion composition files (ModuleX.tsx, ModuleXConfig.ts)..."
echo "  (This is the final step - creates files needed for video rendering)"
npx tsx scripts/generateModulesFromContent.ts "$MODULE_RANGE"

# Step 4: Extract word timings (optional, for animations)
echo ""
echo "Step 4: Extracting word timings..."
if command -v docker &> /dev/null; then
    # Use npm script which handles platform detection
    npm run gentle-check || echo "⚠ Gentle not available, skipping word timings"
    sleep 3  # Wait for Gentle to be ready
    npx tsx scripts/extractWordTimingsFromContent.ts "$MODULE_RANGE" || echo "⚠ Word timing extraction skipped"
    
    # Step 4a: Fix any syntax errors or duplicates in wordTimings.ts
    echo ""
    echo "Step 4a: Cleaning up wordTimings.ts..."
    npx tsx scripts/fixWordTimingsFile.ts || echo "⚠ Cleanup skipped"
    
    # Step 4b: Generate line mappings for code slides
    echo ""
    echo "Step 4b: Generating line mappings for code slides..."
    npx tsx scripts/generateLineMappingsFromContent.ts "$MODULE_RANGE" || echo "⚠ Line mapping generation skipped"
    
    # Step 4c: Fix any syntax errors in line mappings
    echo ""
    echo "Step 4c: Cleaning up line mappings..."
    npx tsx scripts/fixWordTimingsFile.ts || echo "⚠ Cleanup skipped"
else
    echo "  ⚠ Docker not available, skipping word timings"
fi

# Step 5: Render videos (if Remotion CLI is available)
echo ""
echo "Step 5: Rendering videos..."
if command -v npx &> /dev/null; then
    # Parse module range for rendering
    if [ "$MODULE_RANGE" = "all" ]; then
        MODULES_TO_RENDER="1 2 3 4 5 6 7"
    elif [[ "$MODULE_RANGE" == *"-"* ]]; then
        # Range like "1-3"
        START=$(echo "$MODULE_RANGE" | cut -d'-' -f1)
        END=$(echo "$MODULE_RANGE" | cut -d'-' -f2)
        MODULES_TO_RENDER=$(seq $START $END)
    elif [[ "$MODULE_RANGE" == *","* ]]; then
        # Comma-separated like "1,3,5"
        MODULES_TO_RENDER=$(echo "$MODULE_RANGE" | tr ',' ' ')
    else
        # Single number
        MODULES_TO_RENDER="$MODULE_RANGE"
    fi
    
    for module in $MODULES_TO_RENDER; do
        if [ -f "src/videos/Module${module}.tsx" ]; then
            echo "  Rendering Module ${module}..."
            npx remotion render src/index.tsx module-${module} out/module-${module}.mp4 || echo "  ⚠ Module ${module} render failed"
        fi
    done
else
    echo "  ⚠ Remotion CLI not available, skipping video rendering"
fi

echo ""
echo "=========================================="
echo "✅ Course generation complete!"
echo "=========================================="
echo ""
echo "Generated files:"
echo "  - Audio: public/audio/module*.wav"
echo "  - Videos: out/module*.mp4 (if rendering succeeded)"
echo "  - Config: src/utils/audioDuration.ts"
echo "  - Timings: src/utils/wordTimings.ts"
