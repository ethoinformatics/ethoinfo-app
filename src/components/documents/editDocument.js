import React from 'react';
import R from 'ramda';
import { connect } from 'react-redux';

// Components
import { Button, Page } from 'react-onsenui';
import Form from '../forms/form';
import Map from '../map/map';
import Tabs from '../tabs/tabs';

import { Types } from '../../schemas/schema';

import './editDocument.styl';
import './documentForm.styl';

import { getSchema } from '../../schemas/main';

// Actions
import { update, deleteDoc as _deleteDoc } from '../../redux/actions/documents';
import { resetFields as resetFieldsAtPath } from '../../redux/actions/fields';

// Selectors
import { getByPath as getFieldsByPath } from '../../redux/reducers/fields';
import { getById } from '../../redux/reducers/documents';

const getGeoPoints = (doc, schema) => { // eslint-disable-line arrow-body-style
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

      return acc.push(doc[field.name]);
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

const mapStateToProps = (state, ownProps) =>
  ({
    doc: getById(state.docs.byId, ownProps.id),
    fieldValues: getFieldsByPath(state.fields, ownProps.fieldsPath),
    historyPath: state.views.history.path // Todo: make a selector
  });

const mapDispatchToProps = (dispatch, ownProps) => ({
  updateDoc: (id, newValues) => dispatch(update(id, newValues)),
  deleteDoc: (id, rev) => dispatch(_deleteDoc(id, rev)),
  resetFields: () => dispatch(resetFieldsAtPath(ownProps.fieldsPath))
});

const TABS = {
  DATA: 'Data',
  MAP: 'Map',
};

class EditDocument extends React.Component {
  constructor() {
    super();

    this.state = {
      activeTab: TABS.DATA
    };

    // Bind context so we can pass function to event handlers.
    this.saveFields = this.saveFields.bind(this);
    this.deleteDoc = this.deleteDoc.bind(this);
    this.onSelectTab = this.onSelectTab.bind(this);
  }

  saveFields() {
    const { actions, updateDoc, id, fieldValues, resetFields } = this.props;

    updateDoc(id, fieldValues)
    .then(() => {
      actions.onUpdate();
      resetFields();
    })
    .catch((err) => {
      console.log('Error saving new document:', err);
    });
  }

  onSelectTab(id) {
    this.setState({
      activeTab: id
    });
  }

  deleteDoc() {
    const { actions, deleteDoc, doc, resetFields } = this.props;

    deleteDoc(doc._id, doc._rev)
    .then(() => {
      actions.onUpdate();
      resetFields();
    })
    .catch((err) => {
      console.log('Error editing document:', err);
    });
  }

  render() {
    const { doc, domain, fieldsPath, fieldValues, historyPath, resetFields } = this.props;
    const schema = getSchema(domain);

    /* const pathToComponents = R.split('/');
    const padComponents = R.map(p => [p, '']);
    const makeComponents = R.pipe(pathToComponents, R.tail, padComponents, R.flatten);
    const components = makeComponents(historyPath); */

    const showMap = this.state.activeTab === TABS.MAP;
    const showForm = this.state.activeTab === TABS.DATA;

    // console.log('Rendering edit doc:', doc, schema.fields);

    const geoPoints = getGeoPoints(doc, schema);

    console.log('>> editDocument >> geo points:', geoPoints);

    return (
      <Page className="editDocument">
        { /* Breadcrumb logic is now handled in app.js and modal.js */ }
        {/* <Breadcrumbs path={components} /> */}

        <Tabs
          activeId={this.state.activeTab}
          ids={[TABS.DATA, TABS.MAP]}
          onSelectTab={this.onSelectTab}
        />
        {
          showMap && (
          <div
            className="mapContainer"
            style={{
              transform: showMap ? 'translate3d(0,0,0)' : 'translate3d(100%,0,0)'
            }}
          >
            <Map
              location={[40.7294245, -73.9958957]}
              points={geoPoints}
              entries={[]}
            />
          </div>
          )
        }
        {
          showForm && (
          <Form
            path={fieldsPath}
            initialValues={doc}
            fieldValues={fieldValues}
            schema={schema}
          />
          )
        }
        <div className="actions">
          <Button modifier="large" onClick={this.saveFields}>Save</Button>
          {/* <Button modifier="large" onClick={resetFields}>Reset fields</Button> */}
          <Button modifier="large" onClick={this.deleteDoc}>Delete</Button>
        </div>
      </Page>
    );
  }
}

/* eslint-disable react/no-unused-prop-types */
EditDocument.propTypes = {
  id: React.PropTypes.string.isRequired,
  doc: React.PropTypes.object,
  actions: React.PropTypes.shape({
    onUpdate: React.PropTypes.func.isRequired,
  }),
  deleteDoc: React.PropTypes.func,
  updateDoc: React.PropTypes.func,
  domain: React.PropTypes.string,
  historyPath: React.PropTypes.string,
  fieldsPath: React.PropTypes.array,
  fieldValues: React.PropTypes.object,
  resetFields: React.PropTypes.func
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditDocument);
