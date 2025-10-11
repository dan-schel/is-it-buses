# Is it buses? - Copilot Instructions

## Overview

"Is it buses?" is a web application that displays train disruption information for Melbourne and Victoria's public transport network. The primary focus is bus replacement disruptions, although the long-term goal is to cover all types of disruptions.

Tech stack:

- TypeScript
- React
- Vike (SSR)
- Express
- MongoDB
- Tailwind CSS 4
- Vitest

### File structure

```
is-it-buses/
├── frontend/                   # Frontend React components and pages
│   ├── components/             # Reusable React components
│   ├── pages/                  # Vike filesystem-based routing pages
│   └── public/                 # Static assets
├── server/                     # Backend Express server
│   ├── api/                    # RPC-style API endpoints
│   ├── data/                   # Data models and repositories
│   ├── services/               # Business logic services
│   ├── task/                   # Background tasks
│   └── entry-point/            # Application initialization
├── shared/                     # Shared code (mostly types) between frontend and backend
├── scripts/                    # Build and utility scripts
│   └── generate-map-geometry/  # Map generation scripts
└── tests/                      # Test files organized by path
```

### Key commands

- `npm i`: Install dependencies
- `npm run lint`: Run TypeScript + ESLint + Knip (deadcode detection)
- `npm run format`: Format code with Prettier
- `npm run test`: Run tests

Note that all PRs must pass linting, formatting, and tests in order to merge.

## Architecture

### Frontend

- Vike (SSR framework) with React 19
- Styled with Tailwind CSS 4
- Filesystem-based routing via Vike (follows `frontend/pages/` directory)
- Uses React hooks for state (no external state library)
- Data fetching via Vike's `+data.ts` hooks for SSR, or via API calls to `@/server/api/` endpoints for client-side interactions (see examples of `callApi`, `useQuery`, and `useMutation`)

### Backend

- Server powered by Express 5 with TypeScript
- MongoDB database (with optional in-memory fallback for development and tests)
- Auth via cookie-based sessions with bcrypt password hashing
- Data fetched fro PTV API (via custom relay server)
- Discord bot integration for monitoring and alerts

### Separation of concerns

