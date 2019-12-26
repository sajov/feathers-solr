# feathers-solr

[![Build Status](https://travis-ci.org/sajov/feathers-solr.png?branch=feature/refactor)](https://travis-ci.org/sajov/feathers-solr)
[![Coverage Status](https://coveralls.io/repos/github/sajov/feathers-solr/badge.svg?branch=feature/refactor)](https://coveralls.io/github/sajov/feathers-solr?branch=feature/refactor)
[![dependencies Status](https://david-dm.org/sajov/feathers-solr/status.svg)](https://david-dm.org/sajov/feathers-solr)
[![Known Vulnerabilities](https://snyk.io/test/npm/feathers-solr/badge.svg)](https://snyk.io/test/npm/feathers-solr)

A [Feathers](https://feathersjs.com/) Solr Adapter.

```
$ npm install feathers-solr --save
```

> **Important:** `feathers-solr` implements the [Feathers Common database adapter API](https://docs.feathersjs.com/api/databases/common.html) and [querying syntax](https://docs.feathersjs.com/api/databases/querying.html).

Install a supported HTTP Client [Fetch](https://github.com/bitinn/node-fetch), [Undici](https://github.com/mcollina/undici) or [use a different HTTP Client](https://github.com/sajov/feathers-solr/tree/feature/refactor#use-a-different-http-client).

```
$ npm install node-fetch --save
```

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
- `commitStrategy` - (_optional_, default: `{ softCommit: true, commitWithin: 10000,overwrite: true }`) - Define how Index changes are stored [Solr Commits](https://lucene.apache.org/solr/guide/7_7/updatehandlers-in-solrconfig.html#UpdateHandlersinSolrConfig-commitandsoftCommit).
- `schema` (_optional_) - .
- `migrate` (_optional_) - .
- `id` (_optional_, default: `'id'`) - The name of the id field property.
- `events` (_optional_) - A list of [custom service events](https://docs.feathersjs.com/api/events.html#custom-events) sent by this service
- `paginate` (_optional_) - A [pagination object](https://docs.feathersjs.com/api/databases/common.html#pagination) containing a `default` and `max` page size
- `whitelist` (_optional_) - A list of additional query parameters to allow
- `multi` (_optional_) - Allow `create` with arrays and `update` and `remove` with `id` `null` to change multiple items. Can be `true` for all methods or an array of allowed methods (e.g. `[ 'remove', 'create' ]`)

## Example

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
app.use('fetch', new Service(options));

app.listen(3030, () => {
  console.log(`Feathers server listening on port http://127.0.0.1:3030`);
});
```

### Install Solr

```
 bin/solr start -e gettingstarted
```

Use `feathers-solr/bin/install-solr.sh` for a kickstart installation.

Run the example with `node app` and go to [localhost:3030/gettingstarted](http://localhost:3030/gettingstarted).

## Querying

Feathers Docs [Database Querying](https://docs.feathersjs.com/api/databases/querying.html)

## Additional Query Params

This Adapter use the Solr [JSON Request API](https://lucene.apache.org/solr/guide/7_7/json-request-api.html).

The following params passed raw:

- \$search - Solr param `query`
- \$params - Solr param `params`
- \$facet - Solr param `facet`

## Examples

Get Min and Max - [Solr Facet Functions and Analytics](http://yonik.com/solr-facet-functions/)

query:

```javascript
 {
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

result:

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

Get a Range Facet - [Multi Select Faceting](http://yonik.com/multi-select-faceting/)

query:

```Javascript
{
  $search:'blue',
  '{!tag=COLOR}color':'Blue',
  $facet:{
      sizes:{type:terms, field:size},
      colors:{type:terms, field:color, domain:{excludeTags:COLOR} },
      brands:{type:terms, field:brand, domain:{excludeTags:BRAND}
  }
}

```

See more query variants [JSON Facet API](http://yonik.com/json-facet-api/),[Solr Facet Functions and Analytics](http://yonik.com/solr-facet-functions/), [Solr Subfacets](http://yonik.com/solr-subfacets/), [Multi-Select Faceting](http://yonik.com/multi-select-faceting/)

## Adapter.patch

Support simple usage [Feathers Docs](https://docs.feathersjs.com/api/services.html#patchid-data-params)

```
data: {views: 1};
Adapter.patch(id, data, params);
```

Support also advanced Solr Atomic Field Update [Solr Docs](https://lucene.apache.org/solr/guide/6_6/updating-parts-of-documents.html)

```
data: {views: {inc:1}}; // inc, set, add, remove, removeregex
Adapter.patch(id, data, params);
```

## Use a different HTTP Client

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

## TODO

- Hook Examples
  - Schema Migration Hook (drop,alter,safe)
  - Json Hook Store Data as JSON
  - Validation Hook

## Changelog

**2.2.0**

- complete refactoring
- implement @feathers/adapter-tests

## License

Copyright (c) 2015

Licensed under the [MIT license](LICENSE).
