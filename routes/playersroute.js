const express = require("express");
const router = express.Router();
const playersList = "public/data/players.json";
const bodyParser = require("body-parser");
const fs = require("fs");
const { v1: uuidv1, v4: uuidv4 } = require("uuid");
router.use(bodyParser.json());

//Full PLAYER JSON file helper function
const pullData = (jsonPath) => {
  const dataJSON = fs.readFileSync(jsonPath);
  const data = JSON.parse(dataJSON);
  return data;
};

// GET REQ FOR ALL PLAYERS
router.get("/", (_, res) => {
  res.json(pullData(playersList));
});

// GET PLAYER WITH ID
router.get("/:id", (req, res) => {
  const fullPlayersData = pullData(playersList);
  const selected = fullPlayersData.find((item) => item.id === req.params.id);

  res.json({
    playerName: selected.playerName,
    id: selected.id,
    description: selected.description,
    points: selected.points,
    status: selected.status,
    time: selected.time,
    country: selected.country,
  });
});

// DELETE ROTE FOR FUTURE ADMIN ACCESS

// router.delete("/:id", (req, res) => {
//   let fullPlayersData = pullData(playersList);
//   let id = req.params.id;
//   let index = fullPlayersData.findIndex((player) => player.id === id);
//   let deletedPlayer = fullPlayersData[index];
//   res.send(deletedPlayer);

//   fullPlayersData.splice(index, 1);
//   let playerSrc = JSON.stringify(fullPlayersData, null, 2);
//   fs.writeFile(playersList, playerSrc, "utf8", function (err) {
//     if (err) throw err;
//   });
// });

// POST NEW PLAYER ON FORM SUBMIT
router.post("/", (req, res) => {
  const fullPlayersData = pullData(playersList);
  
  let newPlayer = {
    id: uuidv1(),
    country: req.body.country,
    playerName: req.body.playerName,
    description: req.body.description,
    time: req.body.time,
    status: req.body.status,
    points: req.body.points,    
  };

  fullPlayersData.push(newPlayer);
  let playerSrc = JSON.stringify(fullPlayersData, null, 2);
  fs.writeFile(playersList, playerSrc, "utf8", function (err) {
    if (err) throw err;
  });

  res.status(200).send(newPlayer);
});

// UPDATE PLAYER POINTS ON GAMEOVER
router.put("/:id", (req, res) => {
  let fullPlayersData = pullData(playersList);
  let id = req.params.id;
  let index = fullPlayersData.findIndex((player) => player.id === id);
  let playerData = fullPlayersData.filter((player) => player.id === id);
  
  let updatedPlayer = {
    id: id,
    country: playerData[0].country,
    playerName: req.body.playerName,
    description: playerData[0].description,
    time: req.body.time,
    status: playerData[0].status,
    points: req.body.points,
  };
  fullPlayersData[index] = updatedPlayer;

  let playerSrc = JSON.stringify(fullPlayersData, null, 2);
  fs.writeFile(playersList, playerSrc, "utf8", function (err) {
    if (err) throw err;
  });
  res.send(updatedPlayer);
});

module.exports = router;