- Code in the `frontend/` folder cannot import from `@/server` (except `+data.ts` files, which are SSR hooks which run on the server, and therefore considered "backend" code).
- Only `main.ts` may import from `@/server/entry-point`.
  - It creates an `App` instance which is the heart of the backend application. All other backend code can retrieve the values established at the entry point via this `App` instance. This includes the lists of stations, lines, groups, database connection, alert source (PTV API relay client), discord client, logger, and more.
  - `App` is made available in all `+data.ts` files, API handlers, and background tasks (check surrounding code for examples, as it's passed in differently depending on the context).
- Prefer performing formatting on the backend (in the `+data.ts` files) over sending large chunks of raw data to the frontend and formatting there.
  - For example, the frontend shouldn't need to know the full list of stations and lines on the network. Convert IDs to names on the backend and send it on to the frontend already formatted.
  - Note: While the server runs in the UTC timezone at all times, all dates can be formatted in `Australia/Melbourne` timezone for display to users, allowing even date formatting to be done on the backend.

## Core concepts

- Stations & lines - Train stations and lines and associated metadata (e.g. mapping to the PTV API IDs). These are statically defined in the entry point, rather than stored in the database.
- Line groups - Groups of lines, e.g. the Pakenham and Cranbourne line, which are both members of the "Dandenong group" as they have a significant shared section of track, and therefore essentially act as one. All lines fall within a group, and the `LineGroup` classes for each group define a tree structure to represent this. Nodes in the tree typically represent a single station, except in the case of the city loop, which is collapsed into a single node for simplicity.
- Alerts - A raw disruption message from the PTV API. We do not display these directly to users, but rather use them as input to generate `Disruptions`, either via automatic parsing rules, or manual curation via the admin interface.
- Disruptions - Disruption messages shown on the site. Made up of "data" and a "period" (time frame). The "data" is highly structured into different types, e.g. `BusReplacementsDisruptionData` vs `StationClosureDisruptionData`.
- PTV API relay - A custom relay server (lives in another repo: https://github.com/dan-schel/vic-transport-api-relay) which fetches data (in our case, alerts) from the PTV API and caches them.
- Map & map highlighting - The centerpiece of the landing page is a map of the train network with disrupted line segments highlighted. Each edge in the line group tree defines the area of the map to highlight when that edge is disrupted. Map geometry is generated via a script found in `scripts/generate-map-geometry/`, and saved as a static file in the frontend in `frontend/components/map/geometry/`.

## Code Style and Conventions

### Overall TypeScript guidelines

- TS Config: strict mode, es2022 target, esnext modules with bundler resolution.
- Formatted with Prettier (run `npm run format`).
- Linted with ESLint (run `npm run lint`).
- Always use absolute imports with `@/` alias for the root folder (e.g. `@/server/app`, `@/frontend/components/Button`).
- Never use `console.log`. Backend code should use `app.log.info` or `app.log.warn`. Frontend code can use `console.warn` to log handled errors, but should otherwise not log anything.
- Prefer `function` syntax over arrow function syntax for named functions (still use arrow functions for lambdas).
- Prefer `==` when comparing to `null` (to also catch `undefined`), otherwise always use `===`.
- Prefer `null` over `undefined` for optional/unset values. This reserves `undefined` for uninitialized variables.

### Class guidelines

- Prefer immutable classes with readonly properties.
- For classes which need serialization, either to the database or over an API, use Zod.
- Example:

  ```ts
  import { z } from "zod";

  export class MyClass {
    constructor(
      readonly prop1: MyOtherClass,
      readonly prop2: readonly string[],
    ) {}

    // Named `bson` if for serialization to the DB, `json` if for over an API.
    // For JSON, dates must be serialized to strings, but BSON allows Date types.
    static readonly json = z
      .object({
        prop1: MyOtherClass.json,

        // Prefer z.string().array() over z.array(z.string()).
        prop2: z.string().array().readonly(),
      })
      .transform((obj) => new MyClass(obj.someData));

    // Or `toBson()` if appropriate.
    toJSON(): z.input<typeof MyClass.json> {
      return {
        prop1: this.prop1.toJSON(),
        prop2: this.prop2,
      };
    }

    // Add if needed.
    with({
      prop1 = this.prop1,
      prop2 = this.prop2,
    }: {
      prop1?: MyOtherClass;
      prop2?: readonly string[];
    }): MyClass {
      return new MyClass(prop1, prop2);
    })
  }
  ```

### React guidelines

- Prefer one component per file, unless they're very small helper components.
- Prefer self-closing components when no children.
- Follow the style:

  ```tsx
  import React from "react";

  type MyComponentProps = {
    // props here
  };

  export function MyComponent(props: MyComponentProps) {
    // component code
  }
  ```

### Test guidelines

- Place tests in `tests/` directory, mirroring source structure, e.g. `server/app.ts` would be tested at `tests/server/app.test.ts`.
- Use descriptive test names (happy path first, then edge cases).
- Keep tests minimal - prefer shorter test files with 80% coverage, over long test files with >90% coverage.
- Follow the structure:

  ```ts
  import { describe, expect, it } from "vitest";
  import { ClassName } from "@/server/some-class";

  describe("ClassName", () => {
    describe("#constructor", () => {
      it("does something specific", () => {
        // Test implementation
      });
    });

    describe("#methodName", () => {
      it("does something specific", () => {
        // Test implementation
      });
    });

    describe(".staticMethodName", () => {
      it("does something specific", () => {
        // Test implementation
      });
    });
  });
  ```

### Database guidelines

Reading/writing to the database is achieved via `app.database`. (Although note that some collections (such as alerts, disruptions, and users) have custom repository classes (`app.alerts`, `app.disruptions`, `app.auth` respectively) which encapsulate common queries and operations.

The database interface is a custom library `@dan-schel/db` which allows us to work with our classes directly, instead of dealing with raw BSON documents, for example:

```ts
import { Session } from "@/server/services/auth/session";

// Model class which knows how to serialize/deserialize `Session` objects.
import { SESSIONS } from "@/server/database/models";

export async function someFunction(app: App) {
  const myToken = "asdasdasd";
  const session1: Session = app.database.of(SESSIONS).first({
    where: { token: myToken },
  });

  // Update `lastUsed` (`id` kept as-is, so we're updating session1 in the DB).
  const updateSession1 = session1.with({ lastUsed: new Date() });
  await app.database.of(SESSIONS).update(updateSession1);
}
```

Operations include:

- `get(id)`: Get a document by its ID or null
- `require(id)`: Get a document by its ID, or throw if not found
- `create(obj)`: Add a new document
- `update(obj)`: Update an existing document (must have the same ID as an existing document)
- `delete(id)`: Delete an existing document, given its ID
- `find({ where: { ... }})`: Return all matching documents
- `first({ where: { ... }})`: Return first matching document or null
- `requireFirst({ where: { ... }})`: Return first matching document, or throw if not found
- `requireSingle({ where: { ... }})`: Return only matching document, or throw if none or multiple found
- `count({ where: { ... }})`: Return the number of matching documents

## When Making Changes

1. **Read the context**: Understand existing patterns before modifying
2. **Follow conventions**: Match the style of surrounding code
3. **Update tests**: Add/modify tests for changed functionality
4. **Run checks**: `npm run lint && npm run test` before committing
5. **Format code**: Run `npm run format` before committing
