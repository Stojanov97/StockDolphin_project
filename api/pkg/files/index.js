const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const chars = "QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm1234567890";
const MAX_FILESIZE = 2097152;
const FILETYPES = ["image/jpg", "image/jpeg"];

const setID = () => { // Function to generate a random 10 character string
  let ID = "";
  for (let i = 0; i < 10; i++)
    ID += chars.charAt(Math.floor(Math.random() * chars.length));
  return ID;
};

const downloadAll = async (type) => { // Function to download all files in a directory
  try {
    const destination = `${__dirname}/../../uploads/${type}`;
    let files = await fs.promises.readdir(destination, { recursive: true });
    files = files
      .filter(
        (value) => path.parse(value).base !== path.parse(value).name && value // Filter out the directories from the files
      )
      .map((value) => {
        let split = path.dirname(value).split(path.sep); // Split the path into an array, and return the last element as the ID - AKA the name of the file
        return {
          id: split[split.length - 1], // File name
          dest: path.normalize(`${destination}/${value}`),
        };
      });

    return files; //Array of objects containing the file name and the file path
  } catch (err) {
    if (err.code === "ENOENT") {
      return [];
    } else {
      throw { error: err };
    }
  }
};

const downloadByID = async (type, id) => { // Function to download a file by its ID - AKA the name of the file
  try {
    const destination = `${__dirname}/../../uploads/${type}/${id}`;
    let file = await fs.promises.readdir(destination, { recursive: true });
    file = file
      .filter(
        (value) => path.parse(value).base !== path.parse(value).name && value // Filter out the directories from the files
      )
      .map((value) => {
        return path.normalize(`${destination}/${value}`); // Return the file path
      });
    return file[0]; // Return the file path
  } catch (err) {
    if (err.code === "ENOENT") {
      return false;
    } else {
      throw { error: err };
    }
  }
};

const upload = (file, type, id) => { // Function to upload a file to a directory
  if (MAX_FILESIZE < file.size) // Check if the file size is greater than the max file size
    throw {
      code: 413,
      error: "File exceeds the max file size",
    };
  if (!FILETYPES.includes(file.mimetype)) // Check if the file type is supported
    throw {
      code: 400,
      error: "Unsupported file type",
    };
    const destination = `${__dirname}/../../uploads/${type}/${id}`;
    fs.open(destination, "r+", (err, fd) => { // Open the directory
      try {
        if (err) {
          if (err.code === "EEXIST") { // If the directory already exists, write the file to it
            sharp(file.data).toFile(`${destination}/${setID()}.webp`) // Convert the file to webp and write it to the directory
          } else if (err.code === "ENOENT") { // If the directory does not exist, create it and write the file to it
          fs.mkdir(destination, { recursive: true }, (err) => { // Create the directory
            if (err){ throw { error: err }}
            else{
              sharp(file.data).toFile(`${destination}/${setID()}.webp`)} // Convert the file to webp and write it to the directory
          });
        } else {
          throw err;
        }
      }
    } finally {
      if (fd) { // Close the directory
        fs.close(fd, (err) => {
          if (err) throw { error: err };
        });
      }
    }
  });
};

const updateFile = (file, type, id) => { // Function to update a file in a directory
  if (MAX_FILESIZE < file.size) // Check if the file size is greater than the max file size
    throw {
      code: 413,
      error: "File exceeds the max file size",
    };
  if (!FILETYPES.includes(file.mimetype)) // Check if the file type is supported
    throw {
      code: 400,
      error: "Unsupported file type",
    };
  const destination = `${__dirname}/../../uploads/${type}/${id}`;
  fs.open(destination, "r+", (err, fd) => { // Open the directory
    try {
      if (err) {
        if (err.code === "ENOENT") { // If the directory does not exist, create it and write the file to it
          fs.mkdir(destination, { recursive: true }, (err) => { // Create the directory
            if (err) throw err;
            else sharp(file.data).toFile(`${destination}/${setID()}.webp`); // Convert the file to webp and write it to the directory
          });
        }
      } else {
        fs.readdir(destination, { recursive: true }, (err, files) => { // If the directory exists, delete all the files in it and write the new file to it
          if (err) throw err;
          files.forEach((file) =>
            fs.unlink(path.join(destination, file), (err) => { // Delete the files
              if (err) throw err; 
            })
          );
        });
        
        sharp(file.data).toFile(`${destination}/${setID()}.webp`) // Convert the file to webp and write it to the directory
      }
    } finally {
      if (fd) { // Close the directory
        fs.close(fd, (err) => {
          if (err) throw err;
        });
      }
    }
  });
};

const removeFile = (type, id) => { // Function to remove a file from a directory
  const destination = `${__dirname}/../../uploads/${type}/${id}`;
  fs.open(destination, "r+", (err, fd) => { // Open the directory
    try {
      if (!err)
        fs.rm(destination, { recursive: true }, (err) => { // Remove the directory
          if (err) throw err;
        });
    } finally {
      if (fd) { // Close the directory
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
