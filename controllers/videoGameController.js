const VideoGame = require("../models/videoGame");
const Developer = require("../models/developer");
const Console = require("../models/console");
const Genre = require("../models/genre");

const storeIndex = async (req, res) => {
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
};

const displayAllGames = async (req, res) => {
  const gameList = await VideoGame.find({})
    .sort({ name: 1 })
    .populate("developer")
    .populate("console")
    .populate("genre")
    .exec();
  res.render("../views/videoGames/videoGamesAll", {
    title: "OdinStop Video Games",
    gameList,
  });
};

module.exports = {
  storeIndex,
  displayAllGames,
};
