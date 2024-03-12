const config = require("../../../pkg/config").get;
const {
  create,
  read,
  readByID,
  update,
  remove,
} = require("../../../pkg/categories");
const activity = require("../../../pkg/activity");
const {
  CategoryCreate,
  CategoryUpdate,
} = require("../../../pkg/categories/validate");
const { validate } = require("../../../pkg/validator");
const {
  upload,
  downloadAll,
  updateFile,
  removeFile,
  downloadByID,
} = require("../../../pkg/files");

const createHandler = async (req, res) => {
  try {
    const { admin, username, id } = req.auth;
    if (admin === false) throw { code: 401, error: "You aren't an admin" }; // Check if user is admin
    let data = { // Add user info to the data
      ...req.body,
      ...{ By: { name: username, id: id } },
    };
    await validate(data, CategoryCreate); // Validate the data
    let category = await create(data); // Create the category
    req.files && upload(req.files.photo, "cat", category._id); // Check for a photo & if true upload
    await activity.create({ // Log the activity
      By: { name: username, id: id },
      action: "created",
      what: "category",
      item: { id: category._id, name: category.name },
      in: { id: category._id, name: category.name },
    });
    return await res.json({ success: true }); // Return success
  } catch (err) {
    return res
      .status(err.code || 500)
      .json({ success: false, err: err.error || "Internal server error" });
  }
};

const readHandler = async (req, res) => {
  try {
    let categories = await read(); // Get all categories
    let photos = await downloadAll("cat"); // Get all photos
    categories = categories.map((cat) => { // Map through categories and add photo to each category if extant
      return {
        ...cat._doc,
        ...{
          photo: photos.find(({ id }) => cat._doc._id == id) || false,
        },
      };
    });
    return await res.json(categories); // Return categories
  } catch (err) {
    return res
      .status(err.code || 500)
      .json({ success: false, err: err.error || "Internal server error" });
  }
};

const updateHandler = async (req, res) => {
  try {
    const { admin, username, id: userID } = req.auth;
    if (admin === false) throw { code: 401, error: "You aren't an admin" }; // Check if user is admin
    const { id } = req.params;
    let data = { // Add user info to the data
      ...req.body,
      ...{ By: { name: username, id: userID } },
    };
    await validate(data, CategoryUpdate); // Validate the data
    req.files && updateFile(req.files.photo, "cat", id); // Check for a photo & if true upload
    if (req.body.removePhoto === "true") { // Check if user wants to remove the photo
      await removeFile("cat", id); // Remove the photo
    }
    await update(id, data); // Update the category
    let category = await readByID(id); // Get the category
    await activity.create({ // Log the activity
      By: { name: username, id: userID },
      action: "edited",
      what: "category",
      item: { id: category._id, name: category.name },
      in: { id: category._id, name: category.name },
    });
    return await res.json({ success: true }); // Return success
  } catch (err) {
    return res
      .status(err.code || 500)
      .json({ success: false, err: err.error || "Internal server error" });
  }
};

const deleteHandler = async (req, res) => {
  try {
    const { admin, username, id: userID } = req.auth;
    if (admin === false) throw { code: 401, error: "You aren't an admin" }; // Check if user is admin
    const { id } = req.params;
    let category = await readByID(id); // Get the category
    await remove(id); // Remove the category
    await removeFile("cat", id); // Remove the photo
    await fetch( // Ping the items service to remove all items from the category
      `http://127.0.0.1:${config("APP_PORT")}/api/v1/items/cat/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Cookie: `token=${req.cookies.token}`,
        },
      }
    );
    await fetch( // Ping the orders service to remove all orders from the category
      `http://127.0.0.1:${config("APP_PORT")}/api/v1/orders/cat/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Cookie: `token=${req.cookies.token}`,
        },
      }
    );
    await activity.create({ // Log the activity
      By: { name: username, id: userID },
      action: "deleted",
      what: "category",
      item: { id: category._id, name: category.name },
      in: { id: category._id, name: category.name },
    });
    return await res.json({ success: true }); // Return success
  } catch (err) {
    return res
      .status(err.code || 500)
      .json({ success: false, err: err.error || "Internal server error" });
  }
};

const getImage = async (req, res) => {
  try {
    const path = await downloadByID("cat", req.params.id); // Get the photo path
    return await res.sendFile(path, (err) => { // Send the photo
      if (err) { // If error log it
        console.log(err);
      }
    });
  } catch (err) {
    return res
      .status(err.code || 500)
      .json({ success: false, err: err.error || "Internal server error" });
  }
};

const getLength = async (req, res) => {
  try {
    return res.json((await read()).length); // Return the number of the categories
  } catch (err) {
    return res
      .status(err.code || 500)
      .json({ success: false, err: err.error || "Internal server error" });
  }
};

module.exports = {
  createHandler,
  readHandler,
  updateHandler,
  deleteHandler,
  getImage,
  getLength,
};
