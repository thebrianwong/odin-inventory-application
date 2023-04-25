const fs = require("fs");
const path = require("path");

const deleteOldImage = (category, imageName) => {
  const imagePath = path.join(
    __dirname,
    "public",
    "data",
    "uploads",
    category,
    imageName
  );
  fs.unlink(imagePath, (err) => {
    if (err) {
      throw err;
    }
  });
};

module.exports = deleteOldImage;
