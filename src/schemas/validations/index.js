import Joi from 'joi-browser';

export const alphabeticalString = Joi.string().regex(/^[a-zA-Z]+$/, 'Alphabetical string');

export const pascalCasedString = Joi.string().regex(/^[A-Z]{1,2}[a-z]*(?:[A-Z]{1,2}[a-z]*)*$/, 'PascalCased string');
