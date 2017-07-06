import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './form.styl';

import Mapper from '../mapper';
import TabbedView from '../tabbedView';
import Fields from './fields';

import { mapGeoFromCache } from '../../utilities/geoUtils';

const mapStateToProps = state => ({
  geoCache: state.geo.entries // Todo: make selector!
});

const mapDispatchToProps = () => ({});

const Form = ({ doc, fieldValues, geoCache, onFieldChange, path, schema }) => {
  // If doc is undefined, form is rendering for a new doc so use transient fieldValues
  const data = doc ? { ...doc, ...fieldValues } : fieldValues;

  console.log('Rendering form for:', doc, fieldValues, schema);

  // Gather any geolocation data contained in document, including through children
  const entries = mapGeoFromCache(data, schema, geoCache);
  console.log('>>> Entries:', entries);

  const map = (
    <Mapper entries={entries} />
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
