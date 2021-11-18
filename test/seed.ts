export const addSchema = {
  "add-field-type": {
    "name": "text_auto",
    "class": "solr.TextField",
    "positionIncrementGap": "100",
    "analyzer": {
      "tokenizer": {
        "class": "solr.WhitespaceTokenizerFactory"
      },
      "filters": [
        {
          "class": "solr.WordDelimiterFilterFactory",
          "generateWordParts": "1",
          "generateNumberParts": "1",
          "catenateWords": "1",
          "catenateNumbers": "1",
          "catenateAll": "1",
          "splitOnCaseChange": "1"
        },
        {
          "class": "solr.LowerCaseFilterFactory"
        }
      ]
    }
  },
  "add-field": [
    {
      "name": "name",
      "type": "text_auto",
      "multiValued": false,
      "indexed": true,
      "stored": true
    },
    {
      "name": "autocomplete",
      "type": "text_auto",
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
      "name": "gender",
      "type": "text_general",
      "multiValued": false,
      "indexed": true,
      "stored": true
    }
  ]
};

export const deleteSchema = {
  "delete-copy-field": [{ "source": "name", "dest": "name_str" }, { "source": "gender" , "dest": "gender_str"}],
  "delete-field": [{ "name": "name" }, { "name": "age" }, { "name": "gender" },
  //  { "name": "autocomplete" }
  ],
  // "delete-field-type": { "name": "text_auto" }
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

export const mochData = [
  {
    name: 'Alice',
    age: 20,
    gender: 'female'
  },
  {
    name: 'Junior',
    age: 10,
    gender: 'male'
  },
  {
    name: 'Doug',
    age: 30,
    gender: 'male'
  }
];
