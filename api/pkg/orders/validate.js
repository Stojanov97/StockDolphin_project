const OrderCreate = {
  supplier: "required|object",
  price: "required|decimal",
  quantity: "required|decimal",
  item: "required|object",
  category: "required|object",
  date: "required|date",
  By: "required|object",
};

const OrderUpdate = {
  supplier: "object",
  price: "decimal",
  quantity: "decimal",
  date: "date",
  By: "object",
};

module.exports = {
  OrderCreate,
  OrderUpdate,
};
