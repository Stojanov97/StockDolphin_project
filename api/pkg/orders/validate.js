const OrderCreate = {
  name: "required|string",
  item: "required|string",
  By: "required|string",
};

const OrderUpdate = {
  name: "string",
  item: "string",
};

module.exports = {
  OrderCreate,
  OrderUpdate,
};
