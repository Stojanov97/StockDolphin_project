const ItemCreate = {
  name: "required|string",
  category: "required|object",
  By: "required|object",
};

const ItemUpdate = {
  name: "string",
  category: "object",
  By: "object",
};
const ItemMove = {
  category: "required|object",
};

module.exports = {
  ItemCreate,
  ItemUpdate,
  ItemMove,
};
