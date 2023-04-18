const Developer = require("../models/developer");
const VideoGames = require("../models/videoGame");

const displayAllDevelopers = async (req, res) => {
  const developerList = await Developer.find({}).sort({ name: 1 }).exec();
  res.render("../views/developers/developersAll", {
    title: "OdinStop Developers",
    developerList,
  });
};

const displayOneDeveloper = async (req, res) => {
  const developer = await Developer.findById(req.params.id).exec();
  const developedGames = await VideoGames.find({
    developer: req.params.id,
  })
    .sort({ name: 1 })
    .exec();
  res.render("../views/developers/developersOne", {
    title: req.params.id,
    developer,
    developedGames,
  });
};

module.exports = {
  displayAllDevelopers,
  displayOneDeveloper,
};
