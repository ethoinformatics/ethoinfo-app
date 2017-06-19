import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import './form.styl';

import Map from '../map/map';
import TabbedView from '../tabbedView/tabbedView';
import Fields from './fields';

import { getSchema } from '../../schemas/main';
import { Types } from '../../schemas/schema';

const mapStateToProps = state => ({
  geoCache: state.geo.entries // Todo: make selector!
});

const mapDispatchToProps = () => ({});

// Extract geo points recursively through document and children
const getGeoPoints = (doc, schema) => { // eslint-disable-line arrow-body-style
  // Return empty array if no document
  if (!doc) { return []; }

  return schema.fields.reduce((acc, field) => {
    if (field.type.constructor === Types.Geolocation && !!field.options.track === false) {
      if (Array.isArray(doc)) {
        return [
          ...acc,
          ...doc
            .filter(dd => !!dd) // Remove nils
            .map(dd => dd[field.name])
        ].filter(element => !!element); // Remove nils
      }

      return [...acc, doc[field.name]].filter(element => !!element);
    }

    if (field.type.constructor === Types.Model) {
      const { name: domainName } = field.type;

      const subSchema = getSchema(domainName);
      if (!subSchema) { return acc; }

      if (!doc[field.name]) {
        return acc;
      }

      return [...acc, ...getGeoPoints(doc[field.name], subSchema)];
    }

    return acc;
  }, []);
};

// Extract geo points recursively through document and children
const getGeo = (doc, schema) => { // eslint-disable-line arrow-body-style
  // Return empty array if no document
  if (!doc) { return []; }

  return schema.fields.reduce((acc, field) => {
    if (field.type.constructor === Types.Geolocation && !!field.options.track === true) {
      // Field is a collection (would only get called recursively)
      /* if (Array.isArray(doc)) {
        return [
          ...acc,
          ...doc
            .filter(dd => !!dd) // Remove nils
            .map(dd => dd[field.name])
        ].filter(element => !!element); // Remove nils
      } */

      const geoValue = doc[field.name];

      // console.log('---');
      // console.log('Doc is:', doc);
      // console.log('Geo field value is:', geoValue);
      // console.log('Schema is:', schema);

      // const { _id } = doc;

      const valueWithType = { ...geoValue, domainName: schema.name };
      // console.log('*****', valueWithType);

      // Append geolocation value to the array and filter nils
      return [...acc, valueWithType].filter(element => !!element);
    }

    /* if (field.type.constructor === Types.Model) {
      const { name: domainName } = field.type;

      const subSchema = getSchema(domainName);
      if (!subSchema) { return acc; }

      if (!doc[field.name]) {
        return acc;
      }

      return [...acc, ...getGeoPoints(doc[field.name], subSchema)];
    } */

    return acc;
  }, []);
};

const Form = ({ doc, fieldValues, geoCache, onFieldChange, path, schema }) => {
  // If doc is undefined, form is rendering for a new doc so use transient fieldValues
  const data = doc || fieldValues;
  // const geoPoints = getGeoPoints(data, schema);

  const geo = getGeo(data, schema);
  // console.log('>>> Geo:', geo);
  // console.log('>>>> Geocache:', geoCache);

  const entries = geo.map((entry) => {
    // console.log(entry);
    const { domainName, timeRanges } = entry;

    if (!timeRanges) { return {}; }

    const geoPoints = timeRanges.map((timeRange) => {
      const { start, end } = timeRange;
      return geoCache.filter((cacheValue) => {
        const { timestamp } = cacheValue;
        return end ? timestamp >= start && timestamp <= end :
          timestamp >= start;
      });
    });

    return { domainName, geoPoints };
  });

  // console.log('>>>>> Passing entries to map:', entries);

  const map = (
    <Map
      location={[40.7294245, -73.9958957]}
      points={[]}
      entries={entries}
    />
  );

  const fields = (
    <ol className="formFields">
      <Fields
        fieldValues={fieldValues}
        initialValues={doc}
        onFieldChange={onFieldChange}
        path={path}
        schema={schema}
      />
    </ol>
  );

  const tabbedViews = [
    {
      id: 'Data',
      component: fields
    },
    {
      id: 'Map',
      component: map
    }
  ];

  return (
    <div className="form">
      <TabbedView views={tabbedViews} />
    </div>
  );
};

Form.propTypes = {
  doc: PropTypes.object,
  fieldValues: PropTypes.object,
  geoCache: PropTypes.arrayOf(
    PropTypes.shape(
      {
        coords: PropTypes.shape({
          latitude: PropTypes.number,
          longitude: PropTypes.number
        }),
        timestamp: PropTypes.number
      }
    )
  ),
  path: PropTypes.array,
  onFieldChange: PropTypes.func,
  schema: PropTypes.object.isRequired,
};

Form.defaultProps = {
  doc: {},
  fieldValues: {},
  geoCache: [],
  path: [],
  onFieldChange: () => {}
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Form);
