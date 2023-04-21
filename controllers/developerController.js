const { body, validationResult } = require("express-validator");
const { mongoose } = require("mongoose");
const Developer = require("../models/developer");
const VideoGames = require("../models/videoGame");

const getAllDevelopers = async (req, res, next) => {
  try {
    const developerList = await Developer.find({}).sort({ name: 1 }).exec();
    if (developerList === null) {
      const err = new Error("There was an error loading developers");
      err.status = 404;
      next(err);
    }
    res.render("../views/developers/developersAll", {
      title: "OdinStop Developers",
      developerList,
    });
  } catch (err) {
    err.status = 404;
    next(err);
  }
};

const getOneDeveloper = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      const err = new Error("Developer ID is invalid");
      err.status = 404;
      next(err);
    }
    const [developer, developerGames] = await Promise.all([
      Developer.findById(req.params.id).exec(),
      VideoGames.find({
        developer: req.params.id,
      })
        .sort({ name: 1 })
        .exec(),
    ]);
    if (developer === null) {
      const err = new Error("Developer does not exist");
      err.status = 404;
      next(err);
    }
    res.render("../views/developers/developersOne", {
      title: req.params.id,
      developer,
      developerGames,
    });
  } catch (err) {
    err.status = 404;
    next(err);
  }
};

const getNewDeveloperForm = (req, res) => {
  res.render("../views/developers/developersForm", {
    title: "New Developer",
    buttonLabel: "Add Developer",
  });
};

const postNewDeveloper = [
  body("name", "Developer name must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("description", "Description must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("founded", "Founded year must be a valid number without leading zeros")
    .optional({ values: "falsy" })
    .trim()
    .isInt({ min: 1, allow_leading_zeroes: false })
    .escape(),
  body("city", "City must contain alphabet characters")
    .optional({ values: "falsy" })
    .trim()
    .isAlpha()
    .escape(),
  body("state", "State must contain alphabet characters")
    .optional({ values: "falsy" })
    .trim()
    .isAlpha()
    .escape(),
  body("country", "Country must contain alphabet characters")
    .optional({ values: "falsy" })
    .trim()
    .isAlpha()
    .escape(),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      const developerDetails = {
        name: req.body.name,
        description: req.body.description,
      };
      if (req.body.founded) {
        developerDetails.founded = req.body.founded;
      }
      if (req.body.city || req.body.state || req.body.country) {
        developerDetails.headquarters = {};
        if (req.body.city) {
          developerDetails.headquarters.city = req.body.city;
        }
        if (req.body.state) {
          developerDetails.headquarters.state = req.body.state;
        }
        if (req.body.country) {
          developerDetails.headquarters.country = req.body.country;
        }
      }
      const developer = new Developer(developerDetails);
      if (!errors.isEmpty()) {
        res.render("../views/developers/developersForm", {
          title: "New Developer",
          developer,
          buttonLabel: "Add Developer",
          errors: errors.array(),
        });
      } else {
        const developerExists = await Developer.findOne({
          name: req.body.name,
          description: req.body.description,
        }).exec();
        if (developerExists) {
          res.redirect(developerExists.url);
        } else {
          await developer.save();
          res.redirect(developer.url);
        }
      }
    } catch (err) {
      err.status = 400;
      next(err);
    }
  },
];

const getUpdateDeveloperForm = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      const err = new Error("Developer ID is invalid");
      err.status = 404;
      next(err);
    }
    const developer = await Developer.findById(req.params.id).exec();
    if (developer === null) {
      const err = new Error("Developer does not exist");
      err.status = 404;
      next(err);
    }
    res.render("../views/developers/developersForm", {
      title: `Update Developer ID ${req.params.id}`,
      developer,
      buttonLabel: "Update Developer",
    });
  } catch (err) {
    err.status = 400;
    next(err);
  }
};

const putUpdatedDeveloper = [
  body("name", "Developer name must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("description", "Description must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("founded", "Founded year must be a valid number without leading zeros")
    .optional({ values: "falsy" })
    .trim()
    .isInt({ min: 1, allow_leading_zeroes: false })
    .escape(),
  body("city", "City must contain alphabet characters")
    .optional({ values: "falsy" })
    .trim()
    .isAlpha()
    .escape(),
  body("state", "State must contain alphabet characters")
    .optional({ values: "falsy" })
    .trim()
    .isAlpha()
    .escape(),
  body("country", "Country must contain alphabet characters")
    .optional({ values: "falsy" })
    .trim()
    .isAlpha()
    .escape(),
  async (req, res, next) => {
    try {
      if (!mongoose.isValidObjectId(req.params.id)) {
        const err = new Error("Developer ID is invalid");
        err.status = 404;
        next(err);
      }
      const errors = validationResult(req);
      const developer = await Developer.findById(req.params.id).exec();
      if (developer === null) {
        const err = new Error("Developer does not exist");
        err.status = 404;
        next(err);
      }
      developer.name = req.body.name;
      developer.description = req.body.description;
      developer.headquarters = undefined;
      if (req.body.founded !== "") {
        developer.founded = req.body.founded;
      } else {
        developer.founded = undefined;
      }
      if (req.body.city || req.body.state || req.body.country) {
        developer.headquarters = {};
        if (req.body.city) {
          developer.headquarters.set("city", req.body.city);
        }
        if (req.body.state) {
          developer.headquarters.set("state", req.body.state);
        }
        if (req.body.country) {
          developer.headquarters.set("country", req.body.country);
        }
      }
      if (!errors.isEmpty()) {
        res.render("../views/developers/developersForm", {
          title: `Update Developer ID ${req.params.id}`,
          developer,
          buttonLabel: "Update Developer",
          errors: errors.array(),
        });
      } else {
        await developer.save();
        res.redirect(developer.url);
      }
    } catch (err) {
      err.status = 400;
      next(err);
    }
  },
];

const getDeleteDeveloperPage = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      const err = new Error("Developer ID is invalid");
      err.status = 404;
      next(err);
    }
    const [developer, videoGamesWithDeveloper] = await Promise.all([
      Developer.findById(req.params.id).exec(),
      VideoGames.find({ developer: req.params.id }).exec(),
    ]);
    if (developer === null) {
      const err = new Error("Developer does not exist");
      err.status = 404;
      next(err);
    }
    console.log(videoGamesWithDeveloper);
    res.render("../views/developers/developersDelete", {
      title: `Delete Developer ID ${req.params.id}`,
      developer,
      videoGamesWithDeveloper,
    });
  } catch (err) {
    err.state = 404;
    next(err);
  }
};

const deleteDeveloper = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      const err = new Error("Developer ID is invalid");
      err.status = 404;
      next(err);
    }
    const [developer, videoGamesWithDeveloper] = await Promise.all([
      Developer.findById(req.params.id).exec(),
      VideoGames.find({ developer: req.params.id }).exec(),
    ]);
    if (developer === null) {
      const err = new Error("Developer does not exist");
      err.status = 404;
      next(err);
    }
    if (videoGamesWithDeveloper.length) {
      const err = new Error(
        `Some game(s) still have ${developer.name} as a developer.`
      );
      err.status = 404;
      next(err);
    }
    await Developer.deleteOne({ _id: req.params.id }).exec();
    res.redirect("/store/developers");
  } catch (err) {
    err.state = 404;
    next(err);
  }
};

module.exports = {
  getAllDevelopers,
  getOneDeveloper,
  getNewDeveloperForm,
  postNewDeveloper,
  getUpdateDeveloperForm,
  putUpdatedDeveloper,
  getDeleteDeveloperPage,
  deleteDeveloper,
};
