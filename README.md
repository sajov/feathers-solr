# feathers-solr

[![Build Status](https://travis-ci.org/sajov/feathers-solr.png?branch=master)](https://travis-ci.org/sajov/feathers-solr)
[![Coverage Status](https://coveralls.io/repos/github/sajov/feathers-solr/badge.svg?branch=master)](https://coveralls.io/github/sajov/feathers-solr?branch=master)
[![dependencies Status](https://david-dm.org/sajov/feathers-solr/status.svg)](https://david-dm.org/sajov/feathers-solr)
[![Known Vulnerabilities](https://snyk.io/test/npm/feathers-solr/badge.svg)](https://snyk.io/test/npm/feathers-solr)
[![Download Status](https://img.shields.io/npm/dm/feathers-solr.svg?style=flat-square)](https://www.npmjs.com/package/feathers-solr)

A [Feathers](https://feathersjs.com/) Solr Adapter. Require >= Solr 5.x

```
$ npm install feathers-solr --save
```

> **Important:** `feathers-solr` implements the [Feathers Common database adapter API](https://docs.feathersjs.com/api/databases/common.html) and [querying syntax](https://docs.feathersjs.com/api/databases/querying.html).

Install a supported HTTP Client [Fetch](https://github.com/bitinn/node-fetch), [Undici](https://github.com/mcollina/undici) or [use a different HTTP Client](https://github.com/sajov/feathers-solr/tree/master#use-a-different-http-client).

```
$ npm install node-fetch --save
```

> See this adapter in action [online demo](https://feathers.better-search-box.com)

## API

### `service([options])`

Returns a new service instance initialized with the given options.

```js
const service = require('feathers-solr');

app.use('/gettingstarted', service({ id, Model, events, paginate }));
```

**Options:**

- `Model` (**required**) - HTTP Client (fetch, undici, or your custom).
- `name` - The name of the Solr Core / Colelction.
- `defaultParams` - This params added to all Solr request.
- `id` (_optional_, default: `'id'`) - The name of the id field property.
- `commitStrategy` - (_optional_, default: `{ softCommit: true, commitWithin: 10000, overwrite: true }`) - Define how Index changes are stored [Solr Commits](https://lucene.apache.org/solr/guide/7_7/updatehandlers-in-solrconfig.html#UpdateHandlersinSolrConfig-commitandsoftCommit).
- `defaultSearch` - (_optional_, default: `{ defType: 'edismax', qf: 'name^10 age^1 gender' }`) - Search strategy if query contains the param `$search` [The Extended DisMax Query Parser](https://lucene.apache.org/solr/guide/6_6/the-extended-dismax-query-parser.html).
- `suggestHandler` - (_optional_, default: `suggest`) - Request a Solr Suggest Handler instead reggular a search if query contains the param `$suggest` [Suggester](https://lucene.apache.org/solr/guide/7_7/suggester.html).
- `events` (_optional_) - A list of [custom service events](https://docs.feathersjs.com/api/events.html#custom-events) sent by this service
- `paginate` (_optional_) - A [pagination object](https://docs.feathersjs.com/api/databases/common.html#pagination) containing a `default` and `max` page size
- `whitelist` (default: `['$search', '$params', '$facet', '$filter']`) [optional] - The list of additional non-standard query parameters to allow, by default populated with all Solr specific ones. You can override, for example in order to restrict access to some queries (see the [options documentation](https://docs.feathersjs.com/api/databases/common.html#serviceoptions)).
- `multi` (_optional_) - Allow `create` with arrays and `update` and `remove` with `id` `null` to change multiple items. Can be `true` for all methods or an array of allowed methods (e.g. `[ 'remove', 'create' ]`)

## Getting Started

The following example will create a Service with the name and endpoint `solr`.

```javascript
const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const fetch = require('node-fetch');
const undici = require('undici');
const Service = require('feathers-solr');
const { SolrClient } = require('feathers-solr');
const solrServer = 'http://localhost:8983/solr/gettingstarted';

// Create an Express compatible Feathers application instance.
const app = express(feathers());
// Turn on JSON parser for REST services
app.use(express.json());
// Turn on URL-encoded parser for REST services
app.use(express.urlencoded({ extended: true }));
// Enable REST services
app.configure(express.rest());
// Enable REST services

// init Adapter witch Fetch or Undici
const options = {
  Model: SolrClient(fetch, solrServer),
  paginate: {},
  events: ['testing']
};
app.use('gettingstarted', new Service(options));

app.listen(3030, () => {
  console.log(`Feathers server listening on port http://127.0.0.1:3030`);
});
```

Install Solr

```
 bin/solr start -e gettingstarted
```

Use `feathers-solr/bin/install-solr.sh` for a kickstart installation.

Run the example with `node app` and go to [localhost:3030/gettingstarted](http://localhost:3030/gettingstarted).

## Querying

Feathers Docs [Database Querying](https://docs.feathersjs.com/api/databases/querying.html)

## Supportet Solr specific queries

This Adapter use the Solr [JSON Request API](https://lucene.apache.org/solr/guide/7_7/json-request-api.html).

The following params passed in raw to Solr. This gives the **full** access to the Solr [JSON Request API](https://lucene.apache.org/solr/guide/7_7/json-request-api.html).

- \$search (alias to query)
- \$params (alias to params)
- \$facet (alias to facet)
- \$filter (alias to filter)

To avoid full query (read) access, just whitelist only `$search` and add your query startegy into a Hook.

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

A alias to Solr param `facet`

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

An alias to Solr param `params`. Allows you to access all solr query (read) features like:

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
Add the field `_version_` to the `$select` params will return the document content with it's version. Create with an existing `id` and `_version_` for [optimistic concurrency](https://lucene.apache.org/solr/guide/6_6/updating-parts-of-documents.html#UpdatingPartsofDocuments-OptimisticConcurrency)

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
service.remove(null, {query: {id:'*'}});
```

### Performance considerations

Most of the data mutating operations in Solr (create, update, remove) do not return the full resulting document, therefore I had to resolve to using get as well in order to return complete data. This solution is of course adding a bit of an overhead, although it is also compliant with the standard behaviour expected of a feathers database adapter.

> Use Raw Query `service.Model.post('update/json', data)` to avoid this overhead. The response is native Solr.

## Raw Solr Queries

You can access all Solr API endpoints by using a direct model usage.

Ping the Solr core/collection:

```Javascript
service.Model.get('admin/ping');
```

Get Solr schema information:

```Javascript
service.Model.get('schema');
```

Modify Solr schema:

```Javascript
service.Model.post('schema',{"add-field":{name:"age",type:"pint"}});
```

Get Solr config information:

```Javascript
service.Model.get('config');
```

Modify Solr config:

```Javascript
service.Model.post('config',{"add-requesthandler":{...}});
```

## Use a different HTTP Client

This Adapter offers a `node-fetch` interface for a maximum on HTTP Client comfort and `undici` for maximum (100% compared to node-fetch) in performance.
If you like to go with your favorite one:

```Javascript
class CustomClient {
  constructor(HTTPModule, conn) {}
  get(api, params = {}) {}
  post(api, data, params = {}) {}
};

const options = {
    Model: CustomClient(HTTPModule, solrServer),
    paginate: {},
    events: ['testing']
  };

app.service('solr', new Service(options))
```

## Contributing

If you find a bug or something to improve i will be happy to see your PR!

When adding a new feature, please make sure you write tests for it with decent coverage as well.

## TODO

- Hook Examples
  - Schema Migration Hook (drop,alter,safe)
  - Json Hook Store Data as JSON
  - Validation Hook
  - Spellcheck
  - Suggester
  - MoreLikeThis

## Changelog

**2.3.0**

**2.2.0**

- complete refactoring
- implement @feathers/adapter-tests

## License

Copyright (c) 2015

Licensed under the [MIT license](LICENSE).
