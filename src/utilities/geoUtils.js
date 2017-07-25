import R from 'ramda';
import { getSchema } from '../schemas/main';
import { Types } from '../schemas/schema';

/**
 * Extract geolocation points recursively through a document and its children
 * Returns an array of shape:
 * [
 *  {
 *    domainName: 'ADomainName',
 *    timeRanges: [
 *      {
 *        start: 1498980960725,
 *         end: 14989801449
 *        }
 *      ]
 *    },
 *   {
 *    domainName: 'AnotherDomainName',
 *    timeRanges: [
 *      {
 *        start: 1498980960725,
 *        end: 14989801449
 *      }
 *    ]
 *   }
 * ]
 */

export const getGeoTimeRanges = (doc, schema) => {
  // Return empty array if doc is null
  if (!doc) { return []; }

  // Reduce all of the documents fields to a single array of geo points
  // If the field is of type Geolocation, extract points
  // If the field is of type Model, recurse
  return schema.fields.reduce((acc, field) => {
    const fieldIsGeoLine =
      field.type.constructor === Types.Geolocation &&
      !!field.options.track === true;

    const fieldIsCollection =
      Array.isArray(doc);

    const fieldIsModel =
      field.type.constructor === Types.Model;

    if (fieldIsGeoLine) {
      // Field is a collection (this can only get called recursively)
      if (fieldIsCollection) {
        return [
          ...acc,
          ...doc
            .filter(dd => !!dd) // Remove nils
            .map((dd) => {
              const value = dd[field.name];
              const valueWithType = { ...value, domainName: schema.name };
              return valueWithType;
            })
        ].filter(element => !!element); // Remove nils
      }

      const geoValue = doc[field.name];

      const valueWithType = { ...geoValue, domainName: schema.name };

      // Append geolocation value to the array and filter nils
      return [...acc, valueWithType].filter(element => !!element);
    }

    // Fields that are models can themselves have geo data
    // Recurse through their fields
    if (fieldIsModel) {
      const { name: domainName } = field.type;
      const subSchema = getSchema(domainName);

      if (!subSchema) { return acc; }
      if (!doc[field.name]) { return acc; }

      return [...acc, ...getGeoTimeRanges(doc[field.name], subSchema)];
    }

    return acc;
  }, []);
};

/**
 * Map geolocation data from the geocache to time entries in a document
 */
export const mapGeoFromCache = (doc, schema, cache) => {
  const ranges = getGeoTimeRanges(doc, schema);

  const polylines = ranges.map((entry) => {
    const { domainName, timeRanges } = entry;

    if (!timeRanges) { return null; }

    const lines = timeRanges.map((timeRange) => {
      const { start, end } = timeRange;
      return cache.filter((cacheValue) => {
        const { timestamp } = cacheValue;
        return end ? timestamp >= start && timestamp <= end :
          timestamp >= start;
      });
    }).filter(l => l.length > 0);

    return { domainName, lines };
  }).filter(l => l).filter(l => l.lines.length > 0); // Filter null and empty array

  const markers = [];

  return { markers, polylines };
};

export const mapTimeRangesToPointLinesInCache = (timeRanges, cache) => {
  if (!timeRanges) { return []; }

  return timeRanges.map((timeRange) => {
    const { start, end } = timeRange;
    return cache.filter((cacheValue) => {
      const { timestamp } = cacheValue;
      return end ? timestamp >= start && timestamp <= end :
        timestamp >= start;
    });
  });
};

export const uncacheDocumentGeo = (doc, schema, cache) => {
  // console.log('Uncaching:', doc, schema);
  if (!schema) { return doc; }

  const docIsCollection = Array.isArray(doc);

  if (docIsCollection) {
    return doc.map(subdoc => uncacheDocumentGeo(subdoc, schema, cache));
  }

  const docWithGeo = schema.fields.reduce((acc, field) => {
    const fieldName = field.name;

    const fieldIsGeoLine =
      field.type.constructor === Types.Geolocation &&
      !!field.options.track === true;

    /* const fieldIsCollection =
      Array.isArray(field); */

    const fieldIsModel =
      field.type.constructor === Types.Model;

    if (fieldIsModel) {
      const { name: domainName } = field.type;
      const subSchema = getSchema(domainName);

      if (!subSchema) { return acc; }
      if (!doc[field.name]) { return acc; }

      const subDocWithGeo = uncacheDocumentGeo(doc[field.name], subSchema, cache);
      return R.assoc(fieldName, subDocWithGeo, acc);
    }

    if (fieldIsGeoLine) {
      const geoValue = doc[field.name];

      if (!geoValue) { return null; }

      // Set end time to any active tracks
      const timeRanges = geoValue.timeRanges.map(tr =>
        (tr.end ? tr : { start: tr.start, end: Date.now() })
      );

      const polylines = mapTimeRangesToPointLinesInCache(timeRanges, cache);
      return R.assoc(fieldName, { timeRanges, polylines }, acc);
    }

    if (!doc[fieldName]) { return acc; }
    return R.assoc(fieldName, doc[fieldName], acc);
  }, {});

  return { ...doc, ...docWithGeo };
  // return R.pickBy(val => val, docWithGeo);

  /* return R.mapObjIndexed((num, key, _) {

  }, schema.fields);*/

  /* return schema.fields.map(field => {
    const fieldIsGeoLine =
      field.type.constructor === Types.Geolocation &&
      !!field.options.track === true;

    const fieldIsCollection =
      Array.isArray(doc);

    const fieldIsModel =
      field.type.constructor === Types.Model;
  }); */
};

const makeMapDataFromDocument = (doc, schema) => {
  // Combine all fields that are of type geolocation
  // Tracks become polylines
  // Points become markers
  const polylines = schema.fields.reduce((acc, field) => {
    // A polyline is made up of a track of geolocations
    const isPolyline =
      field.type.constructor === Types.Geolocation &&
      !!field.options.track === true;

    const isCollection = Array.isArray(doc);

    const isModel = field.type.constructor === Types.Model;

    if (isPolyline) {
      // Field is a collection (this can only get called recursively)
      if (isCollection) {
        return [
          ...acc,
          ...doc
            .filter(dd => !!dd) // Remove nils
            .map((dd) => {
              const value = dd[field.name] || { polylines: [] };
              const valueWithType = { lines: value.polylines, domainName: schema.name };
              return valueWithType;
            })
            .filter(dd => !!dd) // Remove nils
        ].filter(element => !!element); // Remove nils
      }

      const value = doc[field.name] || { polylines: [] };
      const valueWithType = { lines: value.polylines, domainName: schema.name };

      // Append geolocation value to the array and filter nils
      return [...acc, valueWithType]
        .filter(element => !!element)
        .filter(element => element.lines.length > 0);
    }

    // Fields that are models can themselves have geo data
    // Recurse through their fields
    if (isModel) {
      const { name: domainName } = field.type;
      const subSchema = getSchema(domainName);

      if (!subSchema) { return acc; }
      if (!doc[field.name]) { return acc; }

      return [...acc, ...makeMapDataFromDocument(doc[field.name], subSchema)];
    }

    return acc;
  }, []);

  return {
    polylines
  };

  /* return {
    markers: [],
    polylines: []
  }; */
};

export const makeMapData = (doc, schema, cache) => {
  if (!doc || !schema) { return {}; }

  const shouldGetFromCache = !doc.isLocked;

  if (shouldGetFromCache) {
    return mapGeoFromCache(doc, schema, cache);
  }

  return makeMapDataFromDocument(doc, schema);
};
