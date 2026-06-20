# AI Video Animation — Overleaf documentation

Engineering reference (Part I) and operations guide (Part II) for the Skilleo AI platform.

## Overleaf upload

1. Create a new Overleaf project.
2. Upload the entire `ProductionStacks/` folder contents:
   - `main.tex` (main document)
   - `scinexus.cls`
   - `mermaid.sty`
   - `logo.png`
   - `diagrams/` (Mermaid sources + `tikz-figures.tex`)
   - `references.bib` (optional)
3. Set **Main document** to `main.tex`.
4. Compiler: **pdfLaTeX** (default).

No shell-escape required. Diagrams render via TikZ in `diagrams/tikz-figures.tex`.

## Edit diagrams

| File | Content |
|------|---------|
| `diagrams/01–07` | Usage / ops flows |
| `diagrams/08–10` | Engineering (layers, activate, render sequence) |
| `diagrams/tikz-figures.tex` | PDF figures used by `main.tex` |

When you change a `.mmd` file, update the matching TikZ macro in `tikz-figures.tex` for Overleaf, or export PNG and use `\mermaidfigure{caption}{0.9}{figures/name.png}` from `mermaid.sty`.

Optional PNG export:

```bash
cd ProductionStacks
npx @mermaid-js/mermaid-cli -i diagrams/01-system-architecture.mmd -o figures/01-system-architecture.png
```

## Reproduce the live system

See **Part II** in `main.tex` (Reproduce on a Fresh Server) or the repository root `README.md` and `start.sh`.

Quick path:

```bash
git clone git@github.com:f2ka07/AI-video-animation.git
cd AI-video-animation
cp .env.example .env   # edit secrets
INSTALL_DOCKER=1 ./start.sh
```

Open `http://<server>:3001` → Video Processing → Render Entire Course (Local).
