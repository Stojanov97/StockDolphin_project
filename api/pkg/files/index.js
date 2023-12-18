const fs = require("fs");
const path = require("path");

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

const downloadAll = async (type) => {
  try {
    const destination = `${__dirname}/../../uploads/${type}`;
    let files = await new Promise((resolve, reject) =>
      fs.readdir(destination, { recursive: true }, (err, files) => {
        if (err) reject(err);
        else resolve(files);
      })
    );
    files = files
      .filter(
        (value) => path.parse(value).base !== path.parse(value).name && value
      )
      .map((value) => {
        let split = path.dirname(value).split(path.sep);
        return {
          id: split[split.length - 1],
          dest: path.normalize(`${destination}/${value}`),
        };
      });
    return files;
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

const updateFile = async (file, type, id) => {
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
          if (err.code === "ENOENT") {
            fs.mkdir(destination, { recursive: true }, (err) => {
              if (err) throw err;
              else moveFile(file, filePath);
            });
          }
        } else {
          fs.readdir(destination, { recursive: true }, (err, files) => {
            if (err) throw err;
            files.forEach((file) =>
              fs.unlink(path.join(destination, file), (err) => {
                if (err) throw err;
              })
            );
          });
          moveFile(file, filePath);
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

const removeFile = async (type, id) => {
  try {
    const destination = `${__dirname}/../../uploads/${type}/${id}`;
    await fs.open(destination, "r+", (err, fd) => {
      try {
        if (!err)
          fs.rm(destination, { recursive: true }, (err) => {
            if (err) throw err;
          });
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
module.exports = {
  upload,
  downloadAll,
  updateFile,
  removeFile,
};
