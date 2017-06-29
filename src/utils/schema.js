'use strict';

import * as _ from './tools';

export function describeSchemaFields(fields) {

    let definition = [];
    Object.keys(fields).forEach(function(field, i) {

        let solrField = {
            'name': field,
            'type': 'string',
            'stored': true,
            'indexed': true,
            'multiValued': false
        };

        if(_.isObject(fields[field])) {
            solrField = Object.assign(solrField, fields[field]);
            if (fields[field].default || fields[field].defaultValue) {
                solrField.default = fields[field].default || fields[field].defaultValue;
            }
        } else {
            solrField.type = fields[field];
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

export function parseSchemaFields(fields) {

    let schemaFields = {};
    if (Array.isArray(fields)) {
        fields.forEach(function(field) {
            if (_.has(field, 'name')) {
                schemaFields[field.name] = _.omit(field, 'name');
            }
        });
    } else {
        schemaFields = fields;
    }
    return _.omit(schemaFields, 'id', '_root_', '_text_', '_version_');
}

export function deleteSchemaFields(fields) {

    let fieldsToDelete = [];
    fields = _.omit(fields, 'id', '_root_', '_text_', '_version_');
    Object.keys(fields).forEach(function(field, i) {
        fieldsToDelete.push({ name: field });
    });
    return fieldsToDelete;
}
