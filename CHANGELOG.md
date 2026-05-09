# Changelog

All notable changes to `feathers-solr` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [3.2.0] - 2025-01-XX

### 🔒 Security

- **BREAKING:** `escapeFn` now defaults to `solrEscape` instead of identity function. String values in queries are automatically escaped to prevent Solr query injection attacks.
  - **Migration:** If your input is already sanitized or you need the old behavior, set `escapeFn: (key, value) => ({ key, value })` explicitly.
- **BREAKING:** Raw Solr parameters (`$params`, `$facet`, `$filter`) are now **blocked by default**.
  - **Migration:** Set `allowedRawSolrParams: ['$facet']` per key or `allowRawSolrParams: true` to restore previous behavior.
- `SolrHttpError` now includes structured error details: `statusCode`, `solrMessage`, `body`, and `url` (credentials stripped).
- HTTP Basic Auth support via `host` URL or `requestOptions.auth`.

### ⚡ Performance

- **BREAKING:** HTTP keep-alive agent enabled by default (`maxSockets: 64`, `keepAliveMsecs: 30000`).
  - **Migration:** Override via `requestOptions.agent` if you need custom pooling behavior.
- Default timeout increased to 60 seconds.

### 🐛 Bug Fixes

- Range queries with single property resolved correctly.

---

## [3.1.2] - 2024-XX-XX

### 📦 Dependencies

- Updated `@feathersjs/*` dependencies to 5.0.33
- Updated TypeScript to 5.5.4

---

## [3.1.0] - 2024-XX-XX

### ✨ Features

- Full TypeScript support with exported types
- Improved error handling with `SolrHttpError`
- HTTP Basic Auth support

### 📝 Documentation

- Updated README with TypeScript examples
- Added security documentation

---

## [3.0.0] - 2023-XX-XX

### 🔥 Breaking Changes

- Migrated to Feathers 5.x API
- Dropped support for Node.js < 16
- Rewritten in TypeScript

### ✨ Features

- Complete TypeScript rewrite
- Modern async/await API
- Improved query building

---

## [2.x] - 2015-2022

### Legacy

- Feathers 3.x and 4.x compatible
- JavaScript implementation
- Basic Solr adapter functionality

---

# Migration Guide: v2 → v3

## Overview

Version 3.0 is a complete rewrite in TypeScript with Feathers 5.x support. Version 3.2 adds important security hardening.

## Upgrade Steps

### 1. Update Dependencies

```bash
npm install feathers-solr@^3.2.0
```

Ensure you have:
- Node.js >= 16
- Feathers 5.x (`@feathersjs/feathers@^5.0.0`)
- Solr >= 5.x (tested with 9.x)

### 2. TypeScript Migration (v3.0)

The package is now written in TypeScript with full type support:

```typescript
// v2 (JavaScript)
const SolrService = require('feathers-solr');
const service = new SolrService({ ... });

// v3 (TypeScript recommended)
import { SolrService, SolrAdapterOptions } from 'feathers-solr';

const options: SolrAdapterOptions = { ... };
const service = new SolrService<Product>({ ... });
```

### 3. Security Defaults (v3.2)

#### escapeFn Default Changed

**v2/v3.0-v3.1:**
```typescript
// No escaping by default
const service = new SolrService({ ... });
```

**v3.2+:**
```typescript
// Automatic escaping enabled by default
const service = new SolrService({ ... });

// Opt out if your input is already sanitized
const service = new SolrService({
  ...options,
  escapeFn: (key, value) => ({ key, value }) // Identity function
});
```

#### Raw Solr Parameters Blocked

**v2/v3.0-v3.1:**
```typescript
// $params, $facet, $filter worked out of the box
await service.find({ query: { $params: { hl: true } } });
```

**v3.2+:**
```typescript
// Option 1: Allow specific params (recommended)
const service = new SolrService({
  ...options,
  allowedRawSolrParams: ['$facet', '$params']
});

// Option 2: Allow all (restore old behavior - use with caution!)
const service = new SolrService({
  ...options,
  allowRawSolrParams: true
});

// Option 3: Use Feathers hooks for fine-grained control
app.service('products').hooks({
  before: {
    find: [
      context => {
        const { query } = context.params;
        if (query?.$params) {
          const allowed = ['defType', 'qf', 'hl', 'spellcheck'];
          const keys = Object.keys(query.$params);
          const blocked = keys.filter(k => !allowed.includes(k));
          if (blocked.length > 0) {
            throw new BadRequest(`Blocked params: ${blocked.join(', ')}`);
          }
        }
        return context;
      }
    ]
  }
});
```

### 4. HTTP Keep-Alive (v3.2)

**v2/v3.0-v3.1:**
```typescript
// New connection per request
const service = new SolrService({ ... });
```

**v3.2+:**
```typescript
// Keep-alive agent enabled by default (maxSockets: 64)
const service = new SolrService({ ... });

// Override if needed
import http from 'http';
const agent = new http.Agent({ keepAlive: true, maxSockets: 128 });

const service = new SolrService({
  ...options,
  requestOptions: { agent }
});
```

### 5. Error Handling (v3.2)

**v2/v3.0-v3.1:**
```typescript
try {
  await service.find({ ... });
} catch (err) {
  console.error(err.message);
}
```

**v3.2+:**
```typescript
import { SolrHttpError } from 'feathers-solr';

try {
  await service.find({ ... });
} catch (err) {
  if (err instanceof SolrHttpError) {
    console.error('HTTP Status:', err.statusCode);
    console.error('Solr Message:', err.solrMessage);
    console.error('Request URL:', err.url); // Credentials stripped
    console.error('Response Body:', err.body);
  }
}
```

### 6. HTTP Basic Auth (v3.2)

**v2:**
```typescript
// May have required custom implementation
```

**v3.2+:**
```typescript
// Option 1: In URL
const service = new SolrService({
  host: 'http://user:password@solr.internal:8983/solr',
  core: 'products'
});

// Option 2: Via requestOptions
const service = new SolrService({
  host: 'https://solr.internal:8983/solr',
  core: 'products',
  requestOptions: { auth: 'user:password' }
});
```

## Summary of Breaking Changes in v3.2

| Feature | Old Default | New Default | Migration |
|---------|-------------|-------------|-----------|
| `escapeFn` | Identity (no escaping) | `solrEscape` | Set `escapeFn: (k,v) => ({k,v})` to opt out |
| Raw Solr Params | Allowed | Blocked | Set `allowRawSolrParams: true` or `allowedRawSolrParams: [...]` |
| HTTP Keep-Alive | Off | On (64 sockets) | Override `requestOptions.agent` if needed |
| Error Details | Basic | Structured (`SolrHttpError`) | Use `instanceof SolrHttpError` for details |
| HTTP Auth | Manual | Built-in | Use `host` URL or `requestOptions.auth` |

## Questions?

- [GitHub Issues](https://github.com/sajov/feathers-solr/issues) – Report bugs or ask questions
- [Security Documentation](README.md#security) – Detailed security guide
