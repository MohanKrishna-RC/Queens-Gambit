# Repository Guidelines

## Project Structure & Module Organization

This repository is a lightweight browser chess extension with no build system. `game.html`, `game.css`, and `game.js` implement the interface and gameplay; `chess-engine.js` contains the DOM-independent chess rules engine; `background.js` and `manifest.json` define extension behavior. PNG extension icons are in `icons/`, and `generate_icons.py` recreates them. Keep new assets alongside the related files and update manifest paths when adding extension resources.

## Build, Test, and Development Commands

There is no package manager, compile step, or configured test runner. For local UI work, serve the directory with `python3 -m http.server 8000` and open `http://localhost:8000/game.html`. To try extension behavior, load the repository directory as an unpacked extension in a Chromium-based browser. Regenerate icons with `python3 generate_icons.py` (requires Pillow). The engine is also loadable in Node for ad hoc checks, for example `node -e "const e=require('./chess-engine.js'); console.log(e.newState().turn)"`.

## Coding Style & Naming Conventions

Use two spaces for indentation in JavaScript, HTML, and CSS. Keep JavaScript in strict mode and use `const` by default, `let` for reassigned state, camelCase for functions and variables, and descriptive kebab-case for CSS classes and IDs. Preserve the engine's separation from browser DOM code. Python uses four-space indentation and standard snake_case names. No formatter or linter is configured; match the surrounding file style.

## Testing Guidelines

No automated test suite or coverage requirement is currently configured. For gameplay changes, manually verify legal moves, captures, castling, promotion, check and game-end states, undo, and both player modes as applicable. Check the browser console for errors. For engine-only changes, exercise representative positions and edge cases through Node or add a focused test script if a test framework is introduced.

## Commit & Pull Request Guidelines

Git history is unavailable in this checkout, so no repository-specific commit convention could be confirmed. Use a short imperative commit subject that describes the change (for example, `Fix pawn promotion selection`). Pull requests should summarize behavior changes, list manual checks performed, link related issues when available, and include screenshots for visible UI changes.

## Security & Configuration

Keep the extension self-contained and avoid adding remote scripts or unnecessary permissions. When changing extension entry points or assets, ensure `manifest.json` references valid local paths and verify the unpacked extension loads successfully.
