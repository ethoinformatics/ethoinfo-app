/**
 * Point of contact for loading model and category schema
 *
 * Model schema declare the structure of documents in a given domain:
 *
 * Dog
 * - age:   [number]    // default data type
 * - breed: [dogBreed]  // user defined categorical data type
 * - color: [colorCode] // user defined categorical data type
 * - owner: [person]    // user defined model reference
 * - name:  [string]    // default data type
 *
 *
 * Category schema declare the categorical data types
 * (a.k.a. codes, enumerated types) that we want to reference in our models:
 * - dogBreed
 * - widgetType
 * - ageBracket
 *
 *
 * At runtime, users add string values ("codes") to each category:
 *
 * - dogBreed => "Belgian Malinois", "Dachshund", "German Shepard"
 * - widgetType => "Crank", "Pulley", "Gear"
 * - ageBracket => "Child", "Juvenile", "Adult"
 *
 * Schema requirements:
 * - Model and category names are unique
 */

// Categories are imported from an index file:
import categories from './categories/index.yaml';

// Models (document types) are imported individually here:
// import Contact from './models/contact.yaml';

import BiologicalSample from './models/biologicalSample.yaml';
import Contact from './models/contact.yaml';
import Diary from './models/diary.yaml';
import Observer from './models/observer.yaml';
import PlantSample from './models/plantSample.yaml';
import Subject from './models/subject.yaml';
import Taxonomy from './models/taxonomy.yaml';
import FocalSample from './models/focalSample.yaml';
import FocalDatum from './models/focalDatum.yaml';
import AdLibitum from './models/adLibitum.yaml';
import Measurement from './models/measurement.yaml';
import Media from './models/media.yaml';

// Export an object containing all of our schemas:
export default {
  categories,
  models: [
    BiologicalSample,
    Contact,
    Diary,
    Observer,
    PlantSample,
    Subject,
    Taxonomy,
    FocalSample,
    FocalDatum,
    AdLibitum,
    Measurement,
//    Media,
]};