const Genre = require("../models/genre");

const displayAllGenres = async (req, res) => {
  const genreList = await Genre.find({}).sort({ name: 1 }).exec();
  res.render("../views/genres/genresAll", {
    title: "OdinStop Genres",
    genreList,
  });
};

module.exports = {
  displayAllGenres,
};
