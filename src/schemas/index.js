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

// Categories are important from an index file:
import categories from './categories/index.yaml';

// Import your models individually here:
import Contact from './models/contact.yaml';
import Diary from './models/diary.yaml';


// Export an object containing all of our schemas:
export default {
  categories,
  models: {
    Contact,
    Diary
  }
};


