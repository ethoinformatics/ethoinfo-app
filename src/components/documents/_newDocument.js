import React from 'react';
import { Button, Input, Page } from 'react-onsenui';
import { SingleDatePicker } from 'react-dates';
import { toJS } from 'mobx';
import _ from 'lodash';
import 'react-dates/lib/css/_datepicker.css';

import { Types } from '../../schemas/schema';
import './documentForm.styl';

class NewDocument extends React.Component {
  constructor() {
    super();
    this.state = {
    };
  }

  // Recursive field renderer
  renderField(field, dataStore) {
    const { name, type } = field;
    let formField = null;

    console.log(name, type);

    let domainName = '';
    let options = [];
    let schema = null;

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
      case Types.Category: // eslint-disable-line  no-case-declarations
        domainName = type.name;
        console.log(domainName);
        options = [];
        options = [null, ...(dataStore.getData(domainName) || [])];
        console.log(options);
        // console.log(dataStore.getData(domainName));
        formField =
          (<select>
            {
              options.map((option, ii) =>
                (<option
                  key={`${ii}`}
                  value={option ? option.name : ''}
                >
                  {option ? option.name : ''}
                </option>)
              )
            }
          </select>
          );
        break;
      case Types.Model: // eslint-disable-line  no-case-declarations
        domainName = type.name;
        schema = dataStore.getSchema(domainName);
        formField = <div className="modelFieldTmp">model field(s) go here</div>;
        /* if (schema) {
          // Recursive render
          formField = <ul>{this.renderSchema(schema, dataStore)}</ul>;
        } */

        break;
      default:
        break;
    }

    return formField;
  }

  renderSchema(schema, dataStore) {
    return schema.fields.map((field, index) =>
      <li className="field" key={index}>
        <label htmlFor={field.name}>{_.startCase(field.name)}</label>
        { this.renderField(field, dataStore) }
      </li>
    );
  }

  render() {
    const { dataStore, domain, schema, actions } = this.props;
    // const schemaDef = schema ? toJS(schema) : null;
    // const fields = schemaDef ? schemaDef.validation.value.fields : [];
    const { fields } = schema;
    console.log(schema);
    // console.log(fields);
    // console.log('*********');
    // console.log(schema.getDefaultState());
    return (
      <Page className="newDocument">
        <ol className="documentForm">
          {
            this.renderSchema(toJS(schema), dataStore)
            /* fields.map((field, index) => {
              return (
                <li className="field" key={index}>
                  <label htmlFor={field.name}>{_.startCase(field.name)}</label>
                  { this.renderField(field, dataStore) }
                </li>
              );
            })*/
          }
        </ol>
        <Button
          modifier="large"
          onClick={() => {
            console.log('Button click');

            /* createAction({
              name
            })
            .then(() => {
              console.log(`Success creating code: ${name}`);
              createSuccessAction();
            })
            .catch((err) => {
              console.log(`Error creating code: ${name} =>`, err);
            }); */
          }}
        >Save</Button>
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
  dataStore: React.PropTypes.object, // eslint-disable-line  react/forbid-prop-types
  domain: React.PropTypes.string,
  schema: React.PropTypes.object, // eslint-disable-line  react/forbid-prop-types
  actions: React.PropTypes.shape({
    create: React.PropTypes.func.isRequired,
    // onCreate: React.PropTypes.func.isRequired
  })
};
/* eslint-enable react/no-unused-prop-types */

export default NewDocument;
