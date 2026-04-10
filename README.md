# iBos Task - Online Test Platform

A role-based online test platform built with Next.js and Supabase.

## Project Overview

This project includes two primary user roles:

- Employee: create and publish online tests
- Candidate: join tests, attempt questions, and submit answers

Core flow implemented:

- Employee creates test (basic info + question set)
- Candidate sees available tests
- Candidate starts exam with timer and submits
- Result submission is stored through backend APIs

## Tech Stack

- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS
- Redux Toolkit
- React Query + Axios
- Supabase (Auth + Database)
- React Hook Form + Zod

## Setup Instructions

### 1) Clone and install

```bash
git clone https://github.com/rakib-utsho/iBos_Task.git
cd iBos_Task
npm install
```

### 2) Environment variables

Create `.env` and set:

```dotenv
NEXT_PUBLIC_ENV=development
NEXT_PUBLIC_PORT=5000
NEXT_PUBLIC_BASE_URL=https://api.yourproductiondomain.com/api
NEXT_PUBLIC_DEV_BASE_URL=http://localhost:5000/api

NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY

# Demo credentials (development only)
DEMO_EMPLOYEE_EMAIL=employee@example.com
DEMO_EMPLOYEE_PASSWORD=Employee@12345
DEMO_CANDIDATE_EMAIL=candidate@example.com
DEMO_CANDIDATE_PASSWORD=Candidate@12345
```

### 3) Run the app

```bash
npm run dev
```

### 4) Build for production

```bash
npm run lint
npm run build
npm run start
```

## API / Backend Integration (Bonus)

Backend/API integration is implemented using Next.js route handlers and Supabase.

Implemented routes:

- `/api/employee/tests`
- `/api/candidate/tests`
- `/api/candidate/tests/[testId]`
- `/api/candidate/tests/[testId]/submit`
- `/api/auth/bootstrap-demo-users`

## Additional Questions (Completed)

### 1) MCP Integration

Yes, MCP-style workflows were used in development.

- MCP used: Supabase workflow + VS Code/GitHub coding workflow
- Work performed:
  - Supabase client/server/admin setup
  - Role-based auth flow (employee/candidate)
  - Test create/list/attempt/submit API flow
  - Query/mutation architecture with React Query + Axios
- Accomplishment:
  - End-to-end online test lifecycle implemented and running

Future MCP idea for this project:

- Use Supabase MCP + Chrome DevTools MCP together to debug request chains, verify schema changes, and optimize runtime performance.

### 2) AI Tools for Development

Tools/processes used and recommended:

- GitHub Copilot: component scaffolding, refactor assistance, typed boilerplate
- ChatGPT / Claude-style assistants: architecture review, edge-case planning, API validation
- Recommended process:
  - Generate initial implementation quickly
  - Enforce lint/type/build checks
  - Refactor into reusable hooks/components
  - Validate with realistic scenarios

### 3) Offline Mode During Exam

If a candidate loses internet during an exam:

- Auto-save answers + timer checkpoint to IndexedDB/localStorage
- Detect offline/online state and show status banner
- Keep local timer running and reconcile with server on reconnect
- Queue unsent answer updates and sync with idempotent requests
- Auto-submit queued final payload once reconnected
- Keep server as source of truth for final scoring and validity

## Deliverables

- GitHub repository with code:
  - <https://github.com/rakib-utsho/iBos_Task>
- README with setup instructions:
  - Included in this file
- Completed answers to additional questions:
  - Included above
- Live demo link:
  - Add your link: <https://your-live-demo-url>
- Video recording link:
  - Add your link: <https://your-video-link>
- Backend/API integration (bonus):
  - Implemented

## Submission Checklist

- [x] Source code in repository
- [x] Setup instructions in README
- [x] Additional question answers in README
- [ ] Live demo URL added
- [ ] Video recording URL added
- [x] Backend/API integration implemented

## Author

Md. Rakibul Islam

## License

MIT (see [LICENSE](LICENSE))
