import React from 'react';
import { Button, Page } from 'react-onsenui';
import { SingleDatePicker } from 'react-dates';
import { toJS } from 'mobx';
import _ from 'lodash';
import { Types } from '../../schemas/schema';

import 'react-dates/lib/css/_datepicker.css';
import './documentForm.styl';

class NewDocument extends React.Component {
  constructor() {
    super();
    this.state = {

    };
  }

  // Recursive field renderer
  renderField(field) {
    const { name, type } = field;
    console.log(type);
    let formField = null;

    switch (type.constructor) {
      case Types.Date:
        formField =
          (<SingleDatePicker
            date={this.state.date || null}
            focused={this.state.focused}
            onDateChange={(date) => { this.setState({ date }); }}
            onFocusChange={({ focused }) => { this.setState({ focused }); }}
            numberOfMonths={1}
            isOutsideRange={() => false}
            withPortal
            id={name}
          />);
        break;
      case Types.String:
        formField =
          (<input
            disabled={false}
            type={'text'}
            defaultValue={''}
            style={{ width: '100%' }}
          />);
        break;
      case Types.Number:
        formField =
          (<input
            disabled={false}
            type={'text'}
            defaultValue={''}
            style={{ width: '100%' }}
          />);
        break;
      default:
        break;
    }

    return formField;
  }
  render() {
    const { domain, schema, actions } = this.props;
    // const schemaDef = schema ? toJS(schema) : null;
    // const fields = schemaDef ? schemaDef.validation.value.fields : [];
    const { fields } = schema;
    console.log(fields);
    return (
      <Page className="newDocument">
        <ol className="documentForm">
          {
            fields.map((field, index) => {
              return (
                <li className="field" key={index}>
                  <label htmlFor={field.name}>{field.name}</label>
                  { this.renderField(field) }
                </li>
              );
            })
          }
        </ol>
      </Page>
    );
  }
}

/* const NewDocument = ({ domain, schema, actions }) => {
  const schemaDef = schema ? toJS(schema) : null;
  const fields = schemaDef ? schemaDef.validation.value.fields : [];
  // const { create, onCreate } = actions;
  console.log(domain, fields, actions);
  return (
    <Page className="newDocument">
      <ol className="documentForm">
        {
          fields.map((field, index) => {
            return (
              <li className="field" key={index}>
                <label htmlFor={field.name}>{field.name}</label>
                { renderField(field) }
              </li>
            );
          })
        }
      </ol>
    </Page>
  );
}; */

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
