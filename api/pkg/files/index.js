const fs = require("fs");
const path = require("path");

const chars = "QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm1234567890";
const MAX_FILESIZE = 2097152;
const FILETYPES = ["image/jpg", "image/jpeg"];

const setID = () => {
  let ID = "";
  for (let i = 0; i < 10; i++)
    ID += chars.charAt(Math.floor(Math.random() * chars.length));
  return ID;
};

const moveFile = (file, to) => {
  file.mv(to, (err) => {
    if (err) {
      throw {
        code: err.status,
        error: err.message,
      };
    }
  });
};

const downloadAll = async (type) => {
  try {
    const destination = `${__dirname}/../../uploads/${type}`;
    let files = await fs.promises.readdir(destination, { recursive: true });
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
    if (err.code === "ENOENT") {
      return [];
    } else {
      throw { error: err };
    }
  }
};

const downloadByID = async (type, id) => {
  try {
    const destination = `${__dirname}/../../uploads/${type}/${id}`;
    let files = await fs.promises.readdir(destination, { recursive: true });
    files = files
      .filter(
        (value) => path.parse(value).base !== path.parse(value).name && value
      )
      .map((value) => {
        return path.normalize(`${destination}/${value}`);
      });
    console.log(files[0]);
    return files[0];
  } catch (err) {
    if (err.code === "ENOENT") {
      return [];
    } else {
      throw { error: err };
    }
  }
};

const upload = (file, type, id) => {
  if (MAX_FILESIZE < file.size)
    throw {
      code: 413,
      error: "File exceeds the max file size",
    };
  if (!FILETYPES.includes(file.mimetype))
    throw {
      code: 400,
      error: "Unsupported file type",
    };
  const destination = `${__dirname}/../../uploads/${type}/${id}`;
  const filePath = `${destination}/${setID()}_${file.name}`;
  fs.open(destination, "r+", (err, fd) => {
    try {
      if (err) {
        if (err.code === "EEXIST") {
          moveFile(file, filePath);
        } else if (err.code === "ENOENT") {
          fs.mkdir(destination, { recursive: true }, (err) => {
            if (err) throw { error: err };
            else moveFile(file, filePath);
          });
        } else {
          throw err;
        }
      }
    } finally {
      if (fd) {
        fs.close(fd, (err) => {
          if (err) throw { error: err };
        });
      }
    }
  });
};

const updateFile = (file, type, id) => {
  if (MAX_FILESIZE < file.size)
    throw {
      code: 413,
      error: "File exceeds the max file size",
    };
  if (!FILETYPES.includes(file.mimetype))
    throw {
      code: 400,
      error: "Unsupported file type",
    };
  const destination = `${__dirname}/../../uploads/${type}/${id}`;
  const filePath = `${destination}/${setID()}_${file.name}`;
  fs.open(destination, "r+", (err, fd) => {
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
};

const removeFile = (type, id) => {
  const destination = `${__dirname}/../../uploads/${type}/${id}`;
  fs.open(destination, "r+", (err, fd) => {
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
};
module.exports = {
  upload,
  downloadAll,
  updateFile,
  removeFile,
  downloadByID,
};
