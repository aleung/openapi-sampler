import { traverse } from '../traverse';
export function sampleArray(schema, options = {}, spec, context) {
  const depth = (context && context.depth || 1);

  let arrayLength = schema.minItems || 1;
  if (Array.isArray(schema.items)) {
    arrayLength = Math.max(arrayLength, schema.items.length);
  }

  const itemSchemaGetter = itemNumber => {
    if (Array.isArray(schema.items)) {
      return schema.items[itemNumber] || {};
    }
    return schema.items || {};
  };

  let res = [];
  if (!schema.items) return res;

  for (let i = 0; i < arrayLength; i++) {
    let { value: sample } = traverse(itemSchemaGetter(i), options, spec, {depth: depth + 1});
    res.push(sample);
  }

  if (!options.omissible || res.some(item => item !== null)) {
    return res;
  }

  return null;
}
