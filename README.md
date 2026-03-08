# Stitcher

**[stitcher.oakie.se](https://stitcher.oakie.se/)**

A web-based cross-stitch pattern editor. Create and manage patterns on a zoomable canvas, build a palette of brushes with different shapes and colors, and share workspaces with other users.

## Features

- **Canvas editor** — draw on a zoomable, pannable grid using mouse or touch
- **Brushes** — create multiple brushes, each with an independent color and shape (cross, circle, square, disc)
- **Eraser** — remove stitches by switching to the eraser tool
- **Workspaces** — organize patterns into named workspaces
- **Sharing** — share a workspace with other users by searching for them by name
- **Real-time sync** — changes are synced live via Firebase Firestore

## Getting started

Sign in with a Google account. No other authentication method is currently supported.

## Development

**Prerequisites:** Node.js, a Firebase project with Firestore and Google Auth enabled.

Copy `.env.development` and fill in your Firebase project config:

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

```bash
npm install
npm start        # dev server at http://localhost:3000
npm run build    # production build → ./out
npm run lint     # ESLint
```

## Tech stack

- React 19, Redux Toolkit, React Router 7
- Konva (canvas rendering)
- Firebase (auth + Firestore)
- Vite, TypeScript, Styled Components
