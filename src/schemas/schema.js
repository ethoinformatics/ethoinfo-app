import moment from 'moment';
import R from 'ramda';

class DataType {}
class DataTypeString extends DataType {}
class DataTypeBoolean extends DataType {}
class DataTypeNumber extends DataType {}
class DataTypeDate extends DataType {}
class DataTypeGeolocation extends DataType {}

class DataTypeCustom extends DataType {
  constructor(name) {
    super();
    this.name = name;
  }
}

class DataTypeCategory extends DataTypeCustom {
  constructor(name) {
    super();
    this.name = name;
  }
}

class DataTypeModel extends DataTypeCustom {
  constructor(name) {
    super();
    this.name = name;
  }
}

const Types = {
  String: DataTypeString,
  Boolean: DataTypeBoolean,
  Number: DataTypeNumber,
  Date: DataTypeDate,
  Geolocation: DataTypeGeolocation,
  Category: DataTypeCategory,
  Model: DataTypeModel
};

class Schema {
  constructor(name) {
    this.name = name;
  }
}

class CategorySchema extends Schema {
}

class Field {
  constructor(name, isLookup, typeStringOrArray, options, customTypes) {
    this.name = name;
    this.isCollection = false;

    let typeString = typeStringOrArray;

    // Check if type is a string
    if (Array.isArray(typeStringOrArray)) {
      if (typeStringOrArray.length === 0) {
        throw new Error('Type array must contain a Type string');
      } else {
        this.isCollection = true;
        typeString = typeStringOrArray[0];
      }
    }

    this.options = {};

    // console.log('Making field', name, typeString, this.isCollection);

    switch (typeString) {
      case 'String':
        this.type = new Types.String();
        break;
      case 'Boolean':
        this.type = new Types.Boolean();
        break;
      case 'Number':
        this.type = new Types.Number();
        break;
      case 'Date':
        this.type = new Types.Date();
        break;
      case 'Geolocation':
        this.type = new Types.Geolocation();
        this.options.track = !!options.track; // coerce boolean.
        break;
      default:
        if (customTypes.modelNames.includes(typeString)) {
          this.type = new Types.Model(typeString);
          this.isLookup = isLookup || false;
          break;
        } else if (customTypes.categoryNames.includes(typeString)) {
          this.type = new Types.Category(typeString);
          break;
        }
        this.type = null; // No match
        break;
    }
  }
}

class ModelSchema extends Schema {
  constructor(def, types) {
    const { name, fields, displayField } = def;
    super(name);

    // Make sure the "displayField" actually exists as a field name on model
    const displayFieldValue = R.find(R.propEq('name', displayField))(fields);

    // Validate that displayField exists and is a string, or assign default _id
    this.displayField =
      displayFieldValue &&
      (displayFieldValue.type === 'String' || displayFieldValue.type === 'Date')
      ? displayFieldValue.name : '_id';

    // Map field strings
    this.fields = fields.map((field) => { // eslint-disable-line arrow-body-style
      return new Field(
        field.name,
        field.lookup || false,
        field.type,
        field.options || {},
        types
      );
    }
    ).filter(field => field.type !== null);
  }

  // Get user friendly string representation of model
  // for display in the application.
  // This string value is based on the "displayField" set on the model schema,
  // which pulls from one of the model's fields.
  getFriendlyString(document) {
    const fieldToDisplay = this.fields.find(field => field.name === this.displayField);
    if (!fieldToDisplay) { return document._id; }

    const displayValue = document[fieldToDisplay.name];

    switch (fieldToDisplay.type.constructor) {
      case Types.Date:
        // https://momentjs.com/
        return displayValue ? moment(displayValue).format('YYYY-MM-DD h:mm a') : document._id;

      case Types.String:
        return displayValue;
      default:
        return displayValue;
    }
  }

  getDefaultState() {
    return Object.assign(...this.fields.map((field) => {
      let value = null;

      switch (field.type.constructor) {
        case Types.Date:
          value = moment.now();
          break;
        default:
          break;
      }

      return { [field.name]: value };
    }));
  }
}

export {
  CategorySchema,
  ModelSchema,
  Types
};
