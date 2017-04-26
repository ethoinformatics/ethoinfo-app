import React from 'react';
import PropTypes from 'prop-types';
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

      // console.log('Recursing:', field.name);
      return [...acc, ...getGeoPoints(doc[field.name], subSchema)];
    }

    return acc;
  }, []);
};

const Form = ({ doc, fieldValues, onFieldChange, path, schema }) => {
  const geoPoints = getGeoPoints(doc, schema);

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
  path: PropTypes.array,
  onFieldChange: PropTypes.func,
  schema: PropTypes.object.isRequired,
};

Form.defaultProps = {
  onFieldChange: () => {}
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Form);
