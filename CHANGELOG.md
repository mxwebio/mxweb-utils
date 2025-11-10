# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.3] - 2025-11-10

### Added

- **getSettledValue function** - Utility to safely extract values from PromiseSettledResult with fallback support
- **requestTimeout function** - Efficient timeout scheduling using requestAnimationFrame with setTimeout fallback
- Full JSDoc documentation for getSettledValue and requestTimeout utilities

### Changed

- **Http.createInfer method** - Made `method` parameter optional for more flexible API inference
- **Package format improvements** - Fixed CommonJS/ESM dual package support for better compatibility
  - Removed `"type": "module"` from package.json to properly support CommonJS consumers (e.g., NestJS)
  - Changed ESM output file extension from `.esm.js` to `.mjs` for explicit ESM identification
  - Updated all package exports to correctly map to `.js` (CommonJS) and `.mjs` (ESM) files
  - Renamed `eslint.config.js` to `eslint.config.mjs` for ESM compatibility
  - Renamed `rollup.config.js` to `rollup.config.mjs` for ESM compatibility
- **Build configuration** - Updated Rollup config to generate `.mjs` files for ESM builds

### Fixed

- **ERR_REQUIRE_ESM error** - Resolved issue where CommonJS projects (like NestJS) couldn't require the package
- **Subpath imports** - Fixed module resolution for direct imports like `@mxweb/utils/chunk`
- Package now works correctly in both ESM and CommonJS environments

## [0.0.2] - 2025-11-01

### Added

- **Retry class** - Automatic retry logic with configurable delays and maximum attempts
- **RateLimiter class** - Rate limiting utility to control function execution frequency with configurable request limits and intervals
- **Type definitions** - Common TypeScript types including `ObjectOf`, `Callback`, `AsyncCallback`, `Primitive`, and `FlattenedPrimitive`
- **flattenToArray function** - Enhanced flatten utility to convert nested objects to array format
- **escapeRegexKey function** - Helper function to escape special regex characters in object keys
- Comprehensive retry error handling for both Error objects and primitive values
- Method chaining support for Retry and RateLimiter configuration
- Integration with existing sleep utility for delay management
- Queue-based rate limiting with automatic delay enforcement

## [0.0.1] - 2025-10-31

### Added

- Initial release of `@mxweb/utils`
- HTTP client with Fetch API and XMLHttpRequest support
- Type-safe API client with `createInfer`
- Storage utilities (localStorage, sessionStorage, cookies)
- Array utilities (`chunk`, `flatten`)
- String utilities (`pascalToKebab`, `interpolate`)
- Object utilities (`flatten`)
- File/Format utilities (`formatSize`)
- Environment variable utilities (`getEnv`)
- Async utilities (`sleep`, `Retry` class for automatic retry logic)
- Full TypeScript support
- Request/response/error interceptors
- File upload with progress tracking
