import assert from 'assert';
import { addIds } from '../src/utils/addIds';

describe('utils', () => {
  it('addIds', async () => {
    const test = addIds([{name: 'john'}],  'id' );

    assert.equal(typeof test[0].id, 'string');
  })
})
