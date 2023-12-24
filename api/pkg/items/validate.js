const ItemCreate = {
  name: "required|string",
  category: "required|string",
  By: "required|string",
};

const ItemUpdate = {
  name: "string",
  category: "string",
};

module.exports = {
  ItemCreate,
  ItemUpdate,
};
