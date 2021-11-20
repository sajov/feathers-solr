export const addSchema = {
  // "add-field-type": {
  //   "name": "text_auto",
  //   "class": "solr.TextField",
  //   "positionIncrementGap": "100",
  //   "analyzer": {
  //     "tokenizer": {
  //       "class": "solr.WhitespaceTokenizerFactory"
  //     },
  //     "filters": [
  //       {
  //         "class": "solr.WordDelimiterFilterFactory",
  //         "generateWordParts": "1",
  //         "generateNumberParts": "1",
  //         "catenateWords": "1",
  //         "catenateNumbers": "1",
  //         "catenateAll": "1",
  //         "splitOnCaseChange": "1"
  //       },
  //       {
  //         "class": "solr.LowerCaseFilterFactory"
  //       }
  //     ]
  //   }
  // },
  "add-field": [
    {
      "name": "name",
      "type": "string",
      "multiValued": false,
      "indexed": true,
      "stored": true
    },
    {
      "name": "age",
      "type": "pint",
      "multiValued": false,
      "indexed": true,
      "stored": true
    },
    {
      "name": "created",
      "type": "boolean",
      "multiValued": false,
      "indexed": true,
      "stored": true
    }
  ]
};


// Herr Balknight,


export const deleteSchema = {
  // "delete-copy-field": [
  //   { "source": "gender" , "dest": "gender_str"}
  // ],
  "delete-field": [
    { "name": "name" },
    { "name": "age" },
    { "name": "created" }
  ]

};

export const addConfig = {
  "add-searchcomponent": {
    "name": "suggest",
    "class": "solr.SuggestComponent",
    "suggester": {
      "name": "suggest",
      "lookupImpl": "FuzzyLookupFactory",
      "dictionaryImpl": "DocumentDictionaryFactory",
      "field": "name",
      "suggestAnalyzerFieldType": "string",
      "buildOnStartup": "true",
      "buildOnCommit": "true"
    }
  },
  "add-requesthandler": {
    "startup": "lazy",
    "name": "/suggest",
    "class": "solr.SearchHandler",
    "defaults": {
      "suggest": "true",
      "suggest.count": 10,
      "suggest.dictionary": "suggest",
      "spellcheck": "on",
      "spellcheck.count": 10,
      "spellcheck.extendedResults": "true",
      "spellcheck.collate": "true",
      "spellcheck.maxCollations": 10,
      "spellcheck.maxCollationTries": 10,
      "spellcheck.accuracy": 0.003
    },
    "components": [
      "spellcheck",
      "suggest"
    ]
  }
};

export const deleteConfig = { "delete-requesthandler": "/suggest", "delete-searchcomponent": "suggest" };

export const mockData = [
  {
    id:"1",
    name:"Mike",
    age:10
  },
  {
    id:"2",
    name:"Alice",
    age:19
  },
  {
    id:"3",
    name:"John",
    age:99
  }
];
