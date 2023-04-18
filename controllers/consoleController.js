const Console = require("../models/console");
const VideoGame = require("../models/videoGame");

const displayAllConsoles = async (req, res, next) => {
  try {
    const consoleList = await Console.find({}).sort({ name: 1 }).exec();
    if (consoleList === null) {
      const err = new Error("There was an error loading consoles");
      err.status = 404;
      next(err);
    }
    res.render("../views/consoles/consolesAll", {
      title: "OdinStop Consoles",
      consoleList,
    });
  } catch (err) {
    err.status = 404;
    next(err);
  }
};

const displayOneConsole = async (req, res, next) => {
  try {
    const [consoleDoc, consoleGames] = await Promise.all([
      Console.findById(req.params.id).exec(),
      VideoGame.find({ console: req.params.id }).sort({ name: 1 }).exec(),
    ]);
    if (consoleDoc === null) {
      const err = new Error("Console does not exist");
      err.status = 404;
      next(err);
    }
    res.render("../views/consoles/consolesOne", {
      title: req.params.id,
      console: consoleDoc,
      consoleGames,
    });
  } catch (err) {
    err.status = 404;
    next(err);
  }
};

module.exports = {
  displayAllConsoles,
  displayOneConsole,
};
