import { sampleObject} from '../../src/samplers/object.js';

describe('sampleObject', () => {
  let res;
  it('should return emtpy object by default', () => {
    res = sampleObject({});
    expect(res).to.deep.equal({});
  });

  it('should instantiate all properties', () => {
    res = sampleObject({properties: {
      a: {type: 'string'},
      b: {type: 'integer'}
    }});
    expect(res).to.deep.equal({
      a: 'string',
      b: 0
    });
  });

  it('should skip readonly properties if skipReadOnly=true', () => {
    res = sampleObject({properties: {
      a: {type: 'string'},
      b: {type: 'integer', readOnly: true}
    }}, {skipReadOnly: true});
    expect(res).to.deep.equal({
      a: 'string'
    });
  });

  it('should skip readonly properties in nested objects if skipReadOnly=true', () => {
    res = sampleObject({properties: {
      a: {type: 'string'},
      b: {type: 'object', properties: {
        b1: { type: 'number', readOnly: true },
        b2: { type: 'number'}
      }}
    }}, {skipReadOnly: true});
    expect(res).to.deep.equal({
      a: 'string',
      b: {
        b2: 0
      }
    });
  });

  it('should skip writeonly properties if writeonly=true', () => {
    res = sampleObject({properties: {
      a: {type: 'string'},
      b: {type: 'integer', writeOnly: true}
    }}, {skipWriteOnly: true});
    expect(res).to.deep.equal({
      a: 'string'
    });
  });

  it('should skip writeonly properties in nested objects if writeonly=true', () => {
    res = sampleObject({properties: {
      a: {type: 'string'},
      b: {type: 'object', properties: {
        b1: { type: 'number', writeOnly: true },
        b2: { type: 'number'}
      }}
    }}, {skipWriteOnly: true});
    expect(res).to.deep.equal({
      a: 'string',
      b: {
        b2: 0
      }
    });
  });

  it('should should instantiate 2 additionalProperties', () => {
    res = sampleObject({additionalProperties: {type: 'string'}});
    expect(res).to.deep.equal({
      property1: 'string',
      property2: 'string'
    });
  });

  it('should skip non-required properties if skipNonRequired=true', () => {
    res = sampleObject({
      properties: {
        a: {type: 'string'},
        b: {type: 'integer'}
      },
      required: ['a']
    }, {skipNonRequired: true});
    expect(res).to.deep.equal({
      a: 'string'
    });
  });

  it('should pass propertyName context to samplers', () => {
    res = sampleObject({
      properties: {
        fooId: {type: 'string', format: 'uuid'},
        barId: {type: 'string', format: 'uuid'},
      }
    });
    expect(res).to.deep.equal({
      fooId: 'fb4274c7-4fcd-4035-8958-a680548957ff',
      barId: '3c966637-4898-4972-9a9d-baefa6cd6c89'
    });
  });

  describe('disableNonRequiredAutoGen', () => {

    it('should skip properties without explicit example value', () => {
      res = sampleObject({
        properties: {
          a: { type: 'string', enum: ['foo', 'bar'] },
          b: { type: 'integer', default: 100 },
          c: { type: 'string' },
          d: { type: 'string', example: 'Example' }
        },
      }, { disableNonRequiredAutoGen: true });
      expect(res).to.deep.equal({
        b: 100,
        d: 'Example'
      });
    });

    it('should skip additional properties', () => {
      res = sampleObject({
        properties: {
          a: { type: 'string', example: 'Example' },
        },
        additionalProperties: { type: 'string' }
      }, { disableNonRequiredAutoGen: true });
      expect(res).to.deep.equal({
        a: 'Example'
      });
    });

    it('should return null if omissible=true and no property has example', () => {
      res = sampleObject({
        properties: {
          a: { type: 'string' },
          b: { type: 'integer' }
        },
      }, { disableNonRequiredAutoGen: true, omissible: true });
      expect(res).to.be.null;
    });

  });
});
