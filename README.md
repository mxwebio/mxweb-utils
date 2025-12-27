# @mxweb/utils

A comprehensive collection of TypeScript utilities for modern web development.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9+-blue.svg)](https://www.typescriptlang.org/)
[![npm version](https://img.shields.io/npm/v/@mxweb/utils.svg)](https://www.npmjs.com/package/@mxweb/utils)

## Installation

```bash
# npm
npm install @mxweb/utils

# yarn
yarn add @mxweb/utils

# pnpm
pnpm add @mxweb/utils

# bun
bun add @mxweb/utils
```

## Features

- 💾 **Storage Management** - localStorage, sessionStorage, cookies
- 🔧 **String Utilities** - Case conversion, URI encoding, interpolation
- 📦 **Object Utilities** - Flattening, type checking, property access
- 📊 **Data Formatting** - File size formatting
- 🌍 **Environment Variables** - Cross-framework env access
- ⏱️ **Async Utilities** - Sleep, retry, rate limiting
- 📝 **Array Utilities** - Chunking, batch processing
- 🔒 **Type-Safe** - Full TypeScript support
- 🎯 **Tree-Shakeable** - Optimal bundle size

## Quick Start

```typescript
// Import everything
import * as utils from "@mxweb/utils";

// Import specific utilities
import { storage, chunk, formatSize } from "@mxweb/utils";

// Import from specific modules (tree-shaking)
import { storage } from "@mxweb/utils/storage";
import { chunk } from "@mxweb/utils/chunk";
```

## Documentation

📖 **Full documentation available at: [https://docs.mxweb.io/utilities](https://docs.mxweb.io/utilities)**

## License

MIT © [MXWeb Team](https://github.com/mxwebio)
