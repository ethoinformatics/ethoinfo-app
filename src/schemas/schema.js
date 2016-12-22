import moment from 'moment';
import { toJS } from 'mobx';

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
  constructor(name, typeStringOrArray, customTypes) {
    this.name = name;
    this.isCollection = false;

    let typeString = typeStringOrArray;

    if (Array.isArray(typeStringOrArray)) {
      if (typeStringOrArray.length === 0) {
        throw new Error('Type array must contain a Type string');
      } else {
        this.isCollection = true;
        typeString = typeStringOrArray[0];
      }
    }

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
      default:
        if (customTypes.modelNames.includes(typeString)) {
          this.type = new Types.Model(typeString);
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
  constructor(name, fields, customTypes) {
    super(name);

   // console.log('Making schema', name, toJS(fields));

    // Map field strings
    this.fields = toJS(fields).map(field =>
      new Field(field.name, field.type, customTypes)
    ).filter(field => field.type !== null);
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
