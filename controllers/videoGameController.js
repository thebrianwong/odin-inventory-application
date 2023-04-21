const { body, validationResult } = require("express-validator");
const VideoGame = require("../models/videoGame");
const Developer = require("../models/developer");
const Console = require("../models/console");
const Genre = require("../models/genre");

const getStoreIndex = async (req, res, next) => {
  try {
    const [videoGameCount, developerCount, consoleCount, genreCount] =
      await Promise.all([
        VideoGame.countDocuments({}).exec(),
        Developer.countDocuments({}).exec(),
        Console.countDocuments({}).exec(),
        Genre.countDocuments({}).exec(),
      ]);
    res.render("../views/index", {
      title: "OdinStop",
      videoGameCount,
      developerCount,
      consoleCount,
      genreCount,
    });
  } catch (err) {
    err.status = 404;
    next(err);
  }
};

const getAllGames = async (req, res, next) => {
  try {
    const gameList = await VideoGame.find({})
      .sort({ name: 1 })
      .populate("developer")
      .populate("genre")
      .exec();
    if (gameList === null) {
      const err = new Error("There was an error loading games");
      err.status = 404;
      next(err);
    }
    res.render("../views/videoGames/videoGamesAll", {
      title: "OdinStop Video Games",
      gameList,
    });
  } catch (err) {
    err.status = 404;
    next(err);
  }
};

const getOneGame = async (req, res, next) => {
  try {
    const game = await VideoGame.findById(req.params.id)
      .populate("developer")
      .populate("console")
      .populate("genre")
      .exec();
    if (game === null) {
      const err = new Error("Game does not exist");
      err.status = 404;
      next(err);
    }
    res.render("../views/videoGames/videoGamesOne", {
      title: `Video Game ID ${req.params.id}`,
      game,
    });
  } catch (err) {
    err.status = 404;
    next(err);
  }
};

const getNewGameForm = async (req, res, next) => {
  try {
    const [developerList, consoleList, genreList] = await Promise.all([
      Developer.find({}).sort({ name: 1 }).exec(),
      Console.find({}).sort({ name: 1 }).exec(),
      Genre.find({}).sort({ name: 1 }).exec(),
    ]);
    res.render("../views/videoGames/videoGamesForm", {
      title: "New Video Game",
      developerList,
      consoleList,
      genreList,
      buttonLabel: "Add Game",
      query: req.query,
    });
  } catch (err) {
    err.status = 404;
    next(err);
  }
};

const postNewGame = [
  body("name", "Game name must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("description", "Description must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("releaseDate", "Release date must be a valid date").isISO8601().toDate(),
  body("developer", "Invalid developer").trim().isLength({ min: 1 }).escape(),
  body("console.*", "Invalid console(s)").escape(),
  body("genre.*", "Invalid genre(s)").escape(),
  body("price", "Price must be a positive number")
    .optional({ values: "falsy" })
    .trim()
    .isFloat({ min: 0.0 }),
  body("copies", "Copies must be a positive integer with no leading zeros")
    .optional({ values: "falsy" })
    .trim()
    .isInt({ min: 0, allow_leading_zeroes: false }),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      const gameDetails = {
        name: req.body.name,
        description: req.body.description,
        releaseDate: req.body.releaseDate,
        developer: req.body.developer,
      };
      if (req.body.console) {
        gameDetails.console = req.body.console;
      }
      if (req.body.genre) {
        gameDetails.genre = req.body.genre;
      }
      if (req.body.price) {
        gameDetails.price = req.body.price;
      }
      if (req.body.copies) {
        gameDetails.copies = req.body.copies;
      }
      const game = new VideoGame(gameDetails);
      if (!errors.isEmpty()) {
        const [developerList, consoleList, genreList] = await Promise.all([
          Developer.find({}).sort({ name: 1 }).exec(),
          Console.find({}).sort({ name: 1 }).exec(),
          Genre.find({}).sort({ name: 1 }).exec(),
        ]);
        res.render("../views/videoGames/videoGamesForm", {
          title: "New Video Game",
          developerList,
          consoleList,
          genreList,
          game,
          buttonLabel: "Add Game",
          errors: errors.array(),
        });
      } else {
        const gameExists = await VideoGame.findOne({
          name: req.body.name,
        }).exec();
        if (gameExists) {
          res.redirect(gameExists.url);
        } else {
          await game.save();
          res.redirect(game.url);
        }
      }
    } catch (err) {
      err.state = 404;
      next(err);
    }
  },
];

const getUpdateGameForm = async (req, res, next) => {
  try {
    const [game, developerList, consoleList, genreList] = await Promise.all([
      VideoGame.findById(req.params.id).exec(),
      Developer.find({}).sort({ name: 1 }).exec(),
      Console.find({}).sort({ name: 1 }).exec(),
      Genre.find({}).sort({ name: 1 }).exec(),
    ]);
    if (game === null) {
      const err = new Error("Game does not exist");
      err.status = 404;
      next(err);
    }
    res.render("../views/videoGames/videoGamesForm", {
      title: `Update Video Game ID ${req.params.id}`,
      developerList,
      consoleList,
      genreList,
      game,
      buttonLabel: "Update Game",
    });
  } catch (err) {
    err.status = 404;
    next(err);
  }
};

const putUpdatedGame = [
  body("name", "Game name must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("description", "Description must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("releaseDate", "Release date must be a valid date").isISO8601().toDate(),
  body("developer", "Invalid developer").trim().isLength({ min: 1 }).escape(),
  body("console.*", "Invalid console(s)").escape(),
  body("genre.*", "Invalid genre(s)").escape(),
  body("price", "Price must be a positive number")
    .optional({ values: "falsy" })
    .trim()
    .isFloat({ min: 0.0 }),
  body("copies", "Copies must be a positive integer with no leading zeros")
    .optional({ values: "falsy" })
    .trim()
    .isInt({ min: 0, allow_leading_zeroes: false }),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      const game = await VideoGame.findById(req.params.id).exec();
      game.name = req.body.name;
      game.description = req.body.description;
      game.releaseDate = req.body.releaseDate;
      game.developer = req.body.developer;
      if (req.body.console) {
        game.console = req.body.console;
      } else {
        game.console = [];
      }
      if (req.body.genre) {
        game.genre = req.body.genre;
      } else {
        game.genre = [];
      }
      if (req.body.price !== "") {
        game.price = req.body.price;
      } else {
        game.price = undefined;
      }
      if (req.body.copies !== "") {
        game.copies = req.body.copies;
      } else {
        game.copies = undefined;
      }
      if (!errors.isEmpty()) {
        const [developerList, consoleList, genreList] = await Promise.all([
          Developer.find({}).sort({ name: 1 }).exec(),
          Console.find({}).sort({ name: 1 }).exec(),
          Genre.find({}).sort({ name: 1 }).exec(),
        ]);
        res.render("../views/videoGames/videoGamesForm", {
          title: `Update Video Game ID ${req.params.id}`,
          developerList,
          consoleList,
          genreList,
          game,
          buttonLabel: "Update Game",
          errors: errors.array(),
        });
      } else {
        await game.save();
        res.redirect(game.url);
      }
    } catch (err) {
      err.state = 404;
      next(err);
    }
  },
];

module.exports = {
  getStoreIndex,
  getAllGames,
  getOneGame,
  getNewGameForm,
  postNewGame,
  getUpdateGameForm,
  putUpdatedGame,
};
