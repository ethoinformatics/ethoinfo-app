import Joi from 'joi-browser';
import { defaultTypes } from '../types';

// -----------------------------------------------------------------------------
// PRIMITIVES

export const alphabeticalString = Joi.string().regex(/^[a-zA-Z]+$/, 'Alphabetical string');

export const pascalCasedString = Joi.string().regex(/^[A-Z]{1,2}[a-z]*(?:[A-Z]{1,2}[a-z]*)*$/, 'PascalCased string');


// -----------------------------------------------------------------------------
// SCHEMA

// Validate model definition:
// -- "name" is a pascalCasedString containing the name of the model
// -- "fields" is an array of items with the following shape:
// ----- "name": an alphabetical string (A-Z) containing the field name
// ----- "type":
// -------- Single value: an alphabetical string (A-Z) e.g. "Bool"
// -------- OR
// -------- Collection: an array w/ a single alphabetical string (A-Z) e.g. ["Bool"]

// Validate category definition:
// a PascalCased string containing the name of the category

export const isPascalCasedString = candidate =>
  Joi.validate(candidate, pascalCasedString).error === null;

export const validateCategory = (category) => {
  const schema = pascalCasedString.required().min(1)
    .not(defaultTypes);

  return Joi.validate(category, schema);
};

export const validateModelShape = (model) => {
  const schema = Joi.object().keys({

    name: pascalCasedString.required().min(1)
      .error(new Error('must be a PascalCased string.')),

    displayColor: Joi.string().min(1),

    displayField: Joi.string().min(1),

    lockOnUpload: Joi.boolean(),

    fields: Joi.array().items(Joi.object().keys({

      name: alphabeticalString.required().min(1),

      type: Joi.alternatives().try(
        Joi.array()
          .items(
            pascalCasedString.required()
              .min(1)
          ).length(1),
          pascalCasedString.required()
            .min(1)
      ).required(),

      lookup: Joi.boolean(),

      // For now, options apply across all field types and can be anything
      options: Joi.object().unknown(),

    })).required().min(1)
  });

  return Joi.validate(model, schema);
};

export const validateModel = (model, validFieldTypeNames = []) => {
  const schema = Joi.object().keys({

    name: pascalCasedString.required().min(1)
      .error(new Error('must be a PascalCased string.')),

    displayColor: Joi.string().min(1),

    displayField: Joi.string().min(1),


    lockOnUpload: Joi.boolean(),

    fields: Joi.array().items(Joi.object().keys({

      name: alphabeticalString.required().min(1),

      type: Joi.alternatives().try(
        Joi.array()
          .items(
            pascalCasedString
              .required()
              .valid(validFieldTypeNames)
              .min(1)
              .length(1)
          ),
          pascalCasedString
            .required()
            .valid(validFieldTypeNames)
            .min(1)
      ).required(),

      // For now, options apply across all field types and can be anything
      options: Joi.object().unknown(),

      lookup: Joi.boolean()

    })).required().min(1)
  });

  return Joi.validate(model, schema);
};
