const { create, read, move } = require("../../../pkg/invoices");
const {
  InvoiceCreate,
  InvoiceMove,
} = require("../../../pkg/invoices/validate");
const { validate } = require("../../../pkg/validator");

const createHandler = async (req, res) => {
  try {
    const { admin } = req.auth;
    if (admin === false) throw { code: 401, error: "You aren't an admin" };
    await validate(req.body, InvoiceCreate);
    await create(req.body);
    return await res.json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

const moveHandler = async (req, res) => {
  try {
    console.log(req.body)
    const { id } = req.params;
    const { admin } = req.auth;
    if (admin === false) throw { code: 401, error: "You aren't an admin" };
    await validate(req.body, InvoiceMove);
    await move(id, req.body);
    return await res.json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

const readHandler = async (req, res) => {
  try {
    const data = await read();
    return await res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

module.exports = {
  createHandler,
  moveHandler,
  readHandler,
};
