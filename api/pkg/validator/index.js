const { Validator } = require("node-input-validator");

const validate = (data, schema) => { // Function to validate the data
  let validator = new Validator(data, schema); // Create a new validator object
  let validated = validator.check(); // Check the data against the schema
  if (!validated) { // If the data does not match the schema, throw an error, else continue
    throw {
      code: 400,
      error: validator.errors,
    };
  }
};

module.exports = {
  validate,
};
