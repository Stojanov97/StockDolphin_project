const { create, read, move } = require("../../../pkg/invoices");
const {
  InvoiceCreate,
  InvoiceMove,
} = require("../../../pkg/invoices/validate");
const { validate } = require("../../../pkg/validator");

const createHandler = async (req, res) => {
  try {
    const { admin } = req.auth;
    if (admin === false) throw { code: 401, error: "You aren't an admin" }; // Check if user is admin
    await validate(req.body, InvoiceCreate); // Validate the data
    await create(req.body); // Create the invoice
    return await res.json({ success: true }); // Return success
  } catch (err) {
    return res
      .status(err.code || 500)
      .json({ success: false, err: err.error || "Internal server error" });
  }
};

const moveHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { admin } = req.auth;
    if (admin === false) throw { code: 401, error: "You aren't an admin" }; // Check if user is admin
    await validate(req.body, InvoiceMove); // Validate the data
    await move(id, req.body); // Move the invoice
    return await res.json({ success: true }); // Return success
  } catch (err) {
    return res
      .status(err.code || 500)
      .json({ success: false, err: err.error || "Internal server error" });
  }
};

const readHandler = async (req, res) => {
  try {
    const data = await read(); // Get all invoices
    return await res.json(data); // Return invoices
  } catch (err) {
    return res
      .status(err.code || 500)
      .json({ success: false, err: err.error || "Internal server error" });
  }
};

module.exports = {
  createHandler,
  moveHandler,
  readHandler,
};
