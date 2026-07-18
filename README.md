## Project Structure

```text
src/
├── App.tsx
├── index.css
├── main.tsx
├── README.md
│
├── assets/
│   └── illustrations/
│       └── completed-tasks.svg
│
├── components/
│   ├── Badge.tsx
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── ConfirmDialog.tsx
│   ├── EmptyState.tsx
│   ├── index.ts
│   ├── Input.tsx
│   ├── LanguageToggle.tsx
│   ├── Modal.tsx
│   ├── Select.tsx
│   ├── Skeleton.tsx
│   ├── Textarea.tsx
│   ├── Toast.tsx
│   └── ToastContainer.tsx
│
├── constants/
│   ├── project.constants.ts
│   └── task.constants.ts
│
├── features/
│   ├── auth/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── LoginPage.tsx
│   │   │   └── RegisterPage.tsx
│   │   └── schemas/
│   │       ├── login.schema.ts
│   │       └── register.schema.ts
│   │
│   ├── projects/
│   │   ├── components/
│   │   │   ├── ProjectCard.tsx
│   │   │   └── ProjectFormModal.tsx
│   │   ├── pages/
│   │   │   └── DashboardPage.tsx
│   │   └── schemas/
│   │       └── project.schema.ts
│   │
│   └── tasks/
│       ├── components/
│       │   ├── KanbanBoard.tsx
│       │   ├── KanbanColumn.tsx
│       │   ├── KanbanTaskCard.tsx
│       │   ├── TaskFormModal.tsx
│       │   └── TaskListItem.tsx
│       ├── pages/
│       │   └── ProjectDetailPage.tsx
│       └── schemas/
│           └── task.schema.ts
│
├── i18n/
│   ├── config.ts
│   └── locales/
│       ├── ar.json
│       └── en.json
│
├── layouts/
│   ├── AuthLayout.tsx
│   └── DashboardLayout.tsx
│
├── routes/
│   ├── AppRouter.tsx
│   └── ProtectedRoute.tsx
│
├── services/
│   ├── auth.service.ts
│   ├── project.service.ts
│   └── task.service.ts
│
├── stores/
│   ├── auth.store.ts
│   ├── project.store.ts
│   ├── task.store.ts
│   └── toast.store.ts
│
├── types/
│   ├── auth.types.ts
│   ├── project.types.ts
│   └── task.types.ts
│
└── utils/
```  

# TaskNest

A bilingual (English / Arabic) personal task & project tracker, built as a Senior Front-End Engineer take-home assessment for Kenrtick.AI.

## Overview

TaskNest lets an authenticated user manage a list of **Projects**, and within each project, a list of **Tasks**. It supports full CRUD for both, a List and Kanban (drag & drop) view for tasks, runtime English/Arabic switching with full RTL layout mirroring, and a small reusable component library.

## Tech Stack

- React 19 + Vite + TypeScript (strict mode)
- Tailwind CSS v4
- React Router v7
- Zustand (state management)
- react-hook-form + zod (forms & validation)
- react-i18next (internationalization)
- @dnd-kit (drag and drop for the Kanban view)

## Setup & Run

\`\`\`bash
npm install
npm run dev
\`\`\`

Open the printed local URL (typically `http://localhost:5173`).

Other scripts:

\`\`\`bash
npm run build     # type-checks and builds a production bundle
npm run lint      # runs oxlint
npm run preview   # previews the production build locally
\`\`\`

No environment variables or backend setup are required — everything runs against `localStorage`.

## Authentication / Data Mocking Approach

There is no real backend. Authentication and all data (projects, tasks) are mocked using **`localStorage`, wrapped behind a service layer** (`src/services/*.service.ts`).

Why this approach, rather than MSW or json-server:

- It keeps 100% of the assessment's time budget on the parts that carry the most weight (CRUD, i18n/RTL, UI/UX, Git workflow), rather than on mocking infrastructure.
- The service layer means the storage mechanism is fully swappable later — every component talks to `authService` / `projectService` / `taskService`, never to `localStorage` directly. Replacing the internals of those three files with real `fetch`/`axios` calls would require **zero changes** to any component, store, or page.
- See `TECHNICAL_DOCS.md` for how this would extend to a real backend (interceptors, token refresh, optimistic updates).

Session persistence: on successful login, a mock token + the current user are written to `localStorage`. On app boot, `authStore.restoreSession()` reads them back so a page refresh keeps the user logged in.

## Assumptions & Trade-offs

- **Single-user-per-browser data model.** Projects/tasks are scoped by `ownerId`, but since everything lives in the same `localStorage`, two different "accounts" created in the same browser share the same storage keys (no server, so no real isolation beyond filtering by id).
- **No password hashing.** Passwords are stored as plain text in `localStorage` for the mock user records. This is acceptable only because this is a local mock with no real backend — it would never be done this way against a real API.
- **Kanban is a "nice-to-have," not a requirement** (the brief only asks for a quick way to change status — dropdown, drag & drop, or buttons). List view is the default; Kanban is an additional view users can switch to.
- **Validation messages are keyed for i18n** (`validation.email.invalid`, etc.) rather than hardcoded strings, so the same zod schemas work for both languages without duplicating validation logic.
- **Toasts auto-dismiss after 3.5s** and are not queued/stacked beyond a simple list — acceptable for the scope of this app.

## What I'd Improve With More Time

- Add unit/component tests (Vitest + React Testing Library) — the assessment's 3-day window didn't leave room for a meaningful test suite alongside everything else.
- Real backend integration behind the existing service layer (see `TECHNICAL_DOCS.md`).
- Optimistic updates with rollback for task status changes (currently changes are applied synchronously against `localStorage`, so there's no real network latency to hide — this matters much more once a real API is introduced).
- Drag-and-drop reordering *within* a Kanban column (currently drag only changes status/column, not order within it).
- A dedicated 404 / not-found page for invalid project ids instead of falling back to an empty title.