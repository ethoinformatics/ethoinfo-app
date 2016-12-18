import React from 'react';
import { Button, Page } from 'react-onsenui';
import { toJS } from 'mobx';
import _ from 'lodash';

// Recursive field renderer
const renderField = (field) => {
  const { name, type } = field;
  return (
    <div>
      {`${name}, ${type}`}
    </div>
  );
};

const NewDocument = ({ domain, schema, actions }) => {
  const schemaDef = schema ? toJS(schema) : null;
  const fields = schemaDef ? schemaDef.validation.value.fields : [];
  // const { create, onCreate } = actions;
  console.log(domain, fields, actions);
  return (
    <Page className="newDocument">
      {
        fields.map((field, index) => {
          return (
            <div key={index}>
              { renderField(field) }
            </div>
          );
        })
      }
    </Page>
  );
};

// Use generic "React.PropTypes.object" for now.

/* eslint-disable react/no-unused-prop-types */
NewDocument.propTypes = {
  domain: React.PropTypes.string,
  schema: React.PropTypes.object, // eslint-disable-line  react/forbid-prop-types
  actions: React.PropTypes.shape({
    create: React.PropTypes.func.isRequired,
    // onCreate: React.PropTypes.func.isRequired
  })
};
/* eslint-enable react/no-unused-prop-types */

export default NewDocument;
