const CategoryCreate = {
  name: "required|string",
  By: "required|string",
};

const CategoryUpdate = {
  name: "string",
};

module.exports = {
  CategoryCreate,
  CategoryUpdate,
};
