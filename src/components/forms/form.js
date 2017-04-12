import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
// import { setField as setFieldAction } from '../../redux/actions/fields';
// import { getAll as getAllDocs } from '../../redux/reducers/documents';

import './form.styl';

import Map from '../map/map';
import TabbedView from '../tabbedView/tabbedView';
import Fields from './fields';

import { getSchema } from '../../schemas/main';
import { Types } from '../../schemas/schema';

const mapStateToProps = () =>
  ({
    // docs: getAllDocs(state.docs),
    // fields: state.fields
  });

const mapDispatchToProps = () => ({
});

// Extract geo points recursively through document and children
const getGeoPoints = (doc, schema) => { // eslint-disable-line arrow-body-style
  console.log('Getting points from:', doc, schema);

  if (!doc) {
    console.log('No doc - returning');
    return [];
  }

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

      // console.log('Recursing:', field.name);
      return [...acc, ...getGeoPoints(doc[field.name], subSchema)];
    }

    return acc;
  }, []);
};

const Form = ({ initialValues, fieldValues, path, schema }) => {
  const doc = initialValues;
  const geoPoints = getGeoPoints(doc, schema);

  console.log('!!!!! Geo points:', doc, geoPoints);

  const map = (
    <Map
      location={[40.7294245, -73.9958957]}
      points={geoPoints}
      entries={[]}
    />
  );

  const fields = (
    <ol className="formFields">
      <Fields
        path={path}
        schema={schema}
        initialValues={initialValues}
        fieldValues={fieldValues}
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
  /* path: PropTypes.arrayOf(
    PropTypes.string
  ).isRequired, */
  path: PropTypes.array,
  initialValues: PropTypes.object,
  fieldValues: PropTypes.object,
  schema: PropTypes.object.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Form);
