# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # Dev server on port 3000
npm run build      # Production build to ./out (mode: GENERIC)
npm run lint       # ESLint on all TS/TSX files
npm run deploy     # Deploy to Firebase (hosting + Firestore rules/indexes)
```

There are no tests configured in this project.

## Architecture

**Stitcher** is a cross-stitch pattern editor built with React + Redux + Firebase + Konva (canvas).

### Routing & Layouts

Two main routes (`src/routes/`):
- `/` — Overview (workspace list)
- `/:workspaceid` — Workspace editor (canvas)

Both wrapped in `MainLayout`. Route setup is in `src/routes/index.tsx`.

### Provider Hierarchy

Three-tier provider pattern (`src/store/providers.tsx`):
1. **StoreProvider** — Redux + Firebase Auth guard
2. **OverviewProvider** — Loads user profile and workspace list
3. **WorkspaceProvider** — Loads stitches and brushes for active workspace

### State Management

Redux Toolkit slices in `src/store/slices/`:
- `auth-slice` — Firebase auth state
- `profile-slice` — User profile
- `workspace-slice` — Workspace metadata
- `stitch-slice` — All stitches in current workspace (normalized: `byId`)
- `brush-slice` — Brushes/drawing tools (normalized: `byId`)
- `dialog-slice` — Modal state

Custom hooks in `src/store/hooks/` expose typed selectors and action dispatchers. Always use these hooks rather than accessing the store directly.

### Firebase Integration

`src/store/firebase/` — Firebase setup and Firestore utilities. Real-time listeners (e.g., `useBrushListener`, `useStitchListener`) are activated by providers and sync data into Redux. Firestore security rules are in `firestore.rules`; ownership is enforced via an `owners` array on each document.

### Canvas

`src/components/canvas/` — Konva.js canvas with React-Konva. Stitches from Redux are rendered as Konva shapes. Handles zoom, pan, and grid overlay. `src/components/cell/` renders individual stitch cells; `src/components/grid/` renders the grid layer.

### Core Data Models (`src/shared/types.ts`)

```typescript
Workspace { id, name, size, thumbnail, owners[], created, updated }
Brush     { id, shape: Shape, color: string }
Stitch    { id, x, y, brush: string }  // brush is a Brush id
Shape     = 'cross' | 'circle' | 'square' | 'disc'
```

### Path Aliases (tsconfig)

```
@components/*  →  src/components/*
@store         →  src/store
@shared/*      →  src/shared/*
@utils/*       →  src/utils/*
@layouts       →  src/layouts
@routes        →  src/routes
```

### Code Style

- Prettier: single quotes, 120 char line width
- ESLint flat config (v9) with TypeScript ESLint + React plugin
- Styled Components for component-scoped CSS
