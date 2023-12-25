const SupplierCreate = {
  name: "required|string",
  address: "required|string",
  phone: "required|decimal",
  email: "required|string",
  By: "required|string",
};

const SupplierUpdate = {
  name: "string",
  address: "string",
  phone: "decimal",
  email: "string",
  By: "string",
};
module.exports = {
  SupplierCreate,
  SupplierUpdate,
};
