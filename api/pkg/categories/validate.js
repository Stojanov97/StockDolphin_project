const CategoryCreate = {
  name: "required|string",
  By: "required|string",
};

const CategoryUpdate = {
  name: "required",
  photo: "required",
};

module.exports = {
  CategoryCreate,
  CategoryUpdate,
};
