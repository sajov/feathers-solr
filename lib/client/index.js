const FetchClient = require('./fetch');
const UndiciClient = require('./undici');

function SolrClient (fn, host, opts = {}) {
  if(!fn || !fn.name) throw new Error('Client must be one of fetch or undici.');
  if(!host) throw new Error('A host is required');

  const name = fn.name || false;

  if (name === 'fetch') {
    try {
      return new FetchClient(fn, host, opts);
    } catch (err) {
      throw new Error('Client must be one of fetch or undici.');
    }
  }

  if (name === 'undici') {
    try {
      return new UndiciClient(fn, host, opts);
    } catch (err) {
      return err;
    }
  }
}

module.exports = { SolrClient };
