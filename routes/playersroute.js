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
    // gameId: selected.gameId,
  });
});

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

router.post("/", (req, res) => {
  // const fullWarehouseData = pullData(warehouseList);
  const fullPlayersData = pullData(playersList);
  // const selectedPlayer = fullPlayersData.find(
  //   (player) => player.playerName === req.body.playerName
  // );
  // const selectedId = selectedPlayer.id;

  let newPlayer = {
    id: uuidv1(),
    // warehouseID: selectedId,
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

router.put("/:id", (req, res) => {
  let fullPlayersData = pullData(playersList);
  let id = req.params.id;
  let index = fullPlayersData.findIndex((player) => player.id === id);
  // let warehouseID = req.body.warehouse;
  let playerData = fullPlayersData.filter((player) => player.id === id);
  // console.log(index)
  
 
  let updatedPlayer = {
    id: id,
    // gameId: uuidv1(),
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
