const {
  create,
  read,
  readByID,
  update,
  remove,
} = require("../../../pkg/suppliers");
const activity = require("../../../pkg/activity");
const {
  SupplierCreate,
  SupplierUpdate,
} = require("../../../pkg/suppliers/validate");
const { validate } = require("../../../pkg/validator");

const createHandler = async (req, res) => {
  try {
    const { admin, id, username } = req.auth;
    if (admin === false) throw { code: 401, error: "You aren't an admin" }; // Check if user is admin
    let data = { ...req.body, ...{ By: { id: id, name: username } } }; // Add user info to the data
    await validate(data, SupplierCreate); // Validate the data
    let supplier = await create(data); // Create the supplier
    await activity.create({
      // Log the activity
      By: { id: id, name: username },
      action: "created",
      what: "supplier",
      item: { name: supplier.name, id: supplier._id },
      in: { name: supplier.name, id: supplier._id },
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
    return await res.json(await read()); // Get all suppliers and return them
  } catch (err) {
    return res
      .status(err.code || 500)
      .json({ success: false, err: err.error || "Internal server error" });
  }
};

const updateHandler = async (req, res) => {
  try {
    const { admin, id: userID, username } = req.auth;
    if (admin === false) throw { code: 401, error: "You aren't an admin" }; // Check if user is admin
    const { id } = req.params;
    let data = { ...req.body, ...{ By: { id: userID, name: username } } }; // Add user info to the data
    await validate(data, SupplierUpdate); // Validate the data
    await update(id, data); // Update the supplier
    let supplier = await readByID(id); // Get the updated supplier
    await activity.create({
      // Log the activity
      By: { id: userID, name: username },
      action: "edited",
      what: "supplier",
      item: { name: supplier.name, id: supplier._id },
      in: { name: supplier.name, id: supplier._id },
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
    let supplier = await readByID(id); // Get the supplier
    await remove(id); // Remove the supplier
    await activity.create({ // Log the activity
      By: { id: userID, name: username },
      action: "deleted",
      what: "supplier",
      item: { name: supplier.name, id: supplier._id },
      in: { name: supplier.name, id: supplier._id },
    });
    return await res.json({ success: true }); // Return success
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
};
