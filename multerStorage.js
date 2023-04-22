const multer = require("multer");
const { v4 } = require("uuid");

const multerStorage = (category) =>
  multer.diskStorage({
    destination: `./public/data/uploads/${category}`,
    filename: (req, file, cb) => {
      const extension = file.mimetype.split("/")[1];
      console.log(cb);
      cb(null, `${v4()}.${extension}`);
    },
  });

module.exports = multerStorage;
