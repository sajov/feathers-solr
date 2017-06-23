'use strict';

export function definitionParser(type, fields) {

  let definition = [];

  Object.keys(fields).forEach(function(field, i) {

    let solrField = {
       'name':field,
       'type': fields[field].type || 'strings',
       'stored':fields[field].stored || true,
       'indexed':fields[field].indexed || true
    };

    if(fields[field].default || fields[field].defaultValue) {
        solrField.default = fields[field].default || fields[field].defaultValue;
    }

    // 'docValues':fields[field].docValues,
    // 'sortMissingFirst':fields[field].sortMissingFirst,
    // 'sortMissingLast':fields[field].sortMissingLast,
    // 'multiValued':fields[field].multiValued,
    // 'omitNorms':fields[field].omitNorms,
    // 'omitTermFreqAndPositions':fields[field].omitTermFreqAndPositions,
    // 'omitPositions':fields[field].omitPositions,
    // 'termVectors':fields[field].termVectors,
    // 'termPositions':fields[field].termPositions,
    // 'termOffsets':fields[field].termOffsets,
    // 'termPayloads':fields[field].termPayloads,
    // 'required':fields[field].required,
    // 'useDocValuesAsStored':fields[field].useDocValuesAsStored,
    // 'large':fields[field].large,


    // if(fields[field].stored)

    definition.push(solrField);
  });
  return definition;
}
