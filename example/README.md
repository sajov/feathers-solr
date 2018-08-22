# Example
[http://www.json-generator.com/](http://www.json-generator.com/)
## example data schema
```
[
  '{{repeat(50)}}',
  {
    id: '{{objectId()}}',
    index_i: '{{index()}}',
    text_ngram:'Ines Dudley seidenwesten',
    name: 'Ines Dudley seidenwesten',
    name_s: 'Ines Dudley seidenwesten',
    name_text_de: 'Ines Dudley seidenwesten',
    guid_s: '{{guid()}}',
    isActive_bs: '{{bool()}}',
    balance: '{{floating(1000, 4000, 2, "$0,0.00")}}',
    picture: 'http://placehold.it/32x32',
    age: '{{integer(18, 99)}}',
    age_i: '{{integer(20, 40)}}',
    colorolor: '{{random("blue", "brown", "green")}}',
    name: '{{firstName()}} {{surname()}}',
    gender: '{{gender()}}',
    company: '{{company().toUpperCase()}}',
    email: '{{email()}}',
    phone: '+1 {{phone()}}',
    address: '{{integer(100, 999)}} {{street()}}, {{city()}}, {{state()}}, {{integer(100, 10000)}}',
    about: '{{lorem(1, "paragraphs")}}',
    registered_dts: '{{date(new Date(2014, 0, 1), new Date(), "YYYY-MM-ddThh:mm:ss")}}Z',
    favoriteFruit_ss: function (tags) {
      var fruits = ['apple', 'banana', 'strawberry'];
      return fruits[tags.integer(0, fruits.length - 1)];
    }
  }
]
```