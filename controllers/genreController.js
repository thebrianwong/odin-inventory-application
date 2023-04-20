const { body, validationResult } = require("express-validator");
const Genre = require("../models/genre");
const VideoGame = require("../models/videoGame");

const displayAllGenres = async (req, res, next) => {
  try {
    const genreList = await Genre.find({}).sort({ name: 1 }).exec();
    if (genreList === null) {
      const err = new Error("There was an error loading genres");
      err.status = 404;
      next(err);
    }
    res.render("../views/genres/genresAll", {
      title: "OdinStop Genres",
      genreList,
    });
  } catch (err) {
    err.status = 404;
    next(err);
  }
};

const displayOneGenre = async (req, res, next) => {
  try {
    const [genre, genreGames] = await Promise.all([
      Genre.findById(req.params.id).exec(),
      VideoGame.find({ genre: req.params.id }).sort({ name: 1 }).exec(),
    ]);
    if (genre === null) {
      const err = new Error("Genre does not exist");
      err.status = 404;
      next(err);
    }
    res.render("../views/genres/genresOne", {
      title: req.params.id,
      genre,
      genreGames,
    });
  } catch (err) {
    err.status = 404;
    next(err);
  }
};

const getNewGenreForm = (req, res) => {
  res.render("../views/genres/genreForm", {
    title: "New Genre",
    buttonLabel: "Add Genre",
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
          buttonLabel: "Add Genre",
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

const getUpdateGenreForm = async (req, res, next) => {
  try {
    const genre = await Genre.findById(req.params.id).exec();
    if (genre === null) {
      const err = new Error("Genre does not exist");
      err.status = 404;
      next(err);
    }
    res.render("../views/genres/genreForm", {
      title: `Update Genre ID ${req.params.id}`,
      genre,
      buttonLabel: "Update Genre",
    });
  } catch (err) {
    err.status = 400;
    next(err);
  }
};

const postUpdatedGenre = [
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
      const genre = await Genre.findById(req.params.id);
      genre.name = req.body.name;
      genre.description = req.body.description;
      if (!errors.isEmpty()) {
        res.render("../views/genres/genreForm", {
          title: `Update Genre ID ${req.params.id}`,
          genre,
          buttonLabel: "Update Genre",
          errors: errors.array(),
        });
      } else {
        await genre.save();
        res.redirect(genre.url);
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
  getUpdateGenreForm,
  postUpdatedGenre,
};
