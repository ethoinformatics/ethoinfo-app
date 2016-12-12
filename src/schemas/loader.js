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
    let categoryTypes = Object.keys(categories)
      .map((key) => {
        const category = categories[key];
        const validation = validateCategory(category);

        if (validation.error) {
          console.error('Omitting invalid category definition =>', `"${category}"`, validation.error.message);
          return null;
        }
        // console.log('Loaded category type =>', validation.value);
        return validation.value;
      })
      .filter(res => res !== null);

    // Unique
    categoryTypes = [...new Set(categoryTypes)];
    console.log('Loaded category types =>', categoryTypes);

    // Collect our user-defined model types:
    let modelTypes = Object.keys(models)
      .map((key) => {
        const model = models[key];
        const validation = validateModel(model);

        if (validation.error) {
          console.error('Omitting invalid model definition =>', `"${model}"`, validation.error.message);
          return null;
        }
        // console.log('Loaded category type =>', validation.value);
        return key;
      })
      .filter(res => res !== null);

    // Unique
    modelTypes = [...new Set(modelTypes)];
    console.log('Loaded model types =>', modelTypes);

    /* Object.keys(models).forEach((key) => {
      console.log('Load model schema:', key);
      const model = models[key];

      const result = validateModel(model);
      if (result.error) {
        console.error(`Error loading model definition => ${key}:`, result.error.message);
      } else {
        console.log(`Success loading model definition => ${key}:`, result.value);
      }
    }); */

    const userTypes = [...new Set([
      ...categoryTypes,
      ...modelTypes
    ])];

    const allTypes = [...new Set([
      ...userTypes,
      ...defaultTypes
    ])];

    console.log('Types are:', userTypes);

    // Validate individual fields
    const validateModelFields = (fields) => {
      const schema = Joi.array().items(
        Joi.object().keys({
          name: validations.alphabeticalString.required().min(1),
          type: Joi.alternatives().try(
            Joi.array().items(allTypes).required().length(1),
            Joi.string().only(allTypes).required()
          ).required()
        })).required()
        .min(1)
        .unique((a, b) => a.name.toLowerCase() === b.name.toLowerCase());

      return Joi.validate(fields, schema);
    };

    // Validate model definitions:
    modelTypes.forEach((key) => {
      const model = models[key];

      const validation = validateModelFields(model.fields);
      if (validation.error) {
        console.error(`Error validating model fields => ${key}:`, validation.error.message);
      } else {
        console.log(`Success validating model definition => ${key}:`, validation.value);
      }

      console.log(model);
    });
  }
};
