import Joi from 'joi-browser';

const primitiveTypes = [
  'Boolean',
  'Number',
  'String'
];

const specialTypes = [
  'Date',
  'Geolocation'
];

// Default types are primitive types and special types
// User-defined types cannot have these type names.
const defaultTypes = [...primitiveTypes, ...specialTypes];

const validations = {
  alphabeticalString: Joi.string().regex(/^[a-zA-Z]+$/, 'Alphabetical string'),
    // .error(new Error('must be an alphabetical string.')),

  pascalCasedString: Joi.string().regex(/^[A-Z]{1,2}[a-z]*(?:[A-Z]{1,2}[a-z]*)*$/, 'PascalCased string')
    // .error(new Error('must be a PascalCased string.'))
};

// Validate category definition is simply a PascalCased string
const validateCategory = (category) => {
  const schema = validations.pascalCasedString.required()
    .not(defaultTypes);

  return Joi.validate(category, schema);
};

// Validate model definition
const validateModel = (category) => {
  const schema = Joi.object().keys({
    name: validations.pascalCasedString.required().min(1)
      .error(new Error('must be a PascalCased string.')),
    fields: Joi.array().items(Joi.object().keys({
      name: validations.alphabeticalString.required().min(1),
      type: Joi.alternatives().try(
        Joi.array().items(validations.pascalCasedString.required().min(1)).length(1),
        validations.pascalCasedString.required().min(1)
      ).required()
    })).required().min(1)
  });

  return Joi.validate(category, schema);
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
    const allModelTypes = Object.keys(models)
      .map((key) => {
        const model = models[key];
        const validation = validateModel(model);

        if (validation.error) {
          console.error('Omitting invalid model definition =>', `"${model}"`, validation.error.message);
          // return null;
        }

        return {
          name: key,
          validation
        };
      });

    const firstPassValidatedModels = allModelTypes.filter(model => model.validation.error == null);

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
        name: validations.pascalCasedString.required().min(1)
          .error(new Error('must be a PascalCased string.')),
        fields: Joi.array().items(
        Joi.object().keys({
          name: validations.alphabeticalString.required().min(1),
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
      const model = models[firstPassModel.name];

      const validation = validateModelFields(model);

      if (validation.error) {
        console.error(`Error validating model fields => ${model.name}:`, validation.error.message);
      } else {
        console.log(`Success validating model definition => ${model.name}:`, validation.value);
      }

      return {
        name: model.name,
        validation
      };
    });

    // console.log(allModelTypes, secondPassValidatedModels);

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
