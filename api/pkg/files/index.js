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

const download = async (type, id) => {
  try {
    const destination = `${__dirname}/../../uploads/${type}/${id}`;
    await fs.open(destination, "r", async (err) => {
      if (err) {
        if (err.code === "ENOENT") throw { code: 404, error: "File not found" };
      } else {
        let file;
        await fs.readdir(destination, { recursive: true }, (err, files) => {
          if (err) throw err;
          else console.log(files);
        });
      }
    });
  } catch (err) {
    throw new Error(err);
  }
};

const upload = async (file, type, id) => {
  try {
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
    const destination = `${__dirname}/../../uploads/${type}/${id}`;
    const filePath = `${destination}/${await setID()}_${file.name}`;
    await fs.open(destination, "r", async (err) => {
      if (err) {
        if (err.code === "ENOENT")
          await fs.mkdir(destination, { recursive: true }, (err) => {
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
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = {
  upload,
  download,
};
