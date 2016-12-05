import Joi from 'joi-browser';
import Promise from 'bluebird';

/**
 * validate.js
 *
 * Exports a function for validating category schema.
 *
 * You can view the Joi validation API here:
 * https://github.com/hapijs/joi/blob/v10.0.1/API.md
 *
 */

export default function validate(category) {
  // Joi schema is a blueprint of data types and constraints
  // that we use to validate our category definitions:
  // - Name must be alphabetical without any spaces
  // - Values must be an array of strings that are at least 1 char long.

  /* const schema = Joi.object().keys({
    name: Joi.string().regex(/^[a-zA-Z]+$/, { name: 'alpha' }).required(),
    // values: Joi.array().items(Joi.string().min(1))
  }); */

  const schema = Joi.string().regex(/^[a-zA-Z]+$/, { name: 'alpha' }).required();

  return new Promise((resolve, reject) => {
    Joi.validate(category, schema, (err, value) => {
      if (err) {
        reject(err);
      } else {
        resolve(value);
      }
    });
  });
}
