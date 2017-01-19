import R from 'ramda';
import { CategorySchema, ModelSchema } from '../schemas/schema';
import * as validations from './validations';
import { defaultTypes } from './types';

// -----------------------------------------------------------------------------
// Load category and model definitions

const categoryDefinitions = require('./categories/index.yaml');

const requireAll = requireContext => requireContext.keys().map(requireContext);
const modelDefinitions = requireAll(require.context('./models', false, /^\.\/.*\.yaml$/));


// -----------------------------------------------------------------------------
// Functions

// Filter without error key
const withoutErrorPredicate = candidate =>
  candidate.error === null;

// Map to value at "value" key
const getValue = obj => obj.value;

// Map to value at "name" key
const getName = obj => obj.name;

// Map category definition to validation result
const validatedCategory = name => validations.validateCategory(name);

// Map category validation object to instance of Category class
const makeCategory = name => new CategorySchema(name);

// Map model definition to a validation result
// validations.validateModelShape validates shape but does not validate field types
const validatedModelShape = def =>
  validations.validateModelShape(def);

// -----------------------------------------------------------------------------
// Parse and export categories

const parseCategories = R.pipe(
  R.uniq,
  R.map(validatedCategory),
  R.filter(withoutErrorPredicate),
  R.map(getValue),
  R.map(makeCategory)
);

export const categories = parseCategories(categoryDefinitions);

// -----------------------------------------------------------------------------
// Parse and export models

// Filter out model definitions that don't conform to expected shape
const filterModelShape = R.pipe(
  R.map(validatedModelShape),
  R.filter(withoutErrorPredicate),
  R.map(getValue)
);

// Candidate models fit expected shape and can be considered valid types
const candidateModels = filterModelShape(modelDefinitions);

// Collect model names
const categoryNames = categories.map(getName);
const modelNames = candidateModels.map(getName);

// All valid types
const types = R.uniq([
  ...defaultTypes,
  ...categoryNames,
  ...modelNames
]);

// Map models
export const models = candidateModels
  .map(modelDef => validations.validateModel(modelDef, types))
  .filter(withoutErrorPredicate)
  .map(getValue)
  .map(ok => new ModelSchema(ok, { categoryNames, modelNames }));
