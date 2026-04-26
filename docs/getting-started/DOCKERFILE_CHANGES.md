# Dockerfile Changes — Bun Migration

This document explains the changes made to the client Dockerfile when migrating from Node.js (npm) to Bun.

## What Changed

### Base Image

| Before | After |
|---|---|
| `node:24-alpine` | `oven/bun:1-alpine` |

### Package Installation

| Before | After |
|---|---|
| `RUN npm install --legacy-peer-deps` | `RUN bun install` |

### Build Command

| Before | After |
|---|---|
| `RUN npm run build` | `RUN bun run build` |

## Full Diff

```dockerfile
# Before
FROM node:24-alpine AS builder
...
RUN npm install --legacy-peer-deps
...
RUN npm run build

# After
FROM oven/bun:1-alpine AS builder
...
RUN bun install
...
RUN bun run build
```

## Why Bun Was Chosen

1. **Faster installs** — Bun's file-based caching and parallel installation significantly reduce `bun install` time compared to `npm install`.
2. **Faster builds** — Bun's native execution provides faster build times for Vite-based projects.
3. **Drop-in compatibility** — Bun is fully compatible with npm `package.json` scripts, so no changes to build scripts or dependencies were required.
4. **Smaller image** — The `oven/bun:1-alpine` image is smaller than `node:24-alpine`, reducing the overall build context.

## Compatibility Notes

- Bun supports all standard npm `package.json` scripts (`dev`, `build`, `preview`, etc.) without modification.
- The `--legacy-peer-deps` flag is not needed with Bun as it handles peer dependencies differently.
- All Node.js native modules used by the dependencies are supported by Bun.
- The nginx serving layer remains unchanged — only the build stage uses Bun.

## Verifying the Build

To verify the Bun-based Docker build works correctly:

```bash
docker compose up --build client
```

The resulting image should build faster and produce the same output as the previous Node.js-based build.
