# Learning Time Tracker

A premium, production-grade learning discipline tracker built with React, TypeScript, Vite, Tailwind CSS, Zustand, and Dexie (IndexedDB).

## Getting started

```bash
npm install
npm run dev
```

Open the printed local URL (usually `http://localhost:5173`). All data is stored locally in your browser via IndexedDB — nothing leaves your machine.

To build for production:

```bash
npm run build
npm run preview
```

## What's implemented

- **Dashboard** — live timer ring, today's progress, remaining time, productivity score, streaks, weekly/monthly hours, quick-start buttons, timeline, and per-category/subtask timers.
- **Timer system** — start/pause/resume/stop, only one timer runs at a time (starting another auto-finalizes the previous one), and the timer survives page refresh because elapsed time is derived from real timestamps persisted in IndexedDB.
- **Auto session logging** — every stopped timer writes a searchable session record (date, category, subtask, start/end, duration, notes).
- **Categories & subtasks** — the four categories and their subtasks from the spec are seeded on first run, and every target is editable in Settings.
- **Calendar** — month grid color-coded by completion (green/yellow/red) with a day-detail view.
- **Statistics** — daily hours, learning distribution, exercise trend, streaks, longest session, most/least productive day, and a GitHub-style heatmap.
- **Productivity score** — a transparent 0–100 formula combining goal completion, exercise, 7-day consistency, streak, missed-session penalty, and late-start penalty.
- **Achievements** — 7/30-day streaks, 100 hours learned, Interview Master, Learning Beast.
- **Reports** — daily/weekly/monthly reports with category breakdowns and generated suggestions, exportable to PDF.
- **Export/Import** — CSV, Excel (.xlsx), full JSON backup, and JSON restore.
- **Notifications** — browser notifications for exercise/interview revision times, interval-based water/stretch reminders, and now an **alarm (chime + notification) when a running timer hits its target duration**, plus a fanfare + notification when the daily goal is completed. All toggleable in Settings.
- **Theming** — light/dark mode with CSS-variable design tokens.
- **Confetti** — celebrates when the daily learning goal is completed.

## Architecture

```
src/
  components/   Reusable UI primitives (Button, Card, ProgressBar, ProgressRing, Dialog, ...) + layout shell
  features/     Feature-scoped components grouped by domain (dashboard, calendar, statistics, reports, settings, achievements)
  pages/        Route-level screens that compose feature components
  hooks/        Cross-cutting hooks (live Dexie queries, ticking clock, notification scheduler)
  store/        Zustand stores (timer, settings) — the only global mutable state
  services/     Framework-free business logic: db schema, analytics/aggregation, reports, achievements, export, notifications
  utils/        Small pure helpers (time formatting, class merging, icon resolution, confetti)
  types/        Shared TypeScript domain types
```

Data flows one way: Dexie is the source of truth → `dexie-react-hooks`' `useLiveQuery` subscribes components directly to the database → Zustand only holds the two pieces of truly global, high-frequency state (the active timer and app settings) and mirrors every change back into Dexie so a page refresh never loses data.

This separation (services have no React imports; features never touch Dexie directly except through hooks) is what makes it straightforward to bolt on the future features already scaffolded for: AI insights, Google Calendar sync, cloud backup, Pomodoro mode, and so on — they're new services + a new feature folder, not a rewrite.

## Notes & honest caveats

- UI primitives (`Button`, `Card`, `Dialog`, etc.) are hand-built in the shadcn/ui *style* (Radix primitives + Tailwind) rather than generated via the shadcn CLI, so there's no `components.json` — behavior and composition patterns match, but you won't find the CLI's exact generated files.
- PDF export covers generated reports (daily/weekly/monthly); CSV/Excel/JSON cover full session history and backups.
- Notification timing checks run every 15 seconds while the tab is open — like all web push without a service worker, they won't fire if the tab/browser is fully closed.
