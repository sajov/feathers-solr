import assert from 'assert';
import { solrClient } from '../src/client';

const options = {
  host: 'http://localhost:8983/solr',
  core: 'stats'
}

describe('Client', () => {
  it('update with string id works', async () => {
    const client = solrClient(options);
    console.log(client);
    assert.strictEqual(40, 40);
  })
})
