const { create, read } = require("../../../pkg/invoices");
const { InvoiceCreate } = require("../../../pkg/invoices/validate");
const { validate } = require("../../../pkg/validator");

const createHandler = async (req, res) => {
  try {
    await validate(req.body, InvoiceCreate);
    await create(req.body);
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
  readHandler,
};
