// Load categories:
    const result = schemaLoader.load(schemas.categories, schemas.models);
    this.schemasDebug.categories = [...result.categories.slice()];
    this.schemasDebug.models = [...result.models.slice()];

    //--------------------

    // Filter valid categories and contruct CategorySchema from plain javascript object
    const validCategories = result.categories.filter(cat => cat.validation.error === null);

    const categorySchemas = validCategories.map((cat) => {
      const name = cat.name;
      return new CategorySchema(name);
    });

    console.log(categorySchemas);

    //--------------------

    // Filter valid models and contruct CategorySchema from plain javascript object
    const validModels = result.models.filter(model => model.validation.error === null);

    const categoryNames = validCategories.map(cat => cat.name);
    const modelNames = validModels.map(model => model.name);

    const modelSchemas = validModels.slice().map((model) => {
      const name = model.name;
      const fields = model.validation.value.fields;
      const displayField = model.validation.value.displayField;
      return new ModelSchema(name, fields, displayField, {
        categoryNames, modelNames
      });
    });

    console.log(modelSchemas);

    //--------------------
    // Assign schemas to our observable object this.schemas
    this.schemas.models = [...modelSchemas];
    this.schemas.categories = [...categorySchemas];

    // Setup observable array entries for each valid schema
    result.models.forEach((model) => {
      const singularName = model.name;
      this.setData(pluralize(singularName), []);
    });