const OrderCreate = {
  supplier: "required|string",
  price: "required|decimal",
  quantity: "required|decimal",
  item: "required|string",
  By: "required|string",
};

const OrderUpdate = {
  supplier: "string",
  price: "decimal",
  quantity: "decimal",
};

module.exports = {
  OrderCreate,
  OrderUpdate,
};
