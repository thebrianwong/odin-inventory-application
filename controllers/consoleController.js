const Console = require("../models/console");

const displayAllConsoles = async (req, res) => {
  const consoleList = await Console.find({}).sort({ name: 1 }).exec();
  res.render("../views/consoles/consolesAll", {
    title: "OdinStop Consoles",
    consoleList,
  });
};

module.exports = {
  displayAllConsoles,
};
