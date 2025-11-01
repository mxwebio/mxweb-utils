# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
