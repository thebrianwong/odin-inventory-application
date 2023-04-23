const { body, validationResult } = require("express-validator");
const { mongoose } = require("mongoose");
const multer = require("multer");
const Genre = require("../models/genre");
const VideoGame = require("../models/videoGame");
const { multerStorage, multerFilter } = require("../multerUtils");
const deleteOldImage = require("../deleteOldImage");

const getAllGenres = async (req, res, next) => {
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

const getOneGenre = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      const err = new Error("Genre ID is invalid");
      err.status = 404;
      next(err);
    }
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
  res.render("../views/genres/genresForm", {
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
      const genreDetails = {
        name: req.body.name,
        description: req.body.description,
      };
      if (req.file) {
        genreDetails.imageURL = req.file.filename;
      }
      const genre = new Genre(genreDetails);
      if (!errors.isEmpty()) {
        res.render("../views/genres/genresForm", {
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
    if (!mongoose.isValidObjectId(req.params.id)) {
      const err = new Error("Genre ID is invalid");
      err.status = 404;
      next(err);
    }
    const genre = await Genre.findById(req.params.id).exec();
    if (genre === null) {
      const err = new Error("Genre does not exist");
      err.status = 404;
      next(err);
    }
    res.render("../views/genres/genresForm", {
      title: `Update Genre ID ${req.params.id}`,
      genre,
      buttonLabel: "Update Genre",
    });
  } catch (err) {
    err.status = 400;
    next(err);
  }
};

const putUpdatedGenre = [
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
      if (!mongoose.isValidObjectId(req.params.id)) {
        const err = new Error("Genre ID is invalid");
        err.status = 404;
        next(err);
      }
      const errors = validationResult(req);
      const genre = await Genre.findById(req.params.id).exec();
      if (genre === null) {
        const err = new Error("Genre does not exist");
        err.status = 404;
        next(err);
      }
      genre.name = req.body.name;
      genre.description = req.body.description;
      if (!errors.isEmpty()) {
        if (req.file) {
          deleteOldImage("genres", req.file.filename);
        }
        res.render("../views/genres/genresForm", {
          title: `Update Genre ID ${req.params.id}`,
          genre,
          buttonLabel: "Update Genre",
          errors: errors.array(),
        });
      } else {
        if (req.body.delete && genre.imageURL) {
          deleteOldImage("genres", genre.imageURL);
          if (req.file) {
            deleteOldImage("genres", req.file.filename);
          }
          genre.imageURL = undefined;
        } else if (req.file) {
          if (genre.imageURL) {
            deleteOldImage("genres", genre.imageURL);
          }
          genre.imageURL = req.file.filename;
        }
        await genre.save();
        res.redirect(genre.url);
      }
    } catch (err) {
      err.status = 400;
      next(err);
    }
  },
];

const getDeleteGenrePage = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      const err = new Error("Genre ID is invalid");
      err.status = 404;
      next(err);
    }
    const [genre, videoGamesWithGenre] = await Promise.all([
      Genre.findById(req.params.id).exec(),
      VideoGame.find({ genre: req.params.id }).exec(),
    ]);
    if (genre === null) {
      const err = new Error("Genre does not exist");
      err.status = 404;
      next(err);
    }
    res.render("../views/genres/genresDelete", {
      title: `Delete Genre ID ${req.params.id}`,
      genre,
      videoGamesWithGenre,
    });
  } catch (err) {
    err.state = 404;
    next(err);
  }
};

const deleteGenre = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      const err = new Error("Genre ID is invalid");
      err.status = 404;
      next(err);
    }
    const [genre, videoGamesWithGenre] = await Promise.all([
      Genre.findById(req.params.id).exec(),
      VideoGame.find({ genre: req.params.id }).exec(),
    ]);
    if (genre === null) {
      const err = new Error("Genre does not exist");
      err.status = 404;
      next(err);
    }
    if (videoGamesWithGenre.length) {
      const err = new Error(
        `Some game(s) still have ${genre.name} as a genre.`
      );
      err.status = 404;
      next(err);
    }
    if (genre.imageURL) {
      deleteOldImage("genres", genre.imageURL);
    }
    await Genre.deleteOne({ _id: req.params.id }).exec();
    res.redirect("/store/genres");
  } catch (err) {
    err.state = 404;
    next(err);
  }
};

const handleFileUpload = (req, res, next) => {
  const genreStorage = multerStorage("genres");
  const genreUpload = multer({
    storage: genreStorage,
    fileFilter: multerFilter,
  }).single("file");
  genreUpload(req, res, (err) => {
    if (err) {
      err.status = 400;
      next(err);
    }
    next();
  });
};

module.exports = {
  getAllGenres,
  getOneGenre,
  getNewGenreForm,
  postNewGenre,
  getUpdateGenreForm,
  putUpdatedGenre,
  getDeleteGenrePage,
  deleteGenre,
  handleFileUpload,
};
