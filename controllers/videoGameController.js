const VideoGame = require("../models/videoGame");
const Developer = require("../models/developer");
const Console = require("../models/console");
const Genre = require("../models/genre");

const storeIndex = async (req, res, next) => {
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

const displayAllGames = async (req, res, next) => {
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

const displayOneGame = async (req, res, next) => {
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
      title: req.params.id,
      game,
    });
  } catch (err) {
    err.status = 404;
    next(err);
  }
};

module.exports = {
  storeIndex,
  displayAllGames,
  displayOneGame,
};
