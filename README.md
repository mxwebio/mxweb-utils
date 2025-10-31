# @mxweb/utils

A comprehensive collection of TypeScript utilities for modern web development, providing robust solutions for HTTP requests, data manipulation, storage management, and more.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9+-blue.svg)](https://www.typescriptlang.org/)
[![npm version](https://img.shields.io/npm/v/@mxweb/utils.svg)](https://www.npmjs.com/package/@mxweb/utils)

## Table of Contents

- [Installation](#installation)
- [Features](#features)
- [Usage](#usage)
  - [Importing](#importing)
  - [Quick Start](#quick-start)
- [API Reference](#api-reference)
  - [Array Utilities](#array-utilities)
  - [String Utilities](#string-utilities)
  - [Object Utilities](#object-utilities)
  - [File & Format Utilities](#file--format-utilities)
  - [HTTP Client](#http-client)
  - [Storage Utilities](#storage-utilities)
  - [Environment Variables](#environment-variables)
  - [Async Utilities](#async-utilities)
- [Examples](#examples)
- [Configuration](#configuration)
- [TypeScript Support](#typescript-support)
- [Browser Support](#browser-support)
- [Contributing](#contributing)
- [License](#license)
- [Changelog](#changelog)
- [Authors](#authors)
- [Acknowledgments](#acknowledgments)

## Installation

Install `@mxweb/utils` using your preferred package manager:

```bash
# Using npm
npm install @mxweb/utils

# Using yarn
yarn add @mxweb/utils

# Using pnpm
pnpm add @mxweb/utils

# Using bun
bun add @mxweb/utils
```

## Features

- 🚀 **HTTP Client** - Full-featured HTTP client with interceptors, authentication, and file upload support
- 💾 **Storage Management** - Unified API for localStorage, sessionStorage, and cookies
- 🔧 **String Utilities** - Case conversion, URI encoding/decoding, template interpolation
- 📦 **Object Utilities** - Deep flattening for nested objects and arrays
- 📊 **Data Formatting** - Human-readable file size formatting
- 🌍 **Environment Variables** - Cross-framework environment variable access (React, Next.js, Vite, etc.)
- ⏱️ **Async Utilities** - Promise-based delay and sleep functions
- 📝 **Array Utilities** - Array chunking and batch processing
- 🔒 **Type-Safe** - Full TypeScript support with comprehensive type definitions
- 🌐 **Framework Agnostic** - Works with any JavaScript framework or vanilla JS
- 🎯 **Tree-Shakeable** - Import only what you need for optimal bundle size
- 📱 **Browser & Node.js** - Compatible with both environments

## Usage

### Importing

You can import utilities in multiple ways:

```typescript
// Import everything
import * as utils from "@mxweb/utils";

// Import specific utilities
import { Http, storage, chunk, formatSize } from "@mxweb/utils";

// Import from specific modules
import { Http } from "@mxweb/utils/http";
import { storage } from "@mxweb/utils/storage";
import { chunk } from "@mxweb/utils/chunk";
```

### Quick Start

Here are some quick examples to get you started:

```typescript
import { Http, storage, chunk, formatSize, sleep, getEnv } from "@mxweb/utils";

// 1. HTTP Client - Make API requests
const http = new Http("https://api.example.com");

// GET request
const { data, success } = await http.get("/users");

// POST request
await http.post("/users", { name: "John Doe", email: "john@example.com" });

// Upload file with progress
await http.upload("/upload", file, {
  name: "document",
  onProgress: (progress) => console.log(`${progress.percentage}%`),
});

// 2. Storage - Manage localStorage, sessionStorage, cookies
// Save data
storage.local.setItem("user", { id: 1, name: "John" });

// Retrieve data with type safety
const user = storage.local.getItem<{ id: number; name: string }>("user");

// 3. Array Utilities - Split arrays into chunks
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const chunks = chunk(numbers, 3); // [[1, 2, 3], [4, 5, 6], [7, 8, 9]]

// 4. Format Utilities - Human-readable file sizes
const size = formatSize(1536000); // "1.46 MB"

// 5. Async Utilities - Add delays
await sleep(1000); // Wait 1 second

// 6. Environment Variables - Access env vars across frameworks
const apiUrl = getEnv("API_URL", "http://localhost:3000");
// Automatically checks: API_URL, REACT_APP_API_URL, NEXT_PUBLIC_API_URL, VITE_API_URL, etc.
```

## API Reference

### Array Utilities

#### `chunk`

Splits an array into smaller chunks of a specified size.

```typescript
function chunk<T>(source: T[], size?: number): T[][];
```

**Parameters:**

- `source: T[]` - The array to split into chunks
- `size: number` - The maximum size of each chunk (default: 5)

**Returns:** `T[][]` - A two-dimensional array of chunks

**Example:**

```typescript
import { chunk } from "@mxweb/utils";

chunk([1, 2, 3, 4, 5, 6, 7], 3);
// Returns: [[1, 2, 3], [4, 5, 6], [7]]

// Batch processing
const users = Array.from({ length: 100 }, (_, i) => ({ id: i }));
const batches = chunk(users, 10); // Process 10 users at a time
```

---

### String Utilities

#### `pascalToKebab`

Converts a PascalCase or camelCase string to kebab-case.

```typescript
function pascalToKebab(str: string): string;
```

**Parameters:**

- `str: string` - The PascalCase or camelCase string to convert

**Returns:** `string` - The kebab-case formatted string

**Example:**

```typescript
import { pascalToKebab } from "@mxweb/utils";

pascalToKebab("PascalCase"); // "pascal-case"
pascalToKebab("camelCase"); // "camel-case"
pascalToKebab("XMLHttpRequest"); // "xml-http-request"
```

#### `interpolate`

Interpolates a template string by replacing placeholders with values.

```typescript
function interpolate(pattern: string, params?: Record<string, unknown> | Array<unknown>): string;
```

**Parameters:**

- `pattern: string` - Template string with placeholders in format `{key}`
- `params: Record<string, unknown> | Array<unknown>` - Values to interpolate

**Returns:** `string` - The interpolated string

**Example:**

```typescript
import { interpolate } from "@mxweb/utils";

interpolate("Hello {name}!", { name: "John" });
// Returns: "Hello John!"

interpolate("User: {user.name}, Age: {user.age}", {
  user: { name: "John", age: 30 },
});
// Returns: "User: John, Age: 30"

interpolate("/api/users/{userId}/posts/{postId}", {
  userId: 123,
  postId: 456,
});
// Returns: "/api/users/123/posts/456"
```

#### `decodeURISafe`

Safely decodes a URI-encoded string with error handling.

```typescript
function decodeURISafe(str: string, component?: boolean): string;
```

**Parameters:**

- `str: string` - The URI-encoded string to decode
- `component: boolean` - Use `decodeURIComponent` (true) or `decodeURI` (false). Default: true

**Returns:** `string` - The decoded string, or original if decoding fails

**Example:**

```typescript
import { decodeURISafe } from "@mxweb/utils";

decodeURISafe("Hello%20World"); // "Hello World"
decodeURISafe("Hello%2World"); // "Hello%2World" (invalid encoding preserved)
```

#### `encodeURISafe`

Encodes a string to be safely used in a URI.

```typescript
function encodeURISafe(str: string, component?: boolean): string;
```

**Parameters:**

- `str: string` - The string to encode
- `component: boolean` - Use `encodeURIComponent` (true) or `encodeURI` (false). Default: true

**Returns:** `string` - The URI-encoded string

**Example:**

```typescript
import { encodeURISafe } from "@mxweb/utils";

encodeURISafe("Hello World"); // "Hello%20World"
encodeURISafe("name=value&other=data"); // "name%3Dvalue%26other%3Ddata"
```

---

### Object Utilities

#### `flatten`

Flattens a nested object or array into a single-level object with dot-notated keys.

```typescript
function flatten(data: Record<string, unknown> | Array<unknown>): Record<string, unknown>;
```

**Parameters:**

- `data: Record<string, unknown> | Array<unknown>` - The object or array to flatten

**Returns:** `Record<string, unknown>` - A flattened object with dot-notated keys

**Example:**

```typescript
import { flatten } from "@mxweb/utils";

flatten({
  user: {
    name: "John",
    contacts: { email: "john@example.com" },
  },
});
// Returns: { "user.name": "John", "user.contacts.email": "john@example.com" }

flatten([1, 2, { value: 3 }]);
// Returns: { "0": 1, "1": 2, "2.value": 3 }
```

#### `flattenArray`

Flattens an array into a single-level object with dot-notated keys.

```typescript
function flattenArray(data: Array<unknown>): Record<string, unknown>;
```

**Parameters:**

- `data: Array<unknown>` - The array to flatten

**Returns:** `Record<string, unknown>` - A flattened object

**Example:**

```typescript
import { flattenArray } from "@mxweb/utils";

flattenArray([{ name: "John" }, { name: "Jane" }]);
// Returns: { "0.name": "John", "1.name": "Jane" }
```

#### `flattenObject`

Flattens an object into a single-level object with dot-notated keys.

```typescript
function flattenObject(data: Record<string, unknown>): Record<string, unknown>;
```

**Parameters:**

- `data: Record<string, unknown>` - The object to flatten

**Returns:** `Record<string, unknown>` - A flattened object

**Example:**

```typescript
import { flattenObject } from "@mxweb/utils";

flattenObject({ user: { name: "John", age: 30 } });
// Returns: { "user.name": "John", "user.age": 30 }
```

---

### File & Format Utilities

#### `formatSize`

Formats a file size in bytes to a human-readable string.

```typescript
function formatSize(sizeInBytes: number, base?: Array<string>): string;
```

**Parameters:**

- `sizeInBytes: number` - The size in bytes to format
- `base: Array<string>` - Custom unit labels (default: `["B", "KB", "MB", "GB", "TB"]`)

**Returns:** `string` - Formatted string with size and unit

**Example:**

```typescript
import { formatSize } from "@mxweb/utils";

formatSize(1024); // "1 KB"
formatSize(1536); // "1.5 KB"
formatSize(1048576); // "1 MB"
formatSize(2457600); // "2.34 MB"
```

---

### HTTP Client

#### `Http`

Full-featured HTTP client with interceptors, authentication, and file upload support.

##### Constructor

```typescript
new Http(baseURL?: string)
```

**Parameters:**

- `baseURL: string` - Base URL for all requests (default: from `API_URL` env var or "/")

**Example:**

```typescript
import { Http } from "@mxweb/utils";

const http = new Http("https://api.example.com");
```

##### Instance Methods

###### `get`

Makes a GET request.

```typescript
get<T = unknown, Query = Record<string, unknown>, E = unknown>(
  url: string,
  query?: Query,
  options?: { headers?, params?, signal? }
): Promise<HttpResponse<T, E>>
```

**Example:**

```typescript
const { data, success, status } = await http.get<User[]>("/users");
const response = await http.get("/search", { q: "keyword", page: 1 });
```

###### `post`

Makes a POST request.

```typescript
post<T = unknown, Body = unknown, E = unknown>(
  url: string,
  body?: Body,
  options?: { headers?, params?, signal?, query? }
): Promise<HttpResponse<T, E>>
```

**Example:**

```typescript
const response = await http.post<User>("/users", {
  name: "John Doe",
  email: "john@example.com",
});
```

###### `put`

Makes a PUT request.

```typescript
put<T = unknown, Body = unknown, E = unknown>(
  url: string,
  body?: Body,
  options?: { headers?, params?, signal?, query? }
): Promise<HttpResponse<T, E>>
```

**Example:**

```typescript
await http.put(
  "/users/{id}",
  { name: "John Updated" },
  {
    params: { id: 123 },
  }
);
```

###### `patch`

Makes a PATCH request.

```typescript
patch<T = unknown, Body = unknown, E = unknown>(
  url: string,
  body?: Body,
  options?: { headers?, params?, signal?, query? }
): Promise<HttpResponse<T, E>>
```

**Example:**

```typescript
await http.patch(
  "/users/{id}",
  { email: "newemail@example.com" },
  {
    params: { id: 123 },
  }
);
```

###### `delete`

Makes a DELETE request.

```typescript
delete<T = unknown, E = unknown>(
  url: string,
  options?: { headers?, params?, signal?, query? }
): Promise<HttpResponse<T, E>>
```

**Example:**

```typescript
await http.delete("/users/{id}", { params: { id: 123 } });
```

###### `head`

Makes a HEAD request.

```typescript
head<T = unknown, E = unknown>(
  url: string,
  options?: { headers?, params?, signal?, query? }
): Promise<HttpResponse<T, E>>
```

###### `options`

Makes an OPTIONS request.

```typescript
options<T = unknown, E = unknown>(
  url: string,
  options?: { headers?, params?, signal?, query? }
): Promise<HttpResponse<T, E>>
```

###### `upload`

Uploads files with optional progress tracking.

```typescript
upload<T = unknown, E = unknown>(
  url: string,
  file: File | File[] | FileList,
  options?: HttpUploadOptions
): Promise<HttpResponse<T, E>>
```

**Example:**

```typescript
const file = input.files[0];

await http.upload("/upload", file, {
  name: "document",
  onProgress: (progress) => {
    console.log(`${progress.percentage}%`);
  },
  body: { userId: 123 },
});

// Multiple files
await http.upload("/upload", input.files, {
  name: "files[]",
});
```

###### `on` / `off`

Registers or removes interceptors for this instance.

```typescript
on(type: 'request' | 'response' | 'error', handler: Function): Http
off(type: 'request' | 'response' | 'error', handler: Function): Http
```

**Example:**

```typescript
http.on("request", async (options) => {
  console.log("Request:", options.url);
  return options;
});

http.on("response", async (response) => {
  console.log("Response:", response.status);
  return response;
});

http.on("error", async (error) => {
  console.error("Error:", error);
});
```

###### `addHeaders`

Adds default headers to all requests.

```typescript
addHeaders(headers: Record<string, string>): void
```

**Example:**

```typescript
http.addHeaders({
  "X-Custom-Header": "value",
  "X-API-Version": "2.0",
});
```

###### `setStorage`

Sets the storage implementation for authentication tokens.

```typescript
setStorage(storage: HttpStorage): void
```

**Example:**

```typescript
http.setStorage(storage.local);
```

##### Static Methods

###### `Http.on` / `Http.off`

Registers or removes global interceptors for all Http instances.

```typescript
static on(type: 'request' | 'response' | 'error', handler: Function): void
static off(type: 'request' | 'response' | 'error', handler: Function): void
```

**Example:**

```typescript
// Global request interceptor
Http.on("request", async (options) => {
  options.headers = { ...options.headers, "X-Timestamp": Date.now() };
  return options;
});
```

###### `Http.createInfer`

Creates a factory function for generating type-safe API endpoint functions.

```typescript
static createInfer(options?: HttpInferOptions): InferFunction
```

**Example:**

```typescript
const endpoints = {
  "user.list": "/api/users",
  "user.get": "/api/users/{id}",
  "user.create": "/api/users",
};

const infer = Http.createInfer({
  baseURL: "https://api.example.com",
  endpoint: endpoints,
});

const getUsers = infer<User[]>("user.list", HttpMethod.GET);
const createUser = infer<User, [UserInput]>("user.create", HttpMethod.POST);

// Use the generated functions
const { data: users } = await getUsers.fn();
const { data: newUser } = await createUser.fn({ name: "John" });
```

##### Types & Interfaces

###### `HttpMethod`

Enum of supported HTTP methods.

```typescript
enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
  PATCH = "PATCH",
  HEAD = "HEAD",
  OPTIONS = "OPTIONS",
}
```

###### `HttpRequest`

Configuration options for an HTTP request.

```typescript
interface HttpRequest<Body, Params, Query, Headers> {
  method: HttpMethod;
  url: string;
  headers?: Headers;
  body?: Body;
  query?: Query;
  params?: Params;
  signal?: AbortSignal;
}
```

###### `HttpResponse`

Standardized HTTP response structure.

```typescript
interface HttpResponse<T, E> {
  success: boolean;
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  error: E | null;
}
```

###### `HttpStorage`

Interface for storage implementations.

```typescript
interface HttpStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string, options?: any): void;
}
```

###### `HttpUploadOptions`

Configuration options for file uploads.

```typescript
interface HttpUploadOptions {
  name: string;
  onProgress?: (progress: HttpProgress) => void;
  body?: Record<string, unknown>;
  headers?: Record<string, string>;
  params?: Record<string, unknown>;
  signal?: AbortSignal;
  query?: HttpQuery;
}
```

###### `HttpProgress`

Progress information for file uploads.

```typescript
interface HttpProgress {
  loaded: number;
  total: number;
  percentage: number;
}
```

---

### Storage Utilities

#### `storage`

Unified storage utility for localStorage, sessionStorage, and cookies.

##### `storage.local`

Access localStorage with automatic JSON serialization.

```typescript
storage.local.getItem<T>(key: string): T | null
storage.local.setItem(key: string, value: any): void
storage.local.removeItem(key: string): void
```

**Example:**

```typescript
import { storage } from "@mxweb/utils";

// Store data
storage.local.setItem("user", { id: 1, name: "John" });

// Retrieve with type safety
const user = storage.local.getItem<{ id: number; name: string }>("user");

// Remove
storage.local.removeItem("user");
```

##### `storage.session`

Access sessionStorage with automatic JSON serialization.

```typescript
storage.session.getItem<T>(key: string): T | null
storage.session.setItem(key: string, value: any): void
storage.session.removeItem(key: string): void
```

**Example:**

```typescript
storage.session.setItem("tempData", { timestamp: Date.now() });
const data = storage.session.getItem("tempData");
```

##### `storage.cookie`

Access cookies with automatic JSON serialization.

```typescript
storage.cookie.getItem<T>(key: string): T | null
storage.cookie.setItem(key: string, value: any): void
storage.cookie.removeItem(key: string): void
```

**Example:**

```typescript
storage.cookie.setItem("preferences", { theme: "dark", lang: "en" });
const prefs = storage.cookie.getItem("preferences");
```

##### `storage.from`

Create a storage instance of a specific type.

```typescript
storage.from(type: 'localStorage' | 'sessionStorage' | 'cookie'): InnerStorage
```

**Example:**

```typescript
const customStorage = storage.from("localStorage");
customStorage.setItem("key", "value");
```

---

### Environment Variables

#### `getEnv`

Gets environment variables with automatic framework prefix detection.

```typescript
function getEnv<T>(key: string, defaultValue?: T): T | undefined;
```

**Parameters:**

- `key: string` - The environment variable key (case-insensitive)
- `defaultValue: T` - Default value if variable not found

**Returns:** The environment variable value or default value

**Supported Prefixes:**

- `API_URL`
- `REACT_API_URL` / `REACT_APP_API_URL`
- `NEXT_PUBLIC_API_URL`
- `VITE_API_URL`
- `PUBLIC_API_URL`
- `NUXT_PUBLIC_API_URL`
- `GATSBY_API_URL`
- `SNOWPACK_PUBLIC_API_URL`
- `ASTRO_PUBLIC_API_URL`

**Example:**

```typescript
import { getEnv } from "@mxweb/utils";

const apiUrl = getEnv("API_URL", "http://localhost:3000");
const apiKey = getEnv("API_KEY");
const debug = getEnv("DEBUG", "false") === "true";
```

---

### Async Utilities

#### `sleep`

Pauses execution for a specified duration.

```typescript
function sleep(ms: number): Promise<void>;
```

**Parameters:**

- `ms: number` - Duration in milliseconds (negative values clamped to 0)

**Returns:** `Promise<void>` - Promise that resolves after the delay

**Example:**

```typescript
import { sleep } from "@mxweb/utils";

// Wait 1 second
await sleep(1000);

// Retry with delay
async function retryRequest(fn: () => Promise<any>, attempts = 3) {
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i < attempts - 1) await sleep(1000);
    }
  }
}
```

## Examples

### Basic Examples

```typescript
import {
  Http,
  storage,
  chunk,
  formatSize,
  sleep,
  pascalToKebab,
  interpolate,
  flatten,
  getEnv,
} from "@mxweb/utils";

// HTTP Client
const http = new Http("https://api.example.com");
const { data } = await http.get("/users");
await http.post("/users", { name: "John" });

// Storage
storage.local.setItem("user", { id: 1, name: "John" });
const user = storage.local.getItem("user");

// String utilities
pascalToKebab("MyComponent"); // 'my-component'
interpolate("Hello {{name}}", { name: "John" }); // 'Hello John'

// Array utilities
chunk([1, 2, 3, 4, 5], 2); // [[1, 2], [3, 4], [5]]
flatten([
  [1, 2],
  [3, [4, 5]],
]); // [1, 2, 3, 4, 5]

// Format utilities
formatSize(1024); // '1 KB'
formatSize(1048576); // '1 MB'

// Async utilities
await sleep(1000); // Wait 1 second

// Environment variables
const apiUrl = getEnv("API_URL", "https://api.example.com");
```

### HTTP Client Examples

#### Type-Safe API with `createInfer`

```typescript
import { Http, HttpMethod } from "@mxweb/utils";

const endpoints = {
  "user.list": "/users",
  "user.get": "/users/{id}",
  "user.create": "/users",
} as const;

const infer = Http.createInfer({
  baseURL: "https://api.example.com",
  endpoint: endpoints,
});

interface User {
  id: number;
  name: string;
  email: string;
}

const api = {
  user: {
    list: infer<User[]>("user.list", HttpMethod.GET),
    get: infer<User, [{ params: { id: number } }]>("user.get", HttpMethod.GET),
    create: infer<User, [{ name: string; email: string }]>("user.create", HttpMethod.POST),
  },
};

// Usage
const users = await api.user.list.fn();
const user = await api.user.get.fn({ params: { id: 1 } });
const newUser = await api.user.create.fn({ name: "John", email: "john@example.com" });
```

#### Server-Side Actions (Next.js)

```typescript
// lib/api/server-client.ts
'use server';
import { Http, HttpMethod } from '@mxweb/utils';
import { getEnv } from '@mxweb/utils';

const serverHttp = new Http(getEnv('INTERNAL_API_URL'));
serverHttp.addHeaders({
  'X-API-Key': getEnv('API_SECRET_KEY', ''),
});

const endpoints = {
  'user.list': '/users',
  'user.get': '/users/{id}',
};

const infer = Http.createInfer({
  http: serverHttp,
  endpoint: endpoints
});

export const serverApi = {
  user: {
    list: infer<User[]>('user.list', HttpMethod.GET),
    get: infer<User, [{ params: { id: number } }]>('user.get', HttpMethod.GET),
  },
};

// app/actions/user.actions.ts
'use server';
import { serverApi } from '@/lib/api/server-client';

export async function getUsersAction() {
  const response = await serverApi.user.list.fn();
  return response.data;
}

// app/users/page.tsx
'use client';
import { getUsersAction } from '@/app/actions/user.actions';

export default function UsersPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsersAction().then(setUsers);
  }, []);

  return <div>{/* Render users */}</div>;
}
```

### Storage Examples

```typescript
import { storage } from "@mxweb/utils";

// User preferences
interface UserPreferences {
  theme: "light" | "dark";
  language: string;
}

storage.local.setItem("prefs", { theme: "dark", language: "en" });
const prefs = storage.local.getItem<UserPreferences>("prefs");

// Session management
interface Session {
  userId: number;
  expiresAt: number;
}

storage.session.setItem("session", {
  userId: 123,
  expiresAt: Date.now() + 24 * 60 * 60 * 1000,
});

// Cookie-based auth
storage.cookie.setItem("access_token", "token123");
const token = storage.cookie.getItem<string>("access_token");
```

### Advanced Usage

#### API Client with Interceptors

```typescript
import { Http, storage, sleep } from "@mxweb/utils";

class ApiClient {
  private http: Http;

  constructor(baseURL: string) {
    this.http = new Http(baseURL);
    this.http.setStorage(storage.local);
    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Add auth token
    this.http.on("request", async (options) => {
      const token = storage.local.getItem<string>("access_token");
      if (token) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${token}`,
        };
      }
      return options;
    });

    // Handle token refresh
    this.http.on("response", async (response) => {
      if (response.status === 401) {
        const newToken = await this.refreshToken();
        if (newToken) {
          response.config.headers["Authorization"] = `Bearer ${newToken}`;
          return await this.http.request(response.config);
        }
      }
      return response;
    });

    // Retry on error
    this.http.on("error", async (error) => {
      if (!error.retryCount) error.retryCount = 0;
      if (error.retryCount < 3) {
        error.retryCount++;
        await sleep(1000 * error.retryCount);
        return await this.http.request(error.config);
      }
      return error;
    });
  }

  private async refreshToken(): Promise<string | null> {
    const refreshToken = storage.local.getItem<string>("refresh_token");
    if (!refreshToken) return null;

    const response = await this.http.post<{ accessToken: string }>("/auth/refresh", {
      refreshToken,
    });
    if (response.success) {
      storage.local.setItem("access_token", response.data.accessToken);
      return response.data.accessToken;
    }
    return null;
  }

  async get<T>(url: string, query?: any) {
    return this.http.get<T>(url, query);
  }

  async post<T>(url: string, body?: any) {
    return this.http.post<T>(url, body);
  }
}

// Usage
const api = new ApiClient("https://api.example.com");
const users = await api.get("/users");
```

## Configuration

### Environment Variables

```typescript
import { getEnv } from "@mxweb/utils";

// Works with any framework - automatically detects prefix
// React: REACT_APP_API_URL
// Next.js: NEXT_PUBLIC_API_URL
// Vite: VITE_API_URL
// Nuxt: NUXT_PUBLIC_API_URL
// Node.js: API_URL

const config = {
  apiUrl: getEnv("API_URL", "https://api.example.com"),
  apiKey: getEnv("API_KEY", ""),
  debug: getEnv("DEBUG", "false") === "true",
};
```

### Authentication

```typescript
import { Http, storage } from "@mxweb/utils";

const http = new Http("https://api.example.com");
http.setStorage(storage.local);

// Request interceptor - add auth token
http.on("request", async (options) => {
  const token = storage.local.getItem<string>("access_token");
  if (token) {
    options.headers = { ...options.headers, Authorization: `Bearer ${token}` };
  }
  return options;
});

// Response interceptor - handle 401
http.on("response", async (response) => {
  if (response.status === 401) {
    // Refresh token or redirect to login
  }
  return response;
});
```

### Interceptors

```typescript
import { Http, sleep } from "@mxweb/utils";

const http = new Http("https://api.example.com");

// Request interceptor
http.on("request", async (options) => {
  options.headers = {
    ...options.headers,
    "X-Request-ID": `req_${Date.now()}`,
  };
  return options;
});

// Response interceptor
http.on("response", async (response) => {
  console.log(`Response: ${response.status}`);
  return response;
});

// Error interceptor with retry
http.on("error", async (error) => {
  if (!error.retryCount) error.retryCount = 0;
  if (error.retryCount < 3) {
    error.retryCount++;
    await sleep(1000 * error.retryCount);
    return await http.request(error.config);
  }
  return error;
});
```

## TypeScript Support

`@mxweb/utils` is written in TypeScript and provides full type safety with comprehensive type definitions for all utilities.

```typescript
import { Http, storage, chunk } from "@mxweb/utils";

// Generic types
interface User {
  id: number;
  name: string;
}

const http = new Http("https://api.example.com");
const response = await http.get<User[]>("/users");
response.data; // Type: User[] | undefined

// Storage with types
storage.local.setItem<User>("user", { id: 1, name: "John" });
const user = storage.local.getItem<User>("user"); // Type: User | null

// Array utilities preserve types
const nums = [1, 2, 3, 4, 5];
const chunks = chunk(nums, 2); // Type: number[][]
```

### IDE Support

Full IntelliSense, autocomplete, type hints, and error checking in VS Code, WebStorm, and other TypeScript-aware IDEs.

## Browser Support

`@mxweb/utils` supports all modern browsers and Node.js environments.

### Modern Browsers

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Mobile Browsers

- ✅ iOS Safari 14+
- ✅ Chrome for Android 90+

### Node.js

- ✅ Node.js 14.x+
- ✅ Node.js 16.x LTS
- ✅ Node.js 18.x LTS
- ✅ Node.js 20.x LTS

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Quick Start

1. Fork the repository
2. Install dependencies: `npm install`
3. Make your changes
4. Run tests: `npm test`
5. Submit a pull request

## License

MIT License

Copyright (c) 2024 MXWeb

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Changelog

### [0.0.1] - 2025-10-31

#### Added

- Initial release of `@mxweb/utils`
- HTTP client with Fetch API and XMLHttpRequest support
- Type-safe API client with `createInfer`
- Storage utilities (localStorage, sessionStorage, cookies)
- Array utilities (`chunk`, `flatten`)
- String utilities (`pascalToKebab`, `interpolate`)
- Object utilities (`flatten`)
- File/Format utilities (`formatSize`)
- Environment variable utilities (`getEnv`)
- Async utilities (`sleep`)
- Full TypeScript support
- Request/response/error interceptors
- File upload with progress tracking

## Authors

- **MXWeb Team** - [MXWeb](https://github.com/mxwebio)

## Acknowledgments

- Thanks to all contributors
- Inspired by Lodash, Axios, and modern utility libraries
- Built with TypeScript and bundled using Rollup
- Code quality maintained with ESLint and Prettier
- Tested with Vitest for reliability and stability

---

<div align="center">

Made with ❤️ by [MxWeb.IO](https://github.com/mxwebio)

⭐ Star us on GitHub — it helps!

[Report Bug](https://github.com/mxwebio/mxweb-utils/issues) · [Request Feature](https://github.com/mxwebio/mxweb-utils/issues) · [Documentation](https://github.com/mxwebio/mxweb-utils#readme)

</div>
