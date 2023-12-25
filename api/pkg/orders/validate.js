const OrderCreate = {
  supplier: "required|string",
  supplierId: "required|string",
  price: "required|decimal",
  quantity: "required|decimal",
  item: "required|string",
  date: "required|date",
  By: "required|string",
};

const OrderUpdate = {
  supplier: "string",
  supplierId: "string",
  price: "decimal",
  quantity: "decimal",
  date: "date",
  By: "string",
};

module.exports = {
  OrderCreate,
  OrderUpdate,
};
