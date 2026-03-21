# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SKS-Web is a React 19 single-page application built with Vite 7. JavaScript with JSX (not TypeScript). Plain CSS for styling.

## Commands

- `npm run dev` — Start development server with HMR
- `npm run build` — Production build (output to `dist/`)
- `npm run preview` — Preview production build locally
- `npm run lint` — Run ESLint

## Architecture

- **Entry point:** `index.html` → `src/main.jsx` → `src/App.jsx`
- **Build tool:** Vite with `@vitejs/plugin-react` (Babel-based)
- **Module system:** ES modules (`"type": "module"`)
- **ESLint:** Flat config format (`eslint.config.js`) with React Hooks and React Refresh plugins
