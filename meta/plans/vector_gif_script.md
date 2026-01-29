---
SECTION_ID: plans.vector_gif_script
TYPE: plan
STATUS: completed
PRIORITY: high
---

# Vector GIF Generator Script

GOAL: Create a Python script to generate vector-style loading animations and icons as GIFs, matching the reference image.

## Requirements
- [x] Clean vector-like rendering (high contrast, sharp edges).
- [x] Multiple animation types:
    - [x] Circle (Spinners)
    - [x] Dots (Pulse/Wave)
    - [x] Fade Circles (Opacity sequence)
    - [x] Ball (Bounce/Path)
    - [x] Time (Clock hands)
    - [x] Wifi (Signal bars)
- [x] Configurable colors (Default: White on Black/Dark Grey).
- [x] Output: Optimized GIF files.

## Technical Approach
- Language: Python
- Libraries: `Pillow` (for drawing), `moviepy` (for animation/GIF export).
- Note: Switched from `gizeh` to `Pillow` to avoid system dependency issues (Cairo).
- Structure:
    - Base `Animation` class.
    - Subclasses for each type.
    - Command line interface (CLI) to generate all or specific types.

## Tasks
- [x] Create `scripts/generate_vector_gifs.py` skeleton.
- [x] Implement `Spinner` animations.
- [x] Implement `Dots` animations.
- [x] Implement `Wifi/Icons` animations.
- [x] Test generation.
