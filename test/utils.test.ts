import assert from 'assert';
import { addIds } from '../src/utils/addIds';
import { solrEscape } from '../src/utils/solrEscape';

describe('utils', () => {
  it('addIds', async () => {
    const test = addIds([{name: 'john'}],  'id' );

    assert.equal(typeof test[0].id, 'string');
  })

  describe('solrEscape', () => {
    it('passes through values without special chars', () => {
      assert.deepStrictEqual(solrEscape('name', 'John'), { key: 'name', value: 'John' });
    });

    it('does not touch numbers', () => {
      assert.deepStrictEqual(solrEscape('age', 32), { key: 'age', value: 32 });
    });

    it('does not touch booleans', () => {
      assert.deepStrictEqual(solrEscape('active', true), { key: 'active', value: true });
    });

    it('escapes Solr special chars in strings', () => {
      const { value } = solrEscape('q', 'foo:bar');
      assert.strictEqual(value, 'foo\\:bar');
    });

    it('escapes injection attempts', () => {
      const { value } = solrEscape('name', 'admin OR id:*');
      assert.strictEqual(value, 'admin\\ OR\\ id\\:*'.replace('*', '\\*'));
    });

    it('escapes whitespace', () => {
      const { value } = solrEscape('name', 'John Doe');
      assert.strictEqual(value, 'John\\ Doe');
    });

    it('escapes string values inside arrays', () => {
      const { value } = solrEscape('name', ['a:b', 'c']);
      assert.deepStrictEqual(value, ['a\\:b', 'c']);
    });

    it('escapes && and ||', () => {
      assert.strictEqual(solrEscape('q', 'a && b').value, 'a\\ \\&&\\ b');
      assert.strictEqual(solrEscape('q', 'a || b').value, 'a\\ \\||\\ b');
    });
  });
})
