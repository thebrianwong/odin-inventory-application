const express = require("express");
const VideoGameController = require("../controllers/videoGameController");
const DeveloperController = require("../controllers/developerController");
const ConsoleController = require("../controllers/consoleController");

const router = express.Router();

// display options to browse by game, developer, console, and genre
router.get("/", VideoGameController.storeIndex);

// video game routes

// form to add new game
router.get("/videogames/new", (req, res) => {
  res.send("placeholder");
});

// submit new game
router.post("/videogames/new", (req, res) => {
  res.send("placeholder");
});

// form to update existing game
router.get("/videogames/:id/update", (req, res) => {
  res.send("placeholder");
});

// submit game updates
router.put("/videogames/:id/update", (req, res) => {
  res.send("placeholder");
});

// page to delete game
router.get("/videogames/:id/delete", (req, res) => {
  res.send("placeholder");
});

// delete game
router.delete("/videogames/:id/delete", (req, res) => {
  res.send("placeholder");
});

// display all games
router.get("/videogames", VideoGameController.displayAllGames);

// display a specific game
router.get("/videogames/:id", VideoGameController.displayOneGame);

// developer routes

// form to add new developer
router.get("/developers/new", (req, res) => {
  res.send("placeholder");
});

// submit new developer
router.post("/developers/new", (req, res) => {
  res.send("placeholder");
});

// form to update existing developer
router.get("/developers/:id/update", (req, res) => {
  res.send("placeholder");
});

// submit developer updates
router.put("/developers/:id/update", (req, res) => {
  res.send("placeholder");
});

// page to delete game
router.get("/videogames/:id/delete", (req, res) => {
  res.send("placeholder");
});

// delete game
router.delete("/videogames/:id/delete", (req, res) => {
  res.send("placeholder");
});

// display all developers
router.get("/developers", DeveloperController.displayAllDevelopers);

// display a specific developer
router.get("/developers/:id", DeveloperController.displayOneDeveloper);

// console routes

// form to add new console
router.get("/consoles/new", (req, res) => {
  res.send("placeholder");
});

// submit new console
router.post("/consoles/new", (req, res) => {
  res.send("placeholder");
});

// form to update existing console
router.get("/consoles/:id/update", (req, res) => {
  res.send("placeholder");
});

// submit game console
router.put("/consoles/:id/update", (req, res) => {
  res.send("placeholder");
});

// page to delete game
router.get("/videogames/:id/delete", (req, res) => {
  res.send("placeholder");
});

// delete game
router.delete("/videogames/:id/delete", (req, res) => {
  res.send("placeholder");
});

// display all consoles
router.get("/consoles", ConsoleController.displayAllConsoles);

// display a specific console
router.get("/consoles/:id", (req, res) => {
  res.send("placeholder");
});

// genre routes

// form to add new genre
router.get("/genres/new", (req, res) => {
  res.send("placeholder");
});

// submit new genre
router.post("/genres/new", (req, res) => {
  res.send("placeholder");
});

// form to update existing genre
router.get("/genres/:id/update", (req, res) => {
  res.send("placeholder");
});

// submit game genre
router.put("/genres/:id/update", (req, res) => {
  res.send("placeholder");
});

// page to delete game
router.get("/videogames/:id/delete", (req, res) => {
  res.send("placeholder");
});

// delete game
router.delete("/videogames/:id/delete", (req, res) => {
  res.send("placeholder");
});

// display all genres
router.get("/genres", (req, res) => {
  res.send("placeholder");
});

// display a specific genre
router.get("/genres/:id", (req, res) => {
  res.send("placeholder");
});

module.exports = router;
