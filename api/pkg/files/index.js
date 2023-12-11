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

const moveFile = async (file, to) => {
  file.mv(to, (err) => {
    if (err) throw err;
  });
};
const download = async (type, id) => {
  try {
    const destination = `${__dirname}/../../uploads/${type}/${id}`;
    let files = await new Promise((resolve, reject) =>
      fs.readdir(destination, { recursive: true }, (err, files) => {
        if (err) reject(err);
        else resolve(files);
      })
    );
    return `${destination}/${files[0]}`;
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
    await fs.open(destination, "r+", (err, fd) => {
      try {
        if (err) {
          if (err.code === "EEXIST") {
            moveFile(file, filePath);
          } else if (err.code === "ENOENT") {
            fs.mkdir(destination, { recursive: true }, (err) => {
              if (err) throw err;
              else moveFile(file, filePath);
            });
          }
        }
      } finally {
        if (fd) {
          fs.close(fd, (err) => {
            if (err) throw err;
          });
        }
      }
    });
  } catch (err) {
    throw new Error(err);
  }
};
fs.ex;
module.exports = {
  upload,
  download,
};
