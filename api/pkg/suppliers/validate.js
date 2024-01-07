const SupplierCreate = {
  name: "required|string",
  address: "required|string",
  phone: "required|decimal",
  email: "required|string",
  By: "required|object",
};

const SupplierUpdate = {
  name: "string",
  address: "string",
  phone: "decimal",
  email: "string",
  By: "object",
};
module.exports = {
  SupplierCreate,
  SupplierUpdate,
};
