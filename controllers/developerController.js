const Developer = require("../models/developer");
const VideoGames = require("../models/videoGame");

const displayAllDevelopers = async (req, res, next) => {
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

const displayOneDeveloper = async (req, res, next) => {
  try {
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

module.exports = {
  displayAllDevelopers,
  displayOneDeveloper,
};
