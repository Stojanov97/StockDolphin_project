const config = require("../../../pkg/config").get;
const {
  create,
  read,
  readByID,
  readByCategory,
  update,
  remove,
  removeByCategory
} = require("../../../pkg/items");
const activity = require("../../../pkg/activity");
const {
  ItemCreate,
  ItemUpdate,
  ItemMove,
} = require("../../../pkg/items/validate");
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
    let data = { // Add user info and category to the data
      name: req.body.name,
      category: { id: req.body.category, name: req.body.categoryName },
      By: { id: id, name: username },
    };
    await validate(data, ItemCreate); // Validate the data
    let item = await create(data); // Create the item
    req.files && upload(req.files.photo, "item", item._id); // Check for a photo & if true upload
    await activity.create({ // Log the activity
      By: { name: username, id: id },
      action: "created",
      what: "item",
      item: { id: item._id, name: item.name },
      in: { id: req.body.category, name: req.body.categoryName },
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
    let items = await read(); // Get all items
    let photos = await downloadAll("item"); // Get all photos
    items = items.map((item) => { // Map through items and add photo to each item if extant
      return {
        ...item._doc,
        ...{
          photo: photos.find(({ id }) => item._doc._id == id) || false,
        },
      };
    });
    return await res.json(items); // Return items
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
      name: req.body.name,
      By: { id: userID, name: username },
    };
    await validate(data, ItemUpdate); // Validate the data
    let item = await readByID(id); // Get the item
    req.files && updateFile(req.files.photo, "item", id); // Check for a photo & if true update
    if (req.body.removePhoto === "true") { // Check if user wants to remove the photo
      await removeFile("item", id);
    }
    await update(id, data); // Update the item
    await activity.create({ // Log the activity
      By: { name: username, id: userID },
      action: "edited",
      what: "item",
      item: { id: item._id, name: item.name },
      in: item.category,
    });
    return await res.json({ success: true }); // Return success
  } catch (err) {
    return res
      .status(err.code || 500)
      .json({ success: false, err: err.error || "Internal server error" });
  }
};

const moveHandler = async (req, res) => {
  try {
    const { admin, username, id: userID } = req.auth;
    if (admin === false) throw { code: 401, error: "You aren't an admin" }; // Check if user is admin
    const { id } = req.params;
    let data = { // Add user info to the data
      ...req.body,
      By: { id: userID, name: username },
    };
    await validate(data, ItemMove); // Validate the data 
    await update(id, data); // Move the item
    await fetch( // Ping the orders service to update all orders with the new category
      `http://127.0.0.1:${config(
        "APP_PORT"
      )}/api/v1/invoices/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Cookie": `token=${req.cookies.token}`,
        },
        body: JSON.stringify(req.body),
      }
    ).then((res) => res.json()).then((data) => console.log(data)).catch((err) => console.log(err));
    let item = await readByID(id); // Get the item
    await activity.create({ // Log the activity
      By: { name: username, id: userID },
      action: "moved",
      what: "item",
      item: { id: id, name: item.name },
      in: req.body.category,
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
    let item = await readByID(id); // Get the item
    await remove(id); // Delete the item
    await removeFile("item", id); // Delete the photo
    await fetch(`http://127.0.0.1:${config("APP_PORT")}/api/v1/orders/item/${id}`, { // Ping the orders service to delete all orders with the item
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Cookie": `token=${req.cookies.token}`,
      },
    } )
    await activity.create({  // Log the activity
      By: { name: username, id: userID },
      action: "deleted",
      what: "item",
      item: { id: item._id, name: item.name },
      in: item.category,
    });
    return await res.json({ success: true }); // Return success
  } catch (err) {
    return res
      .status(err.code || 500)
      .json({ success: false, err: err.error || "Internal server error" });
  }
};

const deleteByCategoryHandler = async (req, res) => {
  try {
    const { admin } = req.auth;
    if (admin === false) throw { code: 401, error: "You aren't an admin" }; // Check if user is admin
    const { id } = req.params;
    const items = await readByCategory(id); // Get all items in the category
    await items.forEach(item=>{ // Delete all item photos in the category
      removeFile("item", item._id);
    })
    await removeByCategory(id); // Delete all items in the category
    return await res.json({ success: true }); // Return success
  } catch (err) {
    return res
      .status(err.code || 500)
      .json({ success: false, err: err.error || "Internal server error" });
  }
};

const readActivityHandler = async (req, res) => {
  try {
    return await res.json(await activity.read()); // Get all activity logs
  } catch (err) {
    return res
      .status(err.code || 500)
      .json({ success: false, err: err.error || "Internal server error" });
  }
};

const getImage = async (req, res) => {
  try {
    const path = await downloadByID("item", req.params.id); // Get the photo
    return await res.sendFile( // Send the photo
      path,
      (err) => {
        if (err) {
          console.log(err);
        }
      }
    );
  } catch (err) {
    return res
      .status(err.code || 500)
      .json({ success: false, err: err.error || "Internal server error" });
  }
};

const getLength = async (req, res) => {
  try {
    return res.json((await read()).length); // Get the length of all items and return it
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
  moveHandler,
  deleteHandler,
  deleteByCategoryHandler,
  readActivityHandler,
  getImage,
  getLength,
};
