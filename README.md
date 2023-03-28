# feathers-solr

[![CI](https://github.com/feathersjs/feathers/workflows/CI/badge.svg)](https://github.com/feathersjs/feathers/actions?query=workflow%3ACI)
[![Coverage Status](https://coveralls.io/repos/github/sajov/feathers-solr/badge.svg?branch=master)](https://coveralls.io/github/sajov/feathers-solr?branch=master)
[![Known Vulnerabilities](https://snyk.io/test/npm/feathers-solr/badge.svg)](https://snyk.io/test/npm/feathers-solr)
[![Download Status](https://img.shields.io/npm/dm/feathers-solr.svg?style=flat-square)](https://www.npmjs.com/package/feathers-solr)

A [Feathers](https://feathersjs.com/) Solr Adapter. Tested with Solr 8.x, require at least >= Solr 5.x.


## Installation

```
$ npm install feathers-solr --save
```

> __Important:__ `@feathersjs/memory` implements the [Feathers Common database adapter API](https://docs.feathersjs.com/api/databases/common.html) and [querying syntax](https://docs.feathersjs.com/api/databases/querying.html).
> It use sthe native node `http` and `https` module.

## API

### `service([options])`

Returns a new service instance initialized with the given options.

```js
const service = require('feathers-solr');
app.use('/search', service({host, core}));
```


**Options:**

- `host` - The name of the Solr core / collection.
- `core` - The name of the Solr core / collection.
- `events` (*optional*) - A list of [custom service events](https://docs.feathersjs.com/api/events.html#custom-events) sent by this service
- `paginate` (*optional*) - A [pagination object](https://docs.feathersjs.com/api/databases/common.html#pagination) containing a `default` and `max` page size
- `whitelist` (*DEPRECATED*) - renamed to `allow`
- `allow` (*optional*) - A list of additional query parameters to allow
- `multi` (*optional*) - Allow `create` with arrays and `update` and `remove` with `id` `null` to change multiple items. Can be `true` for all methods or an array of allowed methods (e.g. `[ 'remove', 'create' ]`)
- `id` (*optional*, default: `'id'`) - The name of the id field property.
- `commitStrategy` - (*optional*, default: `{ softCommit: true, commitWithin: 10000, overwrite: true }`) - Define how Index changes are stored [Solr Commits](https://lucene.apache.org/solr/guide/7_7/updatehandlers-in-solrconfig.html#UpdateHandlersinSolrConfig-commitandsoftCommit).
- `defaultParams` (*optional* default: `{ echoParams: 'none' }`)- This params added to all Solr request.
- `defaultSearch` - (*optional*, default: `{ defType: 'edismax', qf: 'name^10 age^1 gender' }`) - Search strategy if query contains the param `$search` [The Extended DisMax Query Parser](https://lucene.apache.org/solr/guide/6_6/the-extended-dismax-query-parser.html).
- `queryHandler` (*optional* default: `'/query'`) - This params defines the Solr request handler to use.
- `updateHandler` (*optional* default: `'/update/json'`) - This params defines the Solr update handler to use.
- `createUUID` (*optional* default: `true`) - This params add aa UUID if not exist on data. Id's generated by `crypto`
- `escapeFn` (*optional* default: `(key: string, value: any) => { key, value }`) - To apply escaping.
- `requestOptions` (*optional* default: `{ timeout: 10 })` - The [options](https://nodejs.org/api/http.html#httprequestoptions-callback) passed to `http.request`.

## Getting Started

The following example will create a Service with the name and endpoint `solr`.

```javascript
const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const socketio = require('@feathersjs/socketio');

const Service = require('feathers-solr').Service;

// Create an Express compatible Feathers application instance.
const app = express(feathers());
// Turn on JSON parser for REST services
app.use(express.json());
// Turn on URL-encoded parser for REST services
app.use(express.urlencoded({ extended: true }));
// Enable REST services
app.configure(express.rest());
// Set up default error handler
app.use(express.errorHandler());

// Create a service
const options = {
  host: 'http://localhost:8983/solr',
  core: 'gettingstarted',
  paginate: {},
  events: ['testing']
};
app.use('gettingstarted', new Service(options));

// Start the server.
const port = 3030;

app.listen(port, () => {
  console.log(`Feathers server listening on port ${port}`)
});
```

Start Solr

```bash
 bin/solr start -e gettingstarted
```

Run the example with `node app` and go to [localhost:3030/gettingstarted](http://localhost:3030/gettingstarted).

## Querying

Feathers Docs [Database Querying](https://docs.feathersjs.com/api/databases/querying.html)

## Supported Solr specific queries

This Adapter uses the Solr [JSON Request API](https://lucene.apache.org/solr/guide/7_7/json-request-api.html).

The following params passed in raw to Solr. This gives the **full** access to the Solr [JSON Request API](https://lucene.apache.org/solr/guide/7_7/json-request-api.html).

- \$search (alias to query)
- \$params (alias to params)
- \$facet (alias to facet)
- \$filter (alias to filter)

To avoid full query (read) access, just whitelist only `$search` and add your query strategy into a Hook.

### \$search

An alias to Solr param `query` (string) - [Solr Schemaless Mode](https://lucene.apache.org/solr/guide/7_7/schemaless-mode.html)

#### Simple Search in default field \_text\_.

```javascript
query: {
  $search: 'John';
}
```

[The Standard Query Parser](https://lucene.apache.org/solr/guide/7_7/the-standard-query-parser.html) - Some Search Examples:

- Exact match: `{ $search: "John" }`
- Fuzzy match: `{ $search: "John~" }`
- Phrase match: `{ $search: "John Doe" }`
- Starts with: `{ $search: "Jo*" }`
- Ends with: `{ $search: "*n" }`
- Contains: `{ $search: "(John AND Doe)" }`
- Contain one: `{ $search: "(John OR Doe)" }`

#### Define a default search query.

```javascript
service.options.defaultSearch = {
  defType: 'edismax',
  qf: 'name^10 age^1 gender'
};

const response = await service.find({
  query: {
    $search: 'Doug 20 male'
  }
});
```

> See `$parmas` example how query advanced search

### \$facet

An alias to Solr param `facet`

- [Solr Facet Functions and Analytics](http://yonik.com/solr-facet-functions/)
- [Multi Select Faceting](http://yonik.com/multi-select-faceting/)

#### Get Min, Max and a Range Facet

```javascript
query: {
    $facet: {
        age_min : "min(age)",
        age_max : "max(age)",
        age_ranges: {
            type: "range",
            field: "age",
            start: 0,
            end: 100,
            gap: 10
        }
    }
}
```

The response should look like this:

```javascript
{
    QTime: 0,
    total: 50,
    limit: 10,
    skip: 0,
    data: [...],
    facet: {
        age_min: 1,
        age_max: 104,
        count: 54,
        age_ranges: {
            buckets: [{
                val: 0,
                count: 4
            }, {
                val: 25,
                count: 17
            }, {
                val: 50,
                count: 15
            }, {
                val: 75,
                count: 14
            }]
        }
    }
}

```

#### Get a Range Multi Facet

```Javascript
query:{
  $search:'blue',
  '{!tag=COLOR}color':'Blue',
  $facet:{
      sizes:{type:terms, field:size},
      colors:{type:terms, field:color, domain:{excludeTags:COLOR} },
      brands:{type:terms, field:brand, domain:{excludeTags:BRAND}
  }
}

```

### \$params

An alias to Solr param `params`. Allows you to access all Solr query (read) features like:

- [The Extended DisMax (eDismax) Query Parser](https://lucene.apache.org/solr/guide/7_7/the-extended-dismax-query-parser.html)
- [Facet & Analytics Module](https://lucene.apache.org/solr/guide/7_7/json-facet-api.html)
- [Spell Checking](https://lucene.apache.org/solr/guide/7_7/spell-checking.html)
- [Highlighting](https://lucene.apache.org/solr/guide/7_7/highlighting.html)
- [Suggester](https://lucene.apache.org/solr/guide/7_7/suggester.html)
- [MoreLikeThis](https://lucene.apache.org/solr/guide/7_7/morelikethis.html)

#### Spellchecker - [Solr Spell Checking](https://lucene.apache.org/solr/guide/7_7/spell-checking.html)

```javascript
const response = await service.find({
  query: {
    $search: 'John !Doe +age:[80 TO *]',
    $params: {
      'defType': 'edismax',
      'qf': 'name^10 city^5 age',
      'mm': '2<99% 7<80% 10<50%',
      'q.op': 'OR',
      'sow': true,
      'spellcheck': true,
      'spellcheck.accuracy': 0.7,
      'spellcheck.extendedResults': true,
      'spellcheck.collate': true,
      'spellcheck.count': 10,
      'spellcheck.maxCollations': 1,
      'spellcheck.maxCollationTries': 10,
      'spellcheck.collateExtendedResults': true,
      'spellcheck.onlyMorePopular': true,
      'spellcheck.dictionary': 'LANG_X_text_spell_token'
    }
  }
});
```

#### Suggester - [Solr Suggester](https://lucene.apache.org/solr/guide/7_7/suggester.html)

```javascript
const response = await service.find({
  query: {
    $suggest: 'john'
  }
});
```

#### Grouping - [Solr Result Grouping](https://lucene.apache.org/solr/guide/7_7/result-grouping.html)

```javascript
const response = await service.find({
  query: {
    $params: {
      'group': true,
      'group.field': 'gender',
      'group.format': 'simple'
    }
  }
});
```

#### Highlight - [Solr Highlighting](https://lucene.apache.org/solr/guide/7_7/highlighting.html)

```Javascript
const response = await service.find({
  query: {
    $search: 'doug',
    $params: {
      'hl': true,
      'hl.field': 'name'
    }
  },
  paginate: { max: 10, default: 3 }
});

```

#### MoreLikeThis - [Solr MoreLikeThis](https://lucene.apache.org/solr/guide/7_7/morelikethis.html)

```Javascript
const response = await service.find({
  query: {
    $search: 'male',
    $params: {
      'mlt': true,
      'mlt.fl': 'gender'
    }
  },
  paginate: { max: 10, default: 3 }
});
```

#### Spartial - [Solr Spatial Search](https://lucene.apache.org/solr/guide/7_7/spatial-search.html)

```Javascript
const response = await service.find({
  query: {
    $select: ['*', 'score', '_dist_:geodist()'],
    $params: {
      'sfield': 'location_p',
      'pt': '40.649558, -73.991815',
      d: 50,
      distanceUnits: 'kilometers',
      sort: 'geodist() asc'
   }
  },
  paginate: { max: 10, default: 3 }
});
```

### \$filter

An alias to Solr `filter` passed in raw. It's recomanded to go with the common [Querying](https://docs.feathersjs.com/api/databases/querying.html).

> See more query variants [JSON Facet API](http://yonik.com/json-facet-api/),[Solr Facet Functions and Analytics](http://yonik.com/solr-facet-functions/), [Solr Subfacets](http://yonik.com/solr-subfacets/), [Multi-Select Faceting](http://yonik.com/multi-select-faceting/)

## Service Methods

All service methods provide the `multi` options.

### Service.create

The `options.commitStrategy.override` is true in default. This allow to override an existing `id` by `service.create`.
Add the field `_version_` to the `$select` params will return the document content with its version. Create with an existing `id` and `_version_` for [optimistic concurrency](https://lucene.apache.org/solr/guide/6_6/updating-parts-of-documents.html#UpdatingPartsofDocuments-OptimisticConcurrency)

### Service.update

Will overide the complete Document. If the `_version_` field is part of update content, it will be removed.

### Service.patch

Use the Solr [Updating Parts of Documents](https://lucene.apache.org/solr/guide/7_7/updating-parts-of-documents.html)

Simple usage

```Javascript
service.patch(id, {age: 30});
```

[Atomic Updates](https://lucene.apache.org/solr/guide/7_7/updating-parts-of-documents.html#atomic-updates) - Increment field `age + 1`

```Javascript
service.patch(id, {age: {inc:1}});
```

All Solr methods provided:

- `set` - Set or replace the field value(s) with the specified value(s), or remove the values if 'null' or empty list is specified as the new value. May be specified as a single value, or as a list for multiValued fields.
- `add` - Adds the specified values to a multiValued field. May be specified as a single value, or as a list.
- `add-distinct` - Adds the specified values to a multiValued field, only if not already present. May be specified as a single value, or as a list.
- `remove` - Removes (all occurrences of) the specified values from a multiValued field. May be specified as a single value, or as a list.
- `removeregex` - Removes all occurrences of the specified regex from a multiValued field. May be specified as a single value, or as a list.
- `inc` - Increments a numeric value by a specific amount. Must be specified as a single numeric value.

### Service.remove

Provide delete by `id` ans `query`
Delete all documents at once:

```Javascript
service.remove(null, {});
```

### Performance considerations

Data mutating operations in Solr do not return document data. This is implemented as additional queries to return deletd or modified data.

To avoid this overhead use the `client` directly for bulk operations.
```js
const options = {
  host: 'http://localhost:8983/solr',
  core: 'gettingstarted',
}

const client = solrClient('http://localhost:8983/solr');

await client.post('/update/json', { data: [] })
```

## Maniging Solr

Using the `solrClient` for raw communication with solr.
See adapter [test]('//test/../../test/additional.test.ts') how to:
-  `create` and `delete` a Solr core
-  `add`, 'update' and `delete` the Solr core schema
-  `add` and `delete` the Solr core config request handler and components

```js
const options = {
  host: 'http://localhost:8983/solr',
  core: 'gettingstarted',
}

const client = solrClient('http://localhost:8983/solr');
await client.post('/admin/cores', { params: {...createCore, name: name} })
await client.post(`/${core}/schema`, { data: addSchema });
await client.post(`/${core}/config`, { data: addConfig });

```

## License

Copyright (c) 2022

The MIT License (MIT)

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
