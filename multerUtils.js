const multer = require("multer");
const { v4 } = require("uuid");

const multerStorage = (category) =>
  multer.diskStorage({
    destination: `./public/data/uploads/${category}`,
    filename: (req, file, cb) => {
      const extension = file.mimetype.split("/")[1];
      cb(null, `${v4()}.${extension}`);
    },
  });

const multerFilter = (req, file, cb) => {
  if (file.mimetype === "image/png" || file.mimetype === "image/jpeg") {
    cb(null, true);
  } else {
    cb(new Error("Not a valid image format."));
  }
};

module.exports = {
  multerStorage,
  multerFilter,
};
