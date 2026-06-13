# Course Specs: Agentic AI for Beginners

This folder contains module specifications for the "Agentic AI for Beginners" course, targeting NVIDIA certification preparation.

## Pipeline Overview

```
Stage 1: Generate narration scripts (plain text)
Stage 2: Convert to SSML with voice markers
Stage 3: Generate diagrams (SVG)
Stage 4: Build Remotion scenes
Stage 5: Export MP4
Stage 6: Repurpose outputs
```

## Configuration Summary

| Setting | Value | Description |
|---------|-------|-------------|
| Voice Spec | Hybrid | V2 for cinematic intros, V1 for instructional body |
| Positioning | P4 | Target audience positioning |
| Repurpose Strategy | R-A | Output format strategy |
| Mode | M1-B | Pipeline execution mode |
| Mode | Checkpoint | Enables stage checkpoints |

## Module Spec Format

Each module YAML follows this structure:

```yaml
id: moduleXX
title: Module Title
runtime_target: 15m
script_length: 1400-1800 words
layout: cinematic_intro -> concept -> architecture -> application -> exam_mapping -> recap
voice: Hybrid
ssml_required: yes
deliverables:
  - narration_script
  - narration_ssml
  - diagrams_svg
  - remotion_scenes
  - mp4_export
  - repurposed_outputs

concept_scope:
  - key concepts to cover

architecture_scope:
  - technical/structural elements

application_scope:
  - real-world applications

role_signaling:
  engineers:
    - technical perspective points
  technical_leaders:
    - business/strategic perspective points

exam_mapping:
  - certification alignment points

required_diagrams:
  - diagram-name.svg

recap_keypoints:
  - key takeaway 1
  - key takeaway 2
```

## Modules

| Module | Title | Runtime | Script Length |
|--------|-------|---------|---------------|
| 01 | The Agentic AI Transition | 12-15m | 1000-1500 words |
| 02 | Agent Fundamentals | 15m | 1400-1800 words |
| 03 | NVIDIA AI Platform Stack | 15m | 1400-1800 words |
| 04 | Workloads & Inference Pipelines | 15m | 1400-1800 words |
| 05 | Deployment & Integration Models | 15m | 1400-1800 words |
| 06 | Enterprise & Industry Use Cases | 15m | 1400-1800 words |

**Total runtime:** ~87-90 minutes

## Layout Sections

Each module follows a consistent 6-section layout:

1. **cinematic_intro** - V2 voice, sets the tone
2. **concept** - Core definitions and ideas
3. **architecture** - Technical/structural breakdown
4. **application** - Real-world use and enterprise context
5. **exam_mapping** - Certification alignment
6. **recap** - Key takeaways

## Role Signaling

Modules address two audience types:

- **Engineers**: Focus on latency, throughput, scaling, integration complexity
- **Technical Leaders**: Focus on ROI, risk, compliance, adoption, vendor relationships

## Required Diagrams (Total: 18)

### Module 01
- direct-prompting-vs-agentic.svg
- agentic-architecture-high-level.svg
- enterprise-adoption-drivers.svg

### Module 02
- agent-vs-singlecall.svg
- agent-components.svg
- agent-loop-pattern.svg
- agent-roles-grid.svg

### Module 03
- nvidia-ai-stack-overview.svg
- inference-pipeline.svg
- deployment-surfaces.svg
- role-perspective-grid.svg

### Module 04
- inference-pipeline-full.svg
- workload-matrix.svg
- pipeline-constraints-triangle.svg

### Module 05
- deployment-decision-matrix.svg
- integration-surfaces.svg
- ops-lifecycle.svg

### Module 06
- industry-usecase-grid.svg
- adoption-curve.svg
- value-driver-spider.svg

## Current Stage

**Next Action:** Run Stage 1 for Modules 01-06 using the Global Spec and Module Specs. Generate narration scripts only (no SSML conversion yet).
