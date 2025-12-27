# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.5] - 2025-12-27

### Added

- **isEqualPrimitive function** - Deep equality comparison for primitives, arrays, and plain objects
  - Recursively compares nested structures
  - Handles all primitive types including null and undefined
  - Type-safe comparison with proper TypeScript support
- **isNullish function** - Type guard to check if a value is null or undefined
  - Provides TypeScript type narrowing in conditional blocks
  - Useful for filtering and validation
- **hasOwnProperty function** - Type-safe check if an object has a specific own property
  - Uses `Object.prototype.hasOwnProperty.call()` for safety
  - Works with null prototype objects
  - Provides TypeScript type narrowing
  - Supports optional `Value` generic for typed property access
  - Supports `LiteralObject`, `LiteralFunction`, and `LiteralClass`
- **isBrowser function** - Detect if running in a browser environment
  - Useful for isomorphic/universal applications
  - SSR/SSG safe code execution
- **isCallable function** - Check if a value or object property is callable
  - Supports regular, async, generator, and async generator functions
  - Works with objects, functions with properties, and static class methods
  - Supports `LiteralObject`, `LiteralFunction`, and `LiteralClass`
- **getTypeName function** - Get the internal `[[Class]]` type tag of a value
  - Uses `Object.prototype.toString.call()` for accurate type detection
  - Returns format like `[object Type]`
- **LiteralObject type** - Generic object literal type for any key-value pairs
  - Supports string, number, and symbol keys (PropertyKey)
- **LiteralFunction type** - Generic function type as safer alternative to `Function`
  - Uses `Callback<any, any[]>` internally
- **LiteralClass type** - Generic class/constructor type for instantiable classes
  - Useful for dependency injection and factory patterns
- **GeneratorCallback type** - Generator function type that returns `Generator<T>`
- **AsyncGeneratorCallback type** - Async generator function type that returns `AsyncGenerator<T>`

## [0.0.4] - 2025-11-13

### Removed

- **HTTP Client** - Moved to separate package [`@mxweb/http`](https://npmjs.com/package/@mxweb/http) v1.0.0
  - The `Http` class and all HTTP-related utilities have been extracted to `@mxweb/http`
  - This change reduces bundle size for users who don't need HTTP client functionality
  - Users who need HTTP features should install `@mxweb/http` separately
  - See [Migration Guide](#migration-from-003-to-004) below for upgrade instructions

### Changed

- Package now focuses on core utilities only (array, string, object, storage, async, environment)
- Reduced package size by ~40% after removing HTTP client
- Updated exports to remove HTTP-related modules

### Migration from 0.0.3 to 0.0.4

If you were using the HTTP client:

```bash
# Install the new HTTP package
npm install @mxweb/http
```

```typescript
// Before (v0.0.3)
import { Http } from "@mxweb/utils";

// After (v0.0.4)
import { Http } from "@mxweb/http";

// Everything else remains the same
const http = new Http("https://api.example.com");
```

If you were NOT using the HTTP client, no changes needed - just upgrade and enjoy the smaller bundle size!

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
