const { body, validationResult } = require("express-validator");
const { mongoose } = require("mongoose");
const multer = require("multer");
const Console = require("../models/console");
const VideoGame = require("../models/videoGame");
const { multerStorage, multerFilter } = require("../multerUtils");
const deleteOldImage = require("../deleteOldImage");

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
    if (!mongoose.isValidObjectId(req.params.id)) {
      const err = new Error("Console ID is invalid");
      err.status = 404;
      next(err);
    }
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
  res.render("../views/consoles/consolesForm", {
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
      if (req.file) {
        consoleDetails.imageURL = req.file.filename;
      }
      const consoleDoc = new Console(consoleDetails);
      if (!errors.isEmpty()) {
        res.render("../views/consoles/consolesForm", {
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
    if (!mongoose.isValidObjectId(req.params.id)) {
      const err = new Error("Console ID is invalid");
      err.status = 404;
      next(err);
    }
    const consoleDoc = await Console.findById(req.params.id).exec();
    if (consoleDoc === null) {
      const err = new Error("Console does not exist");
      err.status = 404;
      next(err);
    }
    res.render("../views/consoles/consolesForm", {
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
      if (!mongoose.isValidObjectId(req.params.id)) {
        const err = new Error("Console ID is invalid");
        err.status = 404;
        next(err);
      }
      const errors = validationResult(req);
      const consoleDoc = await Console.findById(req.params.id).exec();
      if (consoleDoc === null) {
        const err = new Error("Console does not exist");
        err.status = 404;
        next(err);
      }
      consoleDoc.name = req.body.name;
      consoleDoc.description = req.body.description;
      consoleDoc.creator = req.body.creator;
      if (req.body.releaseDate !== "") {
        consoleDoc.releaseDate = req.body.releaseDate;
      } else {
        consoleDoc.releaseDate = undefined;
      }
      if (req.body.delete && consoleDoc.imageURL) {
        deleteOldImage("consoles", consoleDoc.imageURL);
        if (req.file) {
          deleteOldImage("consoles", req.file.filename);
        }
        consoleDoc.imageURL = undefined;
      } else if (req.file) {
        if (consoleDoc.imageURL) {
          deleteOldImage("consoles", consoleDoc.imageURL);
        }
        consoleDoc.imageURL = req.file.filename;
      }
      if (!errors.isEmpty()) {
        res.render("../views/consoles/consolesForm", {
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

const getDeleteConsolePage = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      const err = new Error("Console ID is invalid");
      err.status = 404;
      next(err);
    }
    const [consoleDoc, videoGamesWithConsole] = await Promise.all([
      Console.findById(req.params.id).exec(),
      VideoGame.find({ console: req.params.id }).exec(),
    ]);
    if (consoleDoc === null) {
      const err = new Error("Console does not exist");
      err.status = 404;
      next(err);
    }
    res.render("../views/consoles/consolesDelete", {
      title: `Delete Console ID ${req.params.id}`,
      consoleDoc,
      videoGamesWithConsole,
    });
  } catch (err) {
    err.state = 404;
    next(err);
  }
};

const deleteConsole = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      const err = new Error("Console ID is invalid");
      err.status = 404;
      next(err);
    }
    const [consoleDoc, videoGamesWithConsole] = await Promise.all([
      Console.findById(req.params.id).exec(),
      VideoGame.find({ console: req.params.id }).exec(),
    ]);
    if (consoleDoc === null) {
      const err = new Error("Console does not exist");
      err.status = 404;
      next(err);
    }
    if (videoGamesWithConsole.length) {
      const err = new Error(
        `Some game(s) still have the ${consoleDoc.name} as a console.`
      );
      err.status = 404;
      next(err);
    }
    deleteOldImage("consoles", consoleDoc.imageURL);
    await Console.deleteOne({ _id: req.params.id }).exec();
    res.redirect("/store/consoles");
  } catch (err) {
    err.state = 404;
    next(err);
  }
};

const handleFileUpload = (req, res, next) => {
  const consoleStorage = multerStorage("consoles");
  const consoleUpload = multer({
    storage: consoleStorage,
    fileFilter: multerFilter,
  }).single("file");
  consoleUpload(req, res, (err) => {
    if (err) {
      err.status = 400;
      next(err);
    }
    next();
  });
};

module.exports = {
  getAllConsoles,
  getOneConsole,
  getNewConsoleForm,
  postNewConsole,
  getUpdateConsoleForm,
  putUpdatedConsole,
  getDeleteConsolePage,
  deleteConsole,
  handleFileUpload,
};
