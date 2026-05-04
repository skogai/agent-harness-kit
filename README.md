# agent-harness-kit

CLI scaffolding for multi-agent harness systems.  
Binary: `ahk` · Works with Claude Code, OpenCode, and any MCP-compatible AI tool.

---

## Requirements

- Node.js ≥ 22 **or** Bun (any recent version)
- npm ≥ 9

---

## Local development setup

### 1. Clone and install dependencies

```bash
git clone <repo-url>
cd agent-harness-kit
npm install
```

### 2. Build the TypeScript source

```bash
npm run build
```

This compiles `src/` → `dist/`. You must re-run this every time you change source files.

> Tip: run `npm run dev` in a separate terminal to watch for changes and rebuild automatically.

### 3. Link the binary globally

```bash
npm link
```

This registers `ahk` as a global command on your machine by symlinking `bin/ahk.js` into your global `node_modules/.bin/`.

Verify it worked:

```bash
ahk --version
# 0.1.0
```

---

## Testing from an external project folder

Once linked, you can use `ahk` from **any directory** — no need to be inside `agent-harness-kit/`.

```bash
# Create a test project folder anywhere
mkdir ~/projects/my-test-app
cd ~/projects/my-test-app

# Run the interactive scaffold
ahk init
```

Follow the prompts. After init, your folder will contain:

```
my-test-app/
├── agent-harness-kit.config.ts       ← your harness config
├── AGENTS.md                  ← navigation map for agents
├── health.sh                  ← implement your health checks here
├── .harness/
│   ├── harness.db             ← SQLite source of truth
│   ├── current.md             ← auto-generated session snapshot
│   └── feature_list.json      ← human-editable task list
└── .claude/
    ├── agents/
    │   ├── lead.md
    │   ├── explorer.md
    │   ├── builder.md
    │   └── reviewer.md
    └── mcp.json               ← Claude Code picks this up automatically
```

---

## Development loop

```
# Terminal 1 — watch and rebuild on save
cd agent-harness-kit
npm run dev

# Terminal 2 — test commands from your external project
cd ~/projects/my-test-app
ahk status
ahk task add
ahk health
```

Because `npm link` creates a symlink (not a copy), every rebuild in terminal 1 is immediately available in terminal 2 — no re-linking needed.

---

## Available commands

```
ahk init                    Interactive harness scaffold
ahk build                   Regenerate AGENTS.md + provider files from config
ahk build --watch           Rebuild on config file changes
ahk health                  Run health.sh and report result
ahk status                  Show task table and active actions
ahk status --json           Same, as JSON
ahk sync                    Sync feature_list.json ↔ SQLite
ahk sync --dry-run          Preview changes without applying
ahk serve                   Start MCP server on stdio (used by Claude Code)
ahk task add                Add a task interactively
ahk task list               List all tasks
ahk task list --status pending|in_progress|done|blocked
ahk task done <id|slug>     Mark a task as done (runs health check first)
ahk migrate --to <provider> Move provider files to claude-code or opencode
ahk export --json           Export tasks + actions as JSON
```

---

## Remove the global link

When you no longer need the local link:

```bash
npm unlink -g agent-harness-kit
```

---

## MCP server

`ahk serve` starts the MCP server on stdio. You never need to call it manually — after `ahk init`, the generated `.claude/mcp.json` (Claude Code) or `opencode.json` (OpenCode) tells the AI tool to spawn it automatically when you open the project.

**Tools exposed to agents:**

| Tool | Description |
|------|-------------|
| `actions.start(taskId, agent)` | Start an action, returns `actionId` |
| `actions.write(actionId, section, content)` | Record a section (result, tools\_used, …) |
| `actions.complete(actionId, summary)` | Close the action |
| `actions.get(taskId)` | Full action history for a task |
| `tasks.get([status])` | List tasks, optionally filtered |
| `tasks.claim(id, agent)` | Atomically claim a pending task |
| `tasks.update(id, status)` | Change task status |
| `docs.search(query)` | Search the project docs folder |

---

## Runtime compatibility

| Runtime | Support |
|---------|---------|
| Node.js ≥ 22 | ✅ uses `node:sqlite` built-in |
| Bun (any) | ✅ uses `bun:sqlite` built-in |
| Node.js < 22 | ❌ `node:sqlite` not available |

---

## Running tests

Tests use the Node.js built-in test runner — no extra dependencies needed.

```bash
npm run build
npm test
```

---

## Publishing to npm

The package is published under the `@cardor` scope as `@cardor/agent-harness-kit`.

### Prerequisites

1. Be a member of the `@cardor` npm organization (or have publish access).
2. Be logged in to npm:

```bash
npm login
```

### Manual publish

```bash
# 1. Bump the version (patch | minor | major)
npm version patch

# 2. Build, run tests, and publish (prepublishOnly does build + test automatically)
npm publish --access public
```

> `--access public` is required for scoped packages on the free npm plan.

### Check what will be packed before publishing

```bash
npm pack --dry-run
```

This lists every file that would be included in the tarball without actually uploading anything. Make sure `dist/` and `bin/` are listed, and that `src/`, `node_modules/`, and `.harness/` are **not**.

### Patch release checklist

```
[ ] git pull --rebase origin main
[ ] npm run build && npm test         # must be green
[ ] npm version patch                 # bumps package.json + creates git tag
[ ] git push && git push --tags       # CI will publish automatically (see below)
[ ] npm publish --access public       # only if publishing manually
```
