const { body, validationResult } = require("express-validator");
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

const getNewGenreForm = (req, res) => {
  res.render("../views/genres/genreForm", {
    title: "New Genre",
  });
};

const postNewGenre = [
  body("name", "Genre name must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("description", "Description must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      const genre = new Genre({
        name: req.body.name,
        description: req.body.description,
      });
      if (!errors.isEmpty()) {
        res.render("../views/genres/genreForm", {
          title: "New Genre",
          genre,
          errors: errors.array(),
        });
      } else {
        const genreExists = await Genre.findOne({
          name: req.body.name,
          description: req.body.description,
        }).exec();
        if (genreExists) {
          res.redirect(genreExists.url);
        } else {
          await genre.save();
          res.redirect(genre.url);
        }
      }
    } catch (err) {
      err.status = 400;
      next(err);
    }
  },
];

module.exports = {
  displayAllGenres,
  displayOneGenre,
  getNewGenreForm,
  postNewGenre,
};
