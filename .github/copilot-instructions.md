# Copilot Instructions for Is it buses?

## Project Overview

**Is it buses?** is a web application that displays train disruption information for Melbourne and Victoria's public transport network. It provides a visual, user-friendly interface to check if trains are running or if bus replacements are in effect.

- **Tech Stack**: TypeScript, React 19, Vike (SSR), Express, MongoDB, Tailwind CSS 4, Vitest
- **Architecture**: Full-stack TypeScript application with server-side rendering (SSR)
- **Purpose**: Hub for train disruption information with interactive map visualization

## Project Structure

```
is-it-buses/
├── frontend/          # Frontend React components and pages
│   ├── components/    # Reusable React components
│   ├── pages/         # Vike filesystem-based routing pages
│   └── public/        # Static assets
├── server/            # Backend Express server
│   ├── api/           # REST API endpoints
│   ├── data/          # Data models and repositories
│   ├── services/      # Business logic services
│   ├── task/          # Background tasks
│   └── entry-point/   # Application initialization
├── shared/            # Shared code between frontend and backend
├── scripts/           # Build and utility scripts
│   └── generate-map-geometry/  # Map generation scripts
└── tests/             # Test files organized by path
```

## Key Architecture Decisions

### Frontend

- **Framework**: Vike (SSR framework) with React 19
- **Styling**: Tailwind CSS 4 (using `@tailwindcss/vite` plugin)
- **Routing**: Filesystem-based routing via Vike (pages in `frontend/pages/`)
- **State Management**: React hooks, no external state library
- **Data Fetching**: Vike's `+data.ts` files for SSR data loading

### Backend

- **Server**: Express 5 with TypeScript
- **Database**: MongoDB (with in-memory fallback for development)
- **Time Management**: Uses UTC timezone exclusively (`TZ="Etc/UTC"`)
- **Authentication**: Cookie-based sessions with bcrypt password hashing
- **External Services**: Discord bot integration, PTV API relay

### Important Patterns

- **Import Alias**: Always use `@/` prefix for imports (e.g., `@/server/app`, `@/frontend/components/Button`)
- **No Relative Imports**: Enforced by custom ESLint rule `custom/enforce-import-alias`
- **Server/Frontend Separation**: Frontend files cannot import from `@/server` (except `+data.ts` files)
- **Entry Point Protection**: Only `main.ts` can import from `@/server/entry-point`

## Code Style and Conventions

### TypeScript

- **Strict Mode**: Always enabled
- **Target**: ES2022
- **Module System**: ESNext with bundler resolution
- **Naming**: Use PascalCase for classes/types, camelCase for variables/functions

### Formatting

- **Tool**: Prettier with Tailwind CSS plugin
- **Line Length**: Default (80 characters)
- **Quotes**: Double quotes (Prettier default)
- **Trailing Commas**: ES5 (Prettier default)

### Linting Philosophy

> Reserve errors for situations where the code will not run or compile. Everything else is a warning. Warnings will still cause CI to fail, but let the dev get away with trying something temporarily without the editor putting red squigglies all over the place.

### ESLint Rules (Key)

- Unused variables starting with `_` are allowed
- Use `===` and `!==` (except when comparing to `null`)
- No `console.log` outside of server code and `+data.ts` files (use `console.warn` if needed)
- React: prefer self-closing components when no children

### React Patterns

- Use functional components with hooks
- No class components
- Import React: `import React from "react";` (explicit imports)
- JSX in `.tsx` files only

## Testing

### Framework

- **Tool**: Vitest 3
- **Coverage**: Tracked with `@vitest/coverage-v8` and Codecov
- **Run Commands**:
  - `npm run test` - Run all tests
  - `npm run test-coverage` - Run with coverage report

### Test Structure

```typescript
import { describe, expect, it } from "vitest";
import { ClassName } from "@/server/some-class";

describe("ClassName", () => {
  describe("#methodName", () => {
    it("does something specific", () => {
      // Test implementation
    });
  });
});
```

### Testing Guidelines

- Place tests in `tests/` directory, mirroring source structure
- Test file naming: `{filename}.test.ts`
- Use descriptive test names (happy path first, then edge cases)
- Keep tests minimal - write as few tests as needed to cover functionality
- Static methods use `.` prefix (e.g., `.fromExtremities`)
- Instance methods use `#` prefix (e.g., `#isValid`)

## Build and Development

### Commands

```bash
npm install              # Install dependencies
npm run dev              # Start development server (http://localhost:3000)
npm run build            # Production build
npm run start            # Start production server
npm run lint             # Run TypeScript + ESLint + Knip
npm run format           # Format code with Prettier
npm run format-check     # Check formatting without modifying
npm run test             # Run tests
npm run test-coverage    # Run tests with coverage
```

### Development Setup

