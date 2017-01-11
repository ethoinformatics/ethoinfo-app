export const primitiveTypes = [
  'Boolean',
  'Number',
  'String'
];

export const specialTypes = [
  'Date',
  'Geolocation'
];

// Default types are primitive types and special types
// User-defined types cannot have these type names.
export const defaultTypes = [...primitiveTypes, ...specialTypes];
