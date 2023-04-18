const Genre = require("../models/genre");
const VideoGame = require("../models/videoGame");

const displayAllGenres = async (req, res) => {
  const genreList = await Genre.find({}).sort({ name: 1 }).exec();
  res.render("../views/genres/genresAll", {
    title: "OdinStop Genres",
    genreList,
  });
};

const displayOneGenre = async (req, res) => {
  const genre = await Genre.findById(req.params.id).exec();
  const genreGames = await VideoGame.find({ genre: req.params.id })
    .sort({ name: 1 })
    .exec();
  res.render("../views/genres/genresOne", {
    title: req.params.id,
    genre,
    genreGames,
  });
};

module.exports = {
  displayAllGenres,
  displayOneGenre,
};
