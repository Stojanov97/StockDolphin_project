const InvoiceCreate = {
  name: "required|string",
  supplier: "required|object",
  date: "required|date",
  orders: "required|array",
  item: "required|object",
  category: "required|object",
  total: "required|decimal",
};

const InvoiceMove = {
  category: "required|object",
};

module.exports = {
  InvoiceCreate,
  InvoiceMove,
};
