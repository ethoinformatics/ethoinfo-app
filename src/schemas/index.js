/**
 * Point of contact for loading model and category schema
 *
 * Model schema declare the structure of documents in a given domain:
 *
 * Dog
 * - age
 * - breed
 * - color
 * - name
 *
 *
 * Category schema declare categorical data types
 * (a.k.a. codes, enumerated types) that we want to reference in our models:
 *
 * DogBreed
 * - Belgian Malinois
 * - Dachshund
 * - German Shepard
 * - Pug
 *
 * Category types consist of a set of named values
 * (aka elements, members, enumerators) that we can predefine in our schema
 * and/or define at run-time (e.g. out in the field)
 */

// Todo: automatically glob all files in directory.
import Taxon from './categories/taxon.yaml';
import Contact from './models/contact.yaml';
import Diary from './models/diary.yaml';

export default {
  categories: {
    Taxon
  },
  models: {
    Contact,
    Diary
  }
};


