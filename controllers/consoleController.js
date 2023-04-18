const { body, validationResult } = require("express-validator");
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

const getNewConsoleForm = (req, res) => {
  res.render("../views/consoles/consoleForm", {
    title: "New Console",
  });
};

const postNewConsole = [
  body("name", "Console name must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("description", "Description must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("creator", "Creator must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("releaseDate", "Release date must be a valid date")
    .optional({ values: "falsy" })
    .isISO8601()
    .toDate(),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      const consoleDetails = {
        name: req.body.name,
        description: req.body.description,
        creator: req.body.creator,
      };
      if (req.body.releaseDate) {
        consoleDetails.releaseDate = req.body.releaseDate;
      }
      const consoleDoc = new Console(consoleDetails);
      if (!errors.isEmpty()) {
        res.render("../views/consoles/consoleForm", {
          title: "New Console",
          console: consoleDoc,
          errors: errors.array(),
        });
      } else {
        const consoleExists = await Console.findOne({
          name: req.body.name,
          description: req.body.description,
          creator: req.body.creator,
        }).exec();
        if (consoleExists) {
          res.redirect(consoleExists.url);
        } else {
          await consoleDoc.save();
          res.redirect(consoleDoc.url);
        }
      }
    } catch (err) {
      err.state = 404;
      next(err);
    }
  },
];

module.exports = {
  displayAllConsoles,
  displayOneConsole,
  getNewConsoleForm,
  postNewConsole,
};
