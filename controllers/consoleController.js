const { body, validationResult } = require("express-validator");
const Console = require("../models/console");
const VideoGame = require("../models/videoGame");

const getAllConsoles = async (req, res, next) => {
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

const getOneConsole = async (req, res, next) => {
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
      consoleDoc,
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
    buttonLabel: "Add Console",
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
          consoleDoc,
          buttonLabel: "Add Console",
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

const getUpdateConsoleForm = async (req, res, next) => {
  try {
    const consoleDoc = await Console.findById(req.params.id).exec();
    if (consoleDoc === null) {
      const err = new Error("Console does not exist");
      err.status = 404;
      next(err);
    }
    res.render("../views/consoles/consoleForm", {
      title: `Update Console ID ${req.params.id}`,
      consoleDoc,
      buttonLabel: "Update Console",
    });
  } catch (err) {
    err.status = 400;
    next(err);
  }
};

const putUpdatedConsole = [
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
      const consoleDoc = await Console.findById(req.params.id).exec();
      consoleDoc.name = req.body.name;
      consoleDoc.description = req.body.description;
      consoleDoc.creator = req.body.creator;
      if (req.body.releaseDate !== "") {
        consoleDoc.releaseDate = req.body.releaseDate;
      } else {
        consoleDoc.releaseDate = undefined;
      }
      if (!errors.isEmpty()) {
        res.render("../views/consoles/consoleForm", {
          title: `Update Console ID ${req.params.id}`,
          consoleDoc,
          buttonLabel: "Update Console",
          errors: errors.array(),
        });
      } else {
        await consoleDoc.save();
        res.redirect(consoleDoc.url);
      }
    } catch (err) {
      err.state = 404;
      next(err);
    }
  },
];

module.exports = {
  getAllConsoles,
  getOneConsole,
  getNewConsoleForm,
  postNewConsole,
  getUpdateConsoleForm,
  putUpdatedConsole,
};
