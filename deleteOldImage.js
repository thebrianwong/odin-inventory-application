const fs = require("fs");

const deleteOldImage = (category, imageName) => {
  const imagePath = `${__dirname}/public/data/uploads/${category}/${imageName}`;
  fs.unlink(imagePath, (err) => {
    if (err) {
      throw err;
    }
  });
};

module.exports = deleteOldImage;
