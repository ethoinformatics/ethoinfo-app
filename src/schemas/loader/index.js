import Joi from 'joi-browser'; // json validation instead?
import { defaultTypes } from '../types';

import {
  alphabeticalString,
  pascalCasedString,
  validateCategory,
  validateModel
} from '../validations';



export default {
  load: (categories, models) => {
    // console.log('Load schema:', categories, models);

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
    // console.log('Loaded valid category types =>', validCategoryTypes);

    // Collect our user-defined model types:
    const allModelTypes = models
      .map((model) => {
        const validation = validateModel(model);

        return {
          name: model.name,
          validation
        };
      });

    const firstPassValidatedModels = allModelTypes;

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
        displayField: Joi.string().min(1),
        fields: Joi.array().items(
        Joi.object().keys({
          name: alphabeticalString.required().min(1),
          type: Joi.alternatives().try(
            Joi.array().items(allTypesTmp).required().length(1),
            Joi.string().only(allTypesTmp).required()
          ).required(),
          lookup: Joi.boolean(),
          options: Joi.object().unknown(),
        })).required()
        .min(1)
        .unique((a, b) => a.name.toLowerCase() === b.name.toLowerCase())
      });

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
  }
};
