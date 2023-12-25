const CategoryCreate = {
  name: "required|string",
  By: "required|string",
};

const CategoryUpdate = {
  name: "string",
  By: "string",
};

module.exports = {
  CategoryCreate,
  CategoryUpdate,
};
