const CategoryCreate = {
  name: "required|string",
  By: "required|object",
};

const CategoryUpdate = {
  name: "string",
  By: "object",
};

module.exports = {
  CategoryCreate,
  CategoryUpdate,
};
