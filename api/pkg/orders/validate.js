const OrderCreate = {
  supplier: "required|object",
  price: "required|decimal",
  quantity: "required|decimal",
  item: "required|object",
  category: "required|object",
  date: "required|date",
  By: "required|object",
};

module.exports = {
  OrderCreate,
};
