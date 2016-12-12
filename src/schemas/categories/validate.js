import Joi from 'joi-browser';
// import Promise from 'bluebird';

const pascalCased = Joi.string().regex(/^[A-Z][a-z]+(?:[A-Z][a-z]+)*$/, 'PascalCased string');

/**
 * categories/validate.js
 *
 * Exports a function for validating category schema via Joi.
 *
 * You can view the Joi validation API here:
 * https://github.com/hapijs/joi/blob/v10.0.1/API.md
 *
 */

export default function validate(category) {
  /**
   * Joi schema is a blueprint of data types and constraints
   * that we use to validate our category definitions:
   *
   * Category is a pascal cased string without any spaces
   */

  const schema = pascalCased.required();

  /**
   * Validation function is a Promise that:
   * resolves with a valid object and
   * rejects with a validation error
   */
  /* return new Promise((resolve, reject) => {
    Joi.validate(category, schema, (err, value) => {
      if (err) {
        reject(err);
      } else {
        resolve(value);
      }
    });
  }); */
  return Joi.validate(category, schema);
}
