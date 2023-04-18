const Console = require("../models/console");
const VideoGame = require("../models/videoGame");

const displayAllConsoles = async (req, res) => {
  const consoleList = await Console.find({}).sort({ name: 1 }).exec();
  res.render("../views/consoles/consolesAll", {
    title: "OdinStop Consoles",
    consoleList,
  });
};

const displayOneConsole = async (req, res) => {
  const consoleDoc = await Console.findById(req.params.id).exec();
  const consoleGames = await VideoGame.find({ console: req.params.id })
    .sort({ name: 1 })
    .exec();
  res.render("../views/consoles/consolesOne", {
    title: req.params.id,
    console: consoleDoc,
    consoleGames,
  });
};

module.exports = {
  displayAllConsoles,
  displayOneConsole,
};
