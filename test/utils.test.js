import { expect } from 'chai';
import { _ } from '../src/utils';
// https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_topairs
describe('Utils', () => {

  describe('values', () => {
    it('should be true', () => {
      expect(_.values({status:1,test1:1})).to.deep.equal([1,1]);
    });
  });

  describe('isEmpty', () => {
    it('Object should be false', () => {
      expect(_.isEmpty({status:{test1:1}})).to.be.equal(false);
    });
    it('new Object should be true', () => {
      expect(_.isEmpty(new Object())).to.be.equal(true);
    });
    it('new Array should be true', () => {
      expect(_.isEmpty(new Array())).to.be.equal(true);
    });
    it('empty Object should be true', () => {
      expect(_.isEmpty({})).to.be.equal(true);
    });
    it('empty Object should be true', () => {
      expect(_.isEmpty([])).to.be.equal(true);
    });
    it('empty Object should be false', () => {
      expect(_.isEmpty([1,2])).to.be.equal(false);
    });
  });

  describe('isObject', () => {
    it('should be true', () => {
      expect(_.isObject({status:{test1:1}})).to.be.equal(true);
    });
  });

  describe('isPlainObject', () => {
    it('Object return true', () => {
      expect(_.isPlainObject({status:1})).to.be.equal(true);
    });
    it('new Object return true', () => {
      expect(_.isPlainObject(new Object())).to.be.equal(true);
    });
    it('Array return false', () => {
      expect(_.isPlainObject([{status:1}])).to.be.equal(false);
    });
    it('new Array return false', () => {
      expect(_.isPlainObject(new Array())).to.be.equal(false);
    });
    it('new Date return false', () => {
      expect(_.isPlainObject(new Date())).to.be.equal(false);
    });
    it('Number return false', () => {
      expect(_.isPlainObject(Number)).to.be.equal(false);
    });
  });

  describe('isEqual', () => {
    it('should return true', () => {
      expect(_.isEqual({status:1},{status:1})).to.be.equal(true);
    });
    it('should return false', () => {
      expect(_.isEqual({status:1},{status:2})).to.be.equal(false);
    });
  });

  describe('mergeDeep', () => {
    it('should mergeDeep test1 test2', () => {
      expect(_.mergeDeep({status:{test1:1}},{status:{test2:2}})).to.deep.equal({status:{test1:1,test2:2}});
    });
  });

  describe('extend', () => {
    it('should extend test1 test2', () => {
      expect(_.extend({status:true},{test1:1},{test2:2})).to.deep.equal({status:true,test1:1,test2:2});
    });
  });

  describe('omit', () => {
    it('should omit test1 test2', () => {
      expect(_.omit({status:true,test1:1,test2:2},'test1','test2')).to.deep.equal({status: true});
    });
  });
  // todo pairs
  // describe('pairs', () => {
  //   it('should remove props status', () => {
  //     console.log(_.pairs({status:true,test1:1}));
  //     expect(_.pairs({status:true,test1:1})).to.deep.equal([true,1]);
  //   });
  // });
  describe('pick', () => {
    it('should remove props status', () => {
      expect(_.pick({status:true,test1:1,test2:2},'status')).to.deep.equal({status: true});
    });
  });

  describe('removeProps', () => {
    it('should remove props test', () => {
      expect(_.removeProps({status:true,test1:1,test2:2},'test1','test2')).to.deep.equal({status: true});
    });
  });

  describe('has', () => {

    it('should return `true`', () => {
      expect(_.has({status:true},'status')).to.be.equal(true);
    });

    it('should return `false`', () => {
      expect(_.has({foo:false},'status')).to.be.equal(false);
    });
  });

  describe('get', () => {

    it('should return `true`', () => {
      expect(_.get({status:true},'status')).to.be.equal(true);
    });

    it('should return `false`', () => {
      expect(_.get({status:false},'status')).to.be.equal(false);
    });
  });

});
