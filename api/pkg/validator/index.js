const { Validator } = require("node-input-validator");

const validate = (data, schema) => {
  let validator = new Validator(data, schema);
  let validated = validator.check();
  if (!validated) {
    throw {
      code: 400,
      error: validator.errors,
    };
  }
};

module.exports = {
  validate,
};