1. Node.js 22.20.0 (or compatible)
2. Optional: MongoDB for local database (falls back to in-memory if not configured)
3. Environment variables in `.env` (optional):
   - `DATABASE_URL` - MongoDB connection string
   - `RELAY_KEY` - PTV API relay key
   - `DISCORD_TOKEN`, `DISCORD_CHANNEL` - Discord integration

### Production Environment Variables

- `NODE_ENV=production` (auto-set by start script)
- `TZ="Etc/UTC"` (auto-set by start script)
- `COMMIT_HASH` - Git commit hash for deployment tracking
- `SUPERADMIN_USERNAME`, `SUPERADMIN_PASSWORD` - Admin credentials
- `NPM_CONFIG_PRODUCTION=false` - Required for DigitalOcean deployment

### Build Process

1. TypeScript compilation check (`tsc --noEmit`)
2. Linting (ESLint)
3. Dead code detection (Knip)
4. Vite build for frontend
5. Unit tests (Vitest)

## Key Technical Details

### Timezone

- **Always UTC**: All server operations use `Etc/UTC` timezone
- Set via `TZ` environment variable in npm scripts
- Critical for consistent time handling across deployments

### Path Aliases

- `@/` maps to project root
- Example: `@/server/app.ts` → `/home/project/server/app.ts`
- Configured in `vite.config.ts` and `tsconfig.json`

### SSR with Vike

- Pages in `frontend/pages/` use filesystem routing
- `+Page.tsx` - React component
- `+data.ts` - Server-side data loading
- `+config.ts` - Page configuration
- Vike handles SSR, routing, and hydration

### Map Generation

- Custom geometry generation in `scripts/generate-map-geometry/`
- Uses FlexiPoint/FlexiLength for responsive map rendering
- Line geometry defined programmatically (not from external data)

### Database

- MongoDB with `@dan-schel/db` wrapper
- Migration system in `server/database/migrations`
- In-memory fallback for development without MongoDB

### API Structure

- REST API at `/api` prefix
- Routes defined in `server/api/`
- Authentication protected by middleware
- CORS configuration for external access

## Common Gotchas

1. **Import Paths**: Always use `@/` prefix, never relative imports like `../`
2. **Console Logging**: Avoid `console.log` - it's disallowed in most files
3. **Time Handling**: Always assume UTC timezone
4. **Frontend/Server Separation**: Frontend components cannot import server code (except via `+data.ts`)
5. **Entry Point**: Only `main.ts` should import from `@/server/entry-point`
6. **React Imports**: Always explicitly import React in TSX files
7. **Unused Variables**: Prefix with `_` if intentionally unused (e.g., `_unusedParam`)

## CI/CD

### GitHub Actions Workflow

Runs on every push with 4 jobs:

1. **Format Check**: `npm run format-check`
2. **Lint**: `npm run lint` (TypeScript + ESLint + Knip)
3. **Test**: `npm run test-coverage` (with Codecov upload)
4. **Build**: `npm run build`

All jobs must pass for PR to merge.

### Deployment

- Platform: DigitalOcean App Platform
- Auto-deployment on push to main branch
- Discord notifications for successful deployments
- Beta environment: https://beta.isitbuses.com

## Dependencies (Key)

### Core Dependencies

- `express@5.1.0` - Web server
- `react@19.2.0`, `react-dom@19.2.0` - UI framework
- `vike@0.4.242`, `vike-react@0.6.9` - SSR framework
- `mongodb@6.20.0` - Database client
- `discord.js@14.23.2` - Discord integration
- `zod@4.1.12` - Runtime type validation
- `date-fns@4.1.0` - Date utilities

### Dev Dependencies

- `typescript@5.9.3` - Language
- `vitest@3.2.4` - Testing
- `eslint@9.37.0`, `prettier@3.6.2` - Code quality
- `knip@5.64.3` - Dead code detection
- `vite@7.1.9` - Build tool

## Special Files

- `knip.config.ts` - Configures dead code detection
- `eslint.config.js` - Custom ESLint rules and configuration
- `vite.config.ts` - Vite and Vitest configuration, PWA setup
- `.github/prompts/` - Custom prompts for code generation

## When Making Changes

1. **Read the context**: Understand existing patterns before modifying
2. **Follow conventions**: Match the style of surrounding code
3. **Use proper imports**: Always `@/` prefix, never relative
4. **Update tests**: Add/modify tests for changed functionality
5. **Run checks**: `npm run lint && npm run test` before committing
6. **Format code**: Run `npm run format` before final commit
7. **Check build**: Run `npm run build` to ensure production build works

## Getting Help

- Check existing code for patterns
- Review ESLint rules in `eslint.config.js`
- Look at test examples in `tests/` directory
- Reference `.github/prompts/` for test generation patterns
