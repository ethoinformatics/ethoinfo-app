import Joi from 'joi-browser';
import Promise from 'bluebird';

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
   * Category is an alphabetical string without any spaces
   */

  const schema = Joi.string().regex(/^[a-zA-Z]+$/, {
    name: 'alpha'
  }).required();

  /**
   * Validation function is a Promise that:
   * resolves with a valid object and
   * rejects with a validation error
   */
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
