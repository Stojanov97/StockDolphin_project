const fs = require("fs");

const chars = "QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm1234567890";
const MAX_FILESIZE = 2097152;
const FILETYPES = ["image/jpg", "image/jpeg"];

const setID = async () => {
  let ID = "";
  for (let i = 0; i < 10; i++)
    ID += chars.charAt(Math.floor(Math.random() * chars.length));
  return ID;
};

const getFile = async () => {};

const upload = async (file, id) => {
  if (MAX_FILESIZE < file.size)
    throw {
      code: 400,
      error: "File exceeds the max file size",
    };
  if (!FILETYPES.includes(file.mimetype))
    throw {
      code: 400,
      error: "Unsupported file type",
    };
  const categoryDirectory = `${__dirname}/../../uploads/cat_${id}`;
  const filePath = `${categoryDirectory}/${await setID()}_${file.name}`;
  await fs.open(categoryDirectory, "r", async (err) => {
    if (err) {
      if (err.code === "ENOENT")
        await fs.mkdir(categoryDirectory, { recursive: true }, (err) => {
          if (err) throw err;
          else
            file.mv(filePath, (err) => {
              if (err) throw err;
            });
        });
    } else {
      await file.mv(filePath, (err) => {
        if (err) throw err;
      });
    }
  });
};

module.exports = {
  upload,
};
