# AGENTS.md - Development Guidelines for feathers-solr

## Build & Development Commands

### Build
```bash
npm run build          # Compile TypeScript to lib/
npm run prepare        # Runs build (git hook)
```

### Lint
```bash
npm run lint           # Lint src/**/*.ts
npm run lint:test      # Lint test/**/*.ts
```

### Test
```bash
npm test               # Build + run all tests
npm run mocha          # Run tests only (no build)
npm run coverage       # Run tests with coverage report
```

### Run Single Test
```bash
# Run specific test file
npm run mocha -- test/adapter.test.ts

# Run tests matching pattern
npm run mocha -- --grep "pattern"

# Run with specific reporter
npm run mocha -- --reporter spec
```

## Code Style Guidelines

### TypeScript Configuration
- **Target**: ES2018
- **Module**: CommonJS
- **Strict mode**: Enabled (strictNullChecks: false)
- **No unused**: Locals and parameters enforced
- **No implicit returns**: Enforced

### Formatting (Prettier)
- **Print width**: 150 characters
- **Indent**: 2 spaces (no tabs)
- **Semicolons**: Required
- **Quotes**: Single quotes
- **Trailing commas**: None
- **Arrow parens**: Avoid when possible
- **Line endings**: LF

### Imports
- Order: External packages first, then local imports
- Use named imports from @feathersjs packages
- Local imports use relative paths with `.ts` extension
- Example:
  ```typescript
  import { _ } from '@feathersjs/commons'
  import { SolrAdapter } from './adapter'
  import { filterResolver } from './utils/filterResolver'
  ```

### Naming Conventions
- **Classes**: PascalCase (e.g., `SolrAdapter`, `SolrService`)
- **Interfaces/Types**: PascalCase (e.g., `SolrAdapterOptions`, `SolrQuery`)
- **Functions/Methods**: camelCase (e.g., `filterQuery`, `_getOrFind`)
- **Variables**: camelCase (e.g., `dataToDelete`, `queryHandler`)
- **Constants**: camelCase or UPPER_CASE for true constants
- **Private methods**: Prefix with underscore (e.g., `_find`, `_create`)
- **Files**: camelCase matching exported class/function name

### Error Handling
- Use Feathers error classes from `@feathersjs/errors`
- Common errors: `NotFound`, `BadRequest`, `MethodNotAllowed`
- Throw errors for invalid states (empty data, missing records, etc.)
- Example:
  ```typescript
  if (id === null && !this.allowsMulti('remove', params)) {
    throw new MethodNotAllowed('Can not remove multiple entries')
  }
  ```

### Code Patterns
- **Array type syntax**: Use `T[]` not `Array<T>` (ESLint rule)
- **No public accessibility**: Omit `public` modifier (explicit-member-accessibility: no-public)
- **No unused expressions**: Enforced
- **Prefer const**: Use `const` over `let` when possible
- **No var**: `var` is forbidden
- **Object shorthand**: Use when possible
- **Equality**: Use `===` and `!==` (eqeqeq: smart)

### Method Signatures
- Use explicit return types
- Use method overloading for multiple signatures
- Example:
  ```typescript
  async _find(params?: ServiceParams & { paginate?: PaginationOptions }): Promise<Paginated<Result>>
  async _find(params?: ServiceParams & { paginate: false }): Promise<Result[]>
  async _find(params?: ServiceParams): Promise<Paginated<Result> | Result[]>
  ```

### Comments & Documentation
- No console.log in production code (ESLint error)
- Use JSDoc style for public APIs
- Single-line comments with `//`
- Spaced comments required (spaced-comment: always)

### Testing
- Test files: `*.test.ts` extension
- Test framework: Mocha with ts-node
- Use assert module for assertions
- Test files located in `test/` directory
- Timeout: 20000ms (configured in .mocharc.json)

## Project Structure
```
feathers-solr/
├── src/                    # Source code
│   ├── adapter.ts          # Main SolrAdapter class
│   ├── httpClient.ts       # HTTP client + SolrHttpError
│   ├── index.ts            # Public exports (SolrService, SolrAdapter, SolrHttpError, solrEscape, ...)
│   └── utils/              # Utility functions
│       ├── addIds.ts
│       ├── convertOperators.ts   # Feathers query → Solr filter strings
│       ├── filterResolver.ts     # $search/$select/$limit/$skip/$sort handling
│       ├── operatorResolver.ts   # $eq/$ne/$in/... → Solr syntax
│       └── solrEscape.ts         # Default escapeFn
├── test/                   # Test files
│   ├── seed/               # Test data setup
│   ├── adapter.test.ts     # Integration tests (require running Solr)
│   ├── client.test.ts      # Integration tests (require running Solr)
│   ├── filterQuery.test.ts # Pure unit tests for query building
│   ├── httpClient.test.ts  # Pure unit tests for httpClient (in-process server)
│   └── utils.test.ts       # Pure unit tests for utils
├── lib/                    # Compiled output (gitignored)
└── package.json
```

### Tests requiring Solr vs. unit tests

`adapter.test.ts` and `client.test.ts` need a running Solr 9 instance and create/destroy cores. The other three test files (`filterQuery`, `httpClient`, `utils`) are pure unit tests and run without Solr - useful for fast feedback when iterating on query building, escaping or HTTP client behaviour.

```bash
# Unit tests only (no Solr required)
npx mocha test/utils.test.ts test/filterQuery.test.ts test/httpClient.test.ts
```

## Security defaults (since 3.2)

- **`escapeFn`** defaults to `solrEscape`, which escapes Solr query-parser special chars on string values. Override only if you know your input is already escaped, or to opt out: `escapeFn: (key, value) => ({ key, value })`.
- **Raw Solr query keys** (`$params`, `$facet`, `$filter`) are gated. Set `allowedRawSolrParams: ['$facet']` per key, or `allowRawSolrParams: true` to disable the gate.
- **Errors** from Solr are thrown as `SolrHttpError` with `statusCode`, `solrMessage`, `body` and `url`.
- **HTTP keep-alive** is on by default (per-client agent, `maxSockets: 64`). Override via `requestOptions.agent`.
- **HTTP basic auth**: pass credentials in the host URL or as `requestOptions.auth: 'user:pw'`.

## ESLint Rules Summary
- No unused locals/parameters
- No explicit any (disabled for this project)
- Prefer for-of loops
- No empty interfaces
- No namespace keyword
- Single quotes enforced
- No trailing spaces
- Object shorthand required
- One variable per declaration

## Git Workflow
- Do not commit unless explicitly requested
- Verify changes with `git status` and `git diff` before committing
- Follow conventional commit messages
