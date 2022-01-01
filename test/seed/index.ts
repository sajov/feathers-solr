// http://localhost:8983/solr/admin/cores?action=CREATE&name=test&config=solrconfig.xml&dataDir=data&configSet=_default
export const createCore = {
  'action': 'CREATE',
  'name': 'test',
  'config': 'solrconfig.xml',
  'dataDir': 'data',
  'configSet': '_default'
}

// http://localhost:8983/solr/admin/cores?action=UNLOAD&core=test&deleteIndex=true&deleteDataDir=true&deleteInstanceDir=true
export const deleteCore = {
  'action': 'UNLOAD',
  'core': 'test',
  'deleteIndex': true,
  'deleteDataDir': true,
  'deleteInstanceDir': true
}

export const addSchema = {
  // 'add-field-type': {
  //   'name': 'text_auto',
  //   'class': 'solr.TextField',
  //   'positionIncrementGap': '100',
  //   'analyzer': {
  //     'tokenizer': {
  //       'class': 'solr.WhitespaceTokenizerFactory'
  //     },
  //     'filters': [
  //       {
  //         'class': 'solr.WordDelimiterFilterFactory',
  //         'generateWordParts': '1',
  //         'generateNumberParts': '1',
  //         'catenateWords': '1',
  //         'catenateNumbers': '1',
  //         'catenateAll': '1',
  //         'splitOnCaseChange': '1'
  //       },
  //       {
  //         'class': 'solr.LowerCaseFilterFactory'
  //       }
  //     ]
  //   }
  // },
  'add-field': [
    {
      'name': 'name',
      'type': 'string',
      'multiValued': false,
      'indexed': false,
      'stored': true
    },
    {
      'name': 'city',
      'type': 'string',
      'multiValued': false,
      'indexed': false,
      'stored': true
    },
    {
      'name': 'age',
      'type': 'plong',
      'multiValued': false,
      'indexed': false,
      'stored': true
    },
    {
      'name': 'created',
      'type': 'boolean',
      'multiValued': false,
      'indexed': true,
      'stored': true
    }
  ],
  'add-copy-field': [
    { 'source': 'city', 'dest': '_text_' },
    { 'source': 'name', 'dest': '_text_' },
    { 'source': 'age', 'dest': '_text_' }
  ]
};

export const deleteSchema = {
  'delete-copy-field': [
    { 'source': 'city', 'dest': '_text_' },
    { 'source': 'name', 'dest': '_text_' },
    { 'source': 'age', 'dest': '_text_' }
  ],
  'delete-field': [
    { 'name': 'name' },
    { 'name': 'age' },
    { 'name': 'city' },
    { 'name': 'created' }
  ]

};

export const addConfig = {
  'add-searchcomponent': {
    'name': 'suggest',
    'class': 'solr.SuggestComponent',
    'suggester': {
      'name': 'suggest',
      'lookupImpl': 'FuzzyLookupFactory',
      'dictionaryImpl': 'DocumentDictionaryFactory',
      'field': '_text_',
      'suggestAnalyzerFieldType': 'text_general',
      'buildOnStartup': 'true',
      'buildOnCommit': 'true'
    }
  },
  'add-requesthandler': {
    'name': '/app',
    'class': 'solr.SearchHandler',
    'defaults': {
      'df': '_text_',
      "echoParams": "explicit",
      "wt": "json",
      "indent": "true",
      "terms": "true",
      "terms.fl": "city",
      'suggest': 'true',
      'suggest.count': 10,
      'suggest.dictionary': 'suggest',
      'spellcheck': 'on',
      'spellcheck.count': 10,
      'spellcheck.extendedResults': 'true',
      'spellcheck.collate': 'true',
      'spellcheck.maxCollations': 10,
      'spellcheck.maxCollationTries': 10,
      'spellcheck.accuracy': 0.003
    },
    'last-components': [
      'spellcheck',
      'suggest',
      'terms'
    ]
  }
};

export const deleteConfig = { 'delete-requesthandler': '/app', 'delete-searchcomponent': 'suggest' };

export const mockData = [
  {
    id: '1',
    name: 'Mike',
    city: 'New York',
    age: 10
  },
  {
    id: '2',
    name: 'Alice',
    city: 'London',
    age: 19
  },
  {
    id: '3',
    name: 'John',
    city: 'San Francisco',
    age: 99
  }
];
