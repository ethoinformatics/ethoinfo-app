import Joi from 'joi-browser'; // json validation instead?
import { defaultTypes } from './types';
import { alphabeticalString, pascalCasedString } from './validations';

// Validate category definition:
// a PascalCased string containing the name of the category
const validateCategory = (category) => {
  const schema = pascalCasedString.required().min(1)
    .not(defaultTypes);

  return Joi.validate(category, schema);
};

// Validate model definition:
// -- "name" is a pascalCasedString containing the name of the model
// -- "fields" is an array of items with the following shape:
// ----- "name": an alphabetical string (A-Z) containing the field name
// ----- "type":
// -------- Single value: an alphabetical string (A-Z) e.g. "Bool"
// -------- OR
// -------- Collection: an array w/ a single alphabetical string (A-Z) e.g. ["Bool"]
const validateModel = (model) => {
  const schema = Joi.object().keys({
    name: pascalCasedString.required().min(1)
      .error(new Error('must be a PascalCased string.')),
    fields: Joi.array().items(Joi.object().keys({
      name: alphabeticalString.required().min(1),
      type: Joi.alternatives().try(
        Joi.array().items(pascalCasedString.required().min(1)).length(1),
        pascalCasedString.required().min(1)
      ).required()
    })).required().min(1)
  });

  return Joi.validate(model, schema);
};

export default {
  load: (categories, models) => {
    console.log('Load schema:', categories, models);

    // Collect our user-defined category types
    const allCategoryTypes = Object.keys(categories)
      .map((key) => {
        const category = categories[key];
        const validation = validateCategory(category);

        return {
          name: category,
          validation
        };
      });

    // Valid categories have no validation errors
    let validCategoryTypes = allCategoryTypes
      .filter(cat => cat.validation.error == null);

    // Remove duplicate entries
    validCategoryTypes = [...new Set(validCategoryTypes)];
    console.log('Loaded valid category types =>', validCategoryTypes);

    // Collect our user-defined model types:
    const allModelTypes = models
      .map((model) => {
        const validation = validateModel(model);

        /* if (validation.error) {
          console.error('Omitting invalid model definition =>', `"${model}"`, validation.error.message);
          // return null;
        } */

        return {
          name: model.name,
          validation
        };
      });

    // const firstPassValidatedModels = allModelTypes.filter(model => model.validation.error == null);
    const firstPassValidatedModels = allModelTypes;

    // Remove duplicate entries
    // Don't need to remove - should have error via Joi
    // modelTypes = _.uniqBy([{ 'x': 1 }, { 'x': 2 }, { 'x': 1 }], 'x')
    // modelTypes = [...new Set(modelTypes)];
    // console.log('Loaded model types =>', validModelTypes);

    const userTypesTmp = [...new Set([
      ...validCategoryTypes.map(cat => cat.name),
      ...firstPassValidatedModels.map(model => model.name)
    ])];

    const allTypesTmp = [...new Set([
      ...userTypesTmp,
      ...defaultTypes
    ])];

    // console.log('Types are:', userTypesTmp);

    // Validate individual fields
    const validateModelFields = (model) => {
      const schema = Joi.object().keys({
        name: pascalCasedString.required().min(1)
          .error(new Error('must be a PascalCased string.')),
        fields: Joi.array().items(
        Joi.object().keys({
          name: alphabeticalString.required().min(1),
          type: Joi.alternatives().try(
            Joi.array().items(allTypesTmp).required().length(1),
            Joi.string().only(allTypesTmp).required()
          ).required()
        })).required()
        .min(1)
        .unique((a, b) => a.name.toLowerCase() === b.name.toLowerCase())
      });


      /* const schema = Joi.array().items(
        Joi.object().keys({
          name: validations.alphabeticalString.required().min(1),
          type: Joi.alternatives().try(
            Joi.array().items(allTypesTmp).required().length(1),
            Joi.string().only(allTypesTmp).required()
          ).required()
        })).required()
        .min(1)
        .unique((a, b) => a.name.toLowerCase() === b.name.toLowerCase()); */

      return Joi.validate(model, schema);
    };

    const secondPassValidatedModels = firstPassValidatedModels.map((firstPassModel) => {
      // TODO: Better logic.
      const model = models.find(element => element.name === firstPassModel.name);

      const validation = validateModelFields(model);

      if (validation.error) {
        console.error(`Error validating model fields => ${model.name}:`, validation.error.message);
      } else {
        // console.log(`Success validating model definition => ${model.name}:`, validation.value);
      }

      return {
        name: model.name,
        validation
      };
    });

    return {
      categories: allCategoryTypes,
      models: secondPassValidatedModels
    };

    /* validModelTypes.forEach((key) => {
      const model = models[key];

      const validation = validateModelFields(model.fields);
      if (validation.error) {
        console.error(`Error validating model fields => ${key}:`, validation.error.message);
      } else {
        console.log(`Success validating model definition => ${key}:`, validation.value);
      }

      console.log(model);
    }); */
  }
};
