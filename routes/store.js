const express = require("express");
const VideoGameController = require("../controllers/videoGameController");
const DeveloperController = require("../controllers/developerController");
const ConsoleController = require("../controllers/consoleController");
const GenreController = require("../controllers/genreController");

const router = express.Router();

// display options to browse by game, developer, console, and genre
router.get("/", VideoGameController.getStoreIndex);

// video game routes

// form to add new game
router.get("/videogames/new", VideoGameController.getNewGameForm);

// submit new game
router.post("/videogames/new", VideoGameController.postNewGame);

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
router.get("/videogames", VideoGameController.getAllGames);

// display a specific game
router.get("/videogames/:id", VideoGameController.getOneGame);

// developer routes

// form to add new developer
router.get("/developers/new", DeveloperController.getNewDeveloperForm);

// submit new developer
router.post("/developers/new", DeveloperController.postNewDeveloper);

// form to update existing developer
router.get(
  "/developers/:id/update",
  DeveloperController.getUpdateDeveloperForm
);

// submit developer updates
router.put("/developers/:id/update", DeveloperController.putUpdatedDeveloper);

// page to delete developer
router.get("/developer/:id/delete", (req, res) => {
  res.send("placeholder");
});

// delete developer
router.delete("/developer/:id/delete", (req, res) => {
  res.send("placeholder");
});

// display all developers
router.get("/developers", DeveloperController.getAllDevelopers);

// display a specific developer
router.get("/developers/:id", DeveloperController.getOneDeveloper);

// console routes

// form to add new console
router.get("/consoles/new", ConsoleController.getNewConsoleForm);

// submit new console
router.post("/consoles/new", ConsoleController.postNewConsole);

// form to update existing console
router.get("/consoles/:id/update", ConsoleController.getUpdateConsoleForm);

// submit game console
router.put("/consoles/:id/update", ConsoleController.putUpdatedConsole);

// page to delete console
router.get("/consoles/:id/delete", (req, res) => {
  res.send("placeholder");
});

// delete console
router.delete("/consoles/:id/delete", (req, res) => {
  res.send("placeholder");
});

// display all consoles
router.get("/consoles", ConsoleController.getAllConsoles);

// display a specific console
router.get("/consoles/:id", ConsoleController.getOneConsole);

// genre routes

// form to add new genre
router.get("/genres/new", GenreController.getNewGenreForm);

// submit new genre
router.post("/genres/new", GenreController.postNewGenre);

// form to update existing genre
router.get("/genres/:id/update", GenreController.getUpdateGenreForm);

// submit game genre
router.put("/genres/:id/update", GenreController.putUpdatedGenre);

// page to delete genre
router.get("/genres/:id/delete", (req, res) => {
  res.send("placeholder");
});

// delete genre
router.delete("/genres/:id/delete", (req, res) => {
  res.send("placeholder");
});

// display all genres
router.get("/genres", GenreController.getAllGenres);

// display a specific genre
router.get("/genres/:id", GenreController.getOneGenre);

module.exports = router;
