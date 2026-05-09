# feathers-solr

[![npm version](https://img.shields.io/npm/v/feathers-solr.svg)](https://www.npmjs.com/package/feathers-solr)
[![npm](https://img.shields.io/npm/dm/feathers-solr.svg)](https://www.npmjs.com/package/feathers-solr)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Node](https://img.shields.io/node/v/feathers-solr)](https://www.npmjs.com/package/feathers-solr)
[![License](https://img.shields.io/npm/l/feathers-solr)](LICENSE)
[![CI](https://github.com/sajov/feathers-solr/actions/workflows/nodejs.yml/badge.svg)](https://github.com/sajov/feathers-solr/actions/workflows/nodejs.yml)
[![Coverage Status](https://coveralls.io/repos/github/sajov/feathers-solr/badge.svg?branch=master)](https://coveralls.io/github/sajov/feathers-solr?branch=master)
[![Known Vulnerabilities](https://snyk.io/test/npm/feathers-solr/badge.svg)](https://snyk.io/test/npm/feathers-solr)

> A [Feathers](https://feathersjs.com/) v5 database adapter for [Apache Solr](https://lucene.apache.org/solr/) that implements the [Common Database Adapter API](https://docs.feathersjs.com/api/databases/common.html) and the [Feathers querying syntax](https://docs.feathersjs.com/api/databases/querying.html).

**Tested against Solr 9.x** · Solr >= 5.x · Node.js >= 16 · TypeScript 5.x

---

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [API Reference](#api-reference)
  - [Constructor Options](#constructor-options)
  - [Service Methods](#service-methods)
- [Querying](#querying)
  - [Basic Queries](#basic-queries)
  - [Query Operators](#query-operators)
  - [Full-Text Search (`$search`)](#full-text-search-search)
  - [Faceting (`$facet`)](#faceting-facet)
  - [Advanced Solr Parameters (`$params`)](#advanced-solr-parameters-params)
  - [Raw Filter Queries (`$filter`)](#raw-filter-queries-filter)
- [Security](#security)
  - [Query Escaping](#query-escaping)
  - [Raw Solr Parameter Gate](#raw-solr-parameter-gate)
- [Error Handling](#error-handling)
- [Performance](#performance)
- [HTTP Authentication](#http-authentication)
- [Managing Solr](#managing-solr)
- [Links](#links)
- [License](#license)

---

## Installation

```bash
npm install feathers-solr --save
```

---

## Quick Start

### TypeScript

```typescript
import { SolrService, SolrAdapterOptions } from 'feathers-solr';
import type { Paginated } from '@feathersjs/feathers';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
}

const options: SolrAdapterOptions = {
  host: 'http://localhost:8983/solr',
  core: 'products',
  paginate: { default: 10, max: 100 }
};

const products = new SolrService<Product>(options);

const page: Paginated<Product> = await products.find({
  query: {
    category: 'electronics',
    $search: 'laptop'
  }
});
```

### JavaScript

```javascript
const { SolrService } = require('feathers-solr');

const service = new SolrService({
  host: 'http://localhost:8983/solr',
  core: 'gettingstarted',
  paginate: { default: 10, max: 100 }
});

app.use('/products', service);
```

### Running Solr Locally

```bash
bin/solr start -e gettingstarted
```

The Solr admin UI is then available at <http://localhost:8983/solr>.

---

## API Reference

### Constructor Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `host` | `string` | **required** | Solr server URL, e.g. `http://localhost:8983/solr` |
| `core` | `string` | **required** | Solr core/collection name |
| `id` | `string` | `'id'` | Name of the ID field |
| `paginate` | `object` | `undefined` | Feathers pagination config (`{ default, max }`) |
| `multi` | `boolean \| string[]` | `false` | Allow bulk `create`, or `update`/`patch`/`remove` with `id: null` |
| `events` | `string[]` | `[]` | Custom service events |
| `commit` | `object` | `{ softCommit: true, commitWithin: 10000, overwrite: true }` | Solr commit behaviour for write operations |
| `defaultParams` | `object` | `{ echoParams: 'none' }` | Params merged into every Solr request |
| `defaultSearch` | `object` | `{}` | Default strategy applied to `$search` queries (e.g. `{ defType: 'edismax', qf: 'name^10 description' }`) |
| `queryHandler` | `string` | `'/query'` | Solr request handler for queries |
| `updateHandler` | `string` | `'/update/json'` | Solr request handler for writes |
| `createUUID` | `boolean` | `true` | Auto-generate a UUID for documents created without an ID |
| `escapeFn` | `(key, value) => { key, value }` | `solrEscape` | Per-field escaping for query values, see [Security](#security) |
| `allowRawSolrParams` | `boolean` | `false` | Allow `$params`, `$facet`, `$filter` (off by default) |
| `allowedRawSolrParams` | `(\'$params\' \| \'$facet\' \| \'$filter\')[]` | `[]` | Per-key allowlist used when `allowRawSolrParams` is `false` |
| `requestOptions` | `http.RequestOptions` | `{ timeout: 60000 }` | Forwarded to [`http.request`](https://nodejs.org/api/http.html#httprequestoptions-callback) (e.g. `agent`, `auth`, `headers`) |
| `logger` | `(msg) => void` | no-op | Receives request/response/error metadata for diagnostics |

### Service Methods

#### `find(params)`

```typescript
// Paginated response
const page = await service.find({
  query: { category: 'electronics' }
});

// Plain array
const items = await service.find({
  query: { category: 'electronics' },
  paginate: false
});
```

#### `get(id, params)`

```typescript
const product = await service.get('prod-123');
```

#### `create(data, params)`

```typescript
// Single
await service.create({ name: 'Laptop', price: 999 });

// Bulk — requires `multi: true` or `multi: ['create']`
await service.create([
  { name: 'Mouse', price: 29 },
  { name: 'Keyboard', price: 79 }
]);
```

#### `update(id, data, params)`

Replaces the document.

```typescript
await service.update('prod-123', {
  name: 'Gaming Laptop',
  price: 1299,
  category: 'electronics'
});
```

#### `patch(id, data, params)`

Uses Solr [atomic updates](https://solr.apache.org/guide/solr/latest/indexing-guide/partial-document-updates.html).

```typescript
// Field replacement
await service.patch('prod-123', { price: 899 });

// Atomic operators
await service.patch('prod-123', { views:  { inc: 1 } });
await service.patch('prod-123', { tags:   { add: 'sale' } });
await service.patch('prod-123', { tags:   { remove: 'clearance' } });
```

| Operator | Effect |
|----------|--------|
| `set` | Replace field value(s) |
| `add` | Append to a multi-valued field |
| `add-distinct` | Append only if the value is not already present |
| `remove` | Remove a value from a multi-valued field |
| `removeregex` | Remove values matching a regex |
| `inc` | Increment a numeric field |

#### `remove(id, params)`

```typescript
// Single
await service.remove('prod-123');

// By query — requires `multi: true` or `multi: ['remove']`
await service.remove(null, {
  query: { category: 'discontinued' }
});
```

---

## Querying

`feathers-solr` accepts the standard [Feathers query syntax](https://docs.feathersjs.com/api/databases/querying.html) and adds Solr-specific extensions: `$search`, `$facet`, `$params`, and `$filter`.

### Basic Queries

```typescript
// Exact match
await service.find({ query: { category: 'electronics' } });

// Range
await service.find({ query: { price: { $gte: 100, $lte: 500 } } });

// IN
await service.find({ query: { category: { $in: ['electronics', 'accessories'] } } });

// Sort
await service.find({ query: { $sort: { price: -1, name: 1 } } });

// Pagination
await service.find({ query: { $limit: 20, $skip: 40 } });

// Field projection
await service.find({ query: { $select: ['id', 'name', 'price'] } });
```

### Query Operators

| Operator | Solr filter produced |
|----------|----------------------|
| `$eq` | `field:value` |
| `$ne` | `!field:value` |
| `$lt` / `$lte` | `field:[* TO value}` / `field:[* TO value]` |
| `$gt` / `$gte` | `field:{value TO *]` / `field:[value TO *]` |
| `$in` / `$nin` | `field:(a OR b)` / `!field:(a OR b)` |
| `$like` / `$nlike` | `field:*value*` / `!field:*value*` |
| `$starts` / `$ends` | `field:value*` / `field:*value` |
| `$fuzzy` | `field:value~` |
| `$empty` / `$nempty` | `!field:*` / `field:*` |
| `$or` / `$and` | Combinators |

### Full-Text Search (`$search`)

`$search` is sent to Solr as the main `query` (the `q` parameter).

```typescript
// Default field (e.g. _text_)
await service.find({ query: { $search: 'laptop' } });

// Phrase
await service.find({ query: { $search: '"gaming laptop"' } });

// Fuzzy / wildcard
await service.find({ query: { $search: 'laptap~' } });
await service.find({ query: { $search: 'lap*' } });

// Boolean operators
await service.find({ query: { $search: '(laptop AND gaming)' } });
await service.find({ query: { $search: '(laptop NOT refurbished)' } });

// Field-scoped / range
await service.find({ query: { $search: 'name:laptop' } });
await service.find({ query: { $search: 'price:[100 TO 500]' } });
```

Configure a default search strategy via `defaultSearch`:

```typescript
const service = new SolrService({
  host: 'http://localhost:8983/solr',
  core: 'products',
  defaultSearch: {
    defType: 'edismax',
    qf: 'name^10 description^5 category^2',
    mm: '2<99% 7<80%'
  }
});
```

### Faceting (`$facet`)

`$facet` is forwarded to Solr's [JSON Facet API](https://solr.apache.org/guide/solr/latest/query-guide/json-facet-api.html). Requires `allowRawSolrParams: true` or an entry for `$facet` in `allowedRawSolrParams` (see [Security](#security)).

```typescript
const result = await service.find({
  query: {
    $facet: {
      price_min: 'min(price)',
      price_max: 'max(price)',
      price_ranges: {
        type: 'range',
        field: 'price',
        start: 0,
        end: 1000,
        gap: 100
      },
      categories: {
        type: 'terms',
        field: 'category'
      }
    }
  }
});
```

The Solr facet response is exposed as `result.facets`:

```jsonc
{
  "QTime": 4,
  "total": 150,
  "limit": 10,
  "skip": 0,
  "data": [/* docs */],
  "facets": {
    "count": 150,
    "price_min": 29,
    "price_max": 999,
    "price_ranges": {
      "buckets": [
        { "val": 0,   "count": 45 },
        { "val": 100, "count": 62 }
      ]
    },
    "categories": {
      "buckets": [
        { "val": "electronics", "count": 89 },
        { "val": "accessories", "count": 61 }
      ]
    }
  }
}
```

#### Multi-select faceting

```typescript
await service.find({
  query: {
    $search: 'shoes',
    '{!tag=COLOR}color': 'Blue',
    $facet: {
      sizes:  { type: 'terms', field: 'size' },
      colors: { type: 'terms', field: 'color', domain: { excludeTags: 'COLOR' } },
      brands: { type: 'terms', field: 'brand' }
    }
  }
});
```

### Advanced Solr Parameters (`$params`)

> ⚠️ `$params` exposes Solr's full read API and must be enabled — see [Security](#security).

Use `$params` for spellchecking, suggesters, grouping, highlighting, MoreLikeThis, spatial search, and any other request handler parameter. Note that dotted Solr keys must be quoted in JavaScript object literals.

#### Spellcheck

```typescript
await service.find({
  query: {
    $search: 'jonh',
    $params: {
      defType: 'edismax',
      qf: 'name^10 city^5',
      'q.op': 'OR',
      sow: true,
      spellcheck: true,
      'spellcheck.accuracy': 0.7,
      'spellcheck.extendedResults': true,
      'spellcheck.collate': true,
      'spellcheck.count': 10
    }
  }
});
```

#### Suggester

The suggester is a Solr search component. Use a request handler that wires `suggest` and pass its parameters via `$params`:

```typescript
await service.find({
  query: {
    $params: {
      'suggest.q': 'jo',
      'suggest.cfq': 'city',
      'suggest.build': 'true'
    }
  }
});
```

#### Grouping

```typescript
await service.find({
  query: {
    $params: {
      group: true,
      'group.field': 'gender',
      'group.format': 'simple'
    }
  }
});
```

#### Highlighting

```typescript
await service.find({
  query: {
    $search: 'laptop',
    $params: {
      hl: true,
      'hl.fl': 'name,description',
      'hl.snippets': 3,
      'hl.fragsize': 150
    }
  }
});
```

#### MoreLikeThis

```typescript
await service.find({
  query: {
    $search: 'electronics',
    $params: {
      mlt: true,
      'mlt.fl': 'category,description',
      'mlt.mindf': 1,
      'mlt.mintf': 1
    }
  }
});
```

#### Spatial

```typescript
await service.find({
  query: {
    $select: ['*', 'score', '_dist_:geodist()'],
    $params: {
      sfield: 'location_p',
      pt: '40.649558,-73.991815',
      d: 50,
      distanceUnits: 'kilometers',
      sort: 'geodist() asc'
    }
  }
});
```

### Raw Filter Queries (`$filter`)

> ⚠️ `$filter` bypasses Feathers query parsing and must be enabled — see [Security](#security).

`$filter` is an array of raw Solr filter-query (`fq`) strings appended to the request:

```typescript
await service.find({
  query: {
    name: 'Alice',
    $filter: ['age:[18 TO 30]', 'city:London']
  }
});
```

---

## Security

### Query Escaping

By default the adapter escapes Solr query special characters in field values to prevent query-syntax injection.

```typescript
import { SolrService, solrEscape } from 'feathers-solr';

// Default (recommended) — solrEscape is applied to every field value
const service = new SolrService({
  host: 'http://localhost:8983/solr',
  core: 'products'
});

// Opt out (only do this if values are pre-validated)
const service = new SolrService({
  host: 'http://localhost:8983/solr',
  core: 'products',
  escapeFn: (key, value) => ({ key, value })
});

// Selective escaping
const service = new SolrService({
  host: 'http://localhost:8983/solr',
  core: 'products',
  escapeFn: (key, value) =>
    key === 'trusted_field' ? { key, value } : solrEscape(key, value)
});
```

### Raw Solr Parameter Gate

`$params`, `$facet`, and `$filter` give callers direct access to Solr's request API. They are **blocked by default** because untrusted input can craft expensive or unbounded queries. Opt in explicitly per service:

```typescript
// Allow only $facet
new SolrService({
  host: 'http://localhost:8983/solr',
  core: 'products',
  allowedRawSolrParams: ['$facet']
});

// Allow all raw params (server-side trust required)
new SolrService({
  host: 'http://localhost:8983/solr',
  core: 'products',
  allowRawSolrParams: true
});
```

Even with raw params allowed, restrict the keys that reach Solr with a Feathers hook:

```typescript
import { BadRequest } from '@feathersjs/errors';

app.service('products').hooks({
  before: {
    find: [
      (context) => {
        const allowed = ['defType', 'qf', 'hl', 'spellcheck'];
        const params = context.params.query?.$params;
        if (!params) return context;

        const blocked = Object.keys(params).filter((k) => !allowed.includes(k));
        if (blocked.length) {
          throw new BadRequest(`Blocked params: ${blocked.join(', ')}`);
        }
        return context;
      }
    ]
  }
});
```

---

## Error Handling

Solr HTTP errors are thrown as `SolrHttpError` with the status code, parsed body, and request URL (credentials stripped):

```typescript
import { SolrHttpError } from 'feathers-solr';
import { BadRequest } from '@feathersjs/errors';

try {
  await service.find({ query: { $search: 'badField:foo' } });
} catch (err) {
  if (err instanceof SolrHttpError) {
    console.error(err.statusCode, err.solrMessage, err.url, err.body);
  }
  throw err;
}

// Blocked raw param
try {
  await service.find({ query: { $params: { spellcheck: true } } });
} catch (err) {
  if (err instanceof BadRequest) {
    console.error('Configure allowedRawSolrParams or allowRawSolrParams.');
  }
  throw err;
}
```

| Property | Type | Description |
|----------|------|-------------|
| `statusCode` | `number` | HTTP status from Solr |
| `solrMessage` | `string \| undefined` | `error.msg` parsed from the Solr response, when present |
| `body` | `object \| string` | Parsed JSON body, or the raw string for non-JSON responses |
| `url` | `string` | Request URL with credentials stripped |

---

## Performance

### Connection pooling

The adapter uses an HTTP keep-alive agent per client (`maxSockets: 64`, `keepAliveMsecs: 30000`). Override it via `requestOptions.agent`:

```typescript
import http from 'http';

const agent = new http.Agent({
  keepAlive: true,
  maxSockets: 128,
  keepAliveMsecs: 60000
});

new SolrService({
  host: 'http://localhost:8983/solr',
  core: 'products',
  requestOptions: { agent }
});
```

### Bulk operations

Service methods perform an extra read after writes so callers receive the affected documents. For high-volume ingestion or deletes, use `httpClient` directly to skip the round-trip:

```typescript
import { httpClient } from 'feathers-solr';

const client = httpClient('http://localhost:8983/solr');

// Bulk create
await client.post('/products/update/json', {
  data: [
    { id: '1', name: 'Product 1' },
    { id: '2', name: 'Product 2' }
  ]
});

// Bulk delete by query
await client.post('/products/update/json', {
  data: { delete: [{ query: 'category:discontinued' }] }
});
```

### Commit strategy

```typescript
new SolrService({
  host: 'http://localhost:8983/solr',
  core: 'products',
  commit: {
    softCommit: true,
    commitWithin: 5000,
    overwrite: true
  }
});
```

### Field projection

Always pass `$select` when you don't need every field:

```typescript
await service.find({
  query: { $select: ['id', 'name', 'price'] }
});
```

---

## HTTP Authentication

Two equivalent ways to attach Basic auth:

```typescript
// 1. In the host URL
new SolrService({
  host: 'http://user:password@solr.internal:8983/solr',
  core: 'products'
});

// 2. Via requestOptions.auth
new SolrService({
  host: 'https://solr.internal:8983/solr',
  core: 'products',
  requestOptions: { auth: 'user:password' }
});
```

Both produce an `Authorization: Basic <base64>` header. Credentials embedded in the URL are stripped before the request is made and before any URL is logged.

---

## Managing Solr

`httpClient` can be used directly for administrative calls:

```typescript
import { httpClient } from 'feathers-solr';

const client = httpClient('http://localhost:8983/solr');

// Create a core
await client.post('/admin/cores', {
  params: {
    action: 'CREATE',
    name: 'mycore',
    instanceDir: 'data_driven_schema_configs'
  }
});

// Unload a core
await client.post('/admin/cores', {
  params: {
    action: 'UNLOAD',
    core: 'mycore',
    deleteInstanceDir: true
  }
});

// Add schema fields
await client.post('/mycore/schema', {
  data: {
    'add-field': [
      { name: 'title', type: 'string', stored: true },
      { name: 'price', type: 'pdouble', stored: true }
    ]
  }
});

// Configure a request handler
await client.post('/mycore/config', {
  data: {
    requestHandler: {
      name: '/select',
      class: 'solr.SearchHandler',
      defaults: { echoParams: 'explicit' }
    }
  }
});
```

See [test/additional.test.ts](test/additional.test.ts) for end-to-end examples.

---

## Links

- [Changelog](CHANGELOG.md)
- [Contributing](CONTRIBUTING.md)
- [GitHub Issues](https://github.com/sajov/feathers-solr/issues)
- [Feathers documentation](https://docs.feathersjs.com/)
- [Apache Solr Reference Guide](https://solr.apache.org/guide/solr/latest/)

---

## License

Copyright (c) 2015-2026

Licensed under the [MIT License](LICENSE).
