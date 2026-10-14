# @itsaorg/storage-base

Zero-dependency TypeScript contracts for Itsa storage addresses, pages, I/O, lifecycle, and errors.

## 🗂️ Table of contents

- [@itsaorg/storage-base](#itsaorgstorage-base)
  - [🗂️ Table of contents](#️-table-of-contents)
  - [What this package is](#what-this-package-is)
  - [Requirements](#requirements)
  - [Install](#install)
  - [Example](#example)
  - [Project layout](#project-layout)
  - [Links](#links)

## What this package is

This package names the pieces a storage library shares: how bytes are addressed, how a page carries a `Buffer` payload, how read/write/delete/list options are shaped, and how lifecycle and errors are reported.

You extend the classes. You do not construct unfinished abstract contracts directly. The same pattern applies across `src/base` once those principals land.

`StorageError` is the exception type for normalized storage failures (added with the error contracts). Prefer package-root imports only.

## Requirements

- Node.js 26
- TypeScript, for the type declarations
- No runtime dependencies

## Install

The scoped name is reserved with a `0.0.0` publish when that step runs. The first feature cut is `0.1.0`. After publish:

```bash
npm install @itsaorg/storage-base
```

Import names from `@itsaorg/storage-base`. Do not import a file inside the package.

## Example

Import from the package root once the public surface is exported:

```ts
import type {} from "@itsaorg/storage-base";
```

Concrete examples for address, page, and storage contracts appear in the [API reference](https://itsaorg.github.io/storage-base/) as those principals ship.

## Project layout

- `src/base` holds classes and enumerations (pages, storage, lifecycle, errors).
- `src/types` holds interfaces (address, I/O options, event map, config).

`src/index.ts` re-exports those names. That file is the public API.

## Links

- [API reference](https://itsaorg.github.io/storage-base/)
- [Contributing](.github/CONTRIBUTING.md)
- [Code of Conduct](.github/CODE_OF_CONDUCT.md)
- [Security](.github/SECURITY.md)
- [License](LICENSE)
