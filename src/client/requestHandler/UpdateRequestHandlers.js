/**
 * Solr Config API
 * https://cwiki.apache.org/confluence/display/solr/Uploading+Data+with+Index+Handlers#UploadingDatawithIndexHandlers-JSONFormattedIndexUpdates
 */
export function update (request, opts, data) {

    let options = {
        method: 'POST',
        uri: opts.coreUrl + '/update', // '/update/json' || /update/json/docs
        qs: {
            wt: 'json',
            softCommit: true, // softCommit: true, commit: true, commitWithin: 50
            commitWithin: 50000,
            overwrite: true
        },
        body: data,
        json: true
    };
    console.log('UpdateRequestHandler update',options);
    return request(options);
}

export function updateJson (request, opts, data) {

    let options = {
        method: 'POST',
        uri: opts.coreUrl + '/update/json', // '/update/json' || /update/json/docs
        qs: {
            wt: 'json',
            softCommit: true, // softCommit: true, commit: true, commitWithin: 50
            commitWithin: 50000,
            overwrite: true
        },
        body: data,
        json: true
    };
    console.log('UpdateRequestHandler updateJson',options);
    return request(options);
}

export  function updateJsonDocs (request, opts, data) {

    let options = {
        method: 'POST',
        uri: opts.coreUrl + '/update/json/docs', // '/update/json' || /update/json/docs
        qs: {
            wt: 'json',
            softCommit: true, // softCommit: true, commit: true, commitWithin: 50
            commitWithin: 50000,
            overwrite: true
        },
        body: data,
        json: true
    };

    return request(options);
}