const FetchClient = require('./fetch');
const UndiciClient = require('./undici');

function SolrClient (fn, host, opts = {}) {
  try {
    const name = fn.name;
    if (name === 'fetch') {
      return new FetchClient(fn, host, opts);
    } else if (name === 'undici') {
      return new UndiciClient(fn, host, opts);
    }
    throw new Error('Client must be one of fetch or undici.');
  } catch (error) {
    throw new Error('Client must be one of fetch or undici.');
  }
}

module.exports = { SolrClient };
