import Joi from 'joi-browser';
import Promise from 'bluebird';

const alphabetical = Joi.string().regex(/^[a-zA-Z]+$/, {
  name: 'alphabetical'
});

/**
 * models/validate.js
 *
 * Exports a function for validating model schema via Joi.
 *
 * You can view the Joi validation API here:
 * https://github.com/hapijs/joi/blob/v10.0.1/API.md
 *
 */

export default function validate(model) {
  /**
   * Joi schema is a blueprint of data types and constraints
   * that we use to validate our model definitions:
   *
   *
   */

  /* const schema = Joi.string().regex(/^[a-zA-Z]+$/, {
    name: 'alpha'
  }).required();*/

  const schema = Joi.object().keys({
    name: alphabetical.required().min(1),
    fields: Joi.array().items(Joi.object().keys({
      name: alphabetical.required().min(1),
      type: Joi.alternatives().try(
        Joi.array().items(alphabetical.required().min(1)),
        alphabetical.required().min(1)
      ).required()
    })).required().min(1)
  });

  /**
   * Validation function is a Promise that:
   * resolves with a valid object and
   * rejects with a validation error
   */
  return new Promise((resolve, reject) => {
    Joi.validate(model, schema, (err, value) => {
      if (err) {
        reject(err);
      } else {
        resolve(value);
      }
    });
  });
}
