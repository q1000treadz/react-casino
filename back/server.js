const { Console } = require('console');
const express = require('express');
const path = require('path');
const fs = require('fs');
const { createconnection, mysqlquery } = require('./mysql1');
const { getMineInfo } = require('./mines/mineinfo');
const { startMineGame } = require('./mines/minestart');
const { mineClick } = require('./mines/mineclick');
const { endMineGame } = require('./mines/mineend');
const { getPokerInfo } = require('./videopoker/pokerinfo');
const { startPokerGame } = require('./videopoker/pokerstart');
const { changePokerCards } = require('./videopoker/pokerchange');
let info = fs.readFileSync('config.json');
let parsed = JSON.parse(info);

const app = express();
app.use(express.static("F:\\reactcasino\\casino\\front\\build"));

app.use(express.json());



var connection = createconnection(parsed.host, parsed.port, parsed.user, parsed.password, parsed.database);

app.post('/userinfo', function (req, res) {
  let _userId = req.body.userid;
  (async () => {
    let userInfo = await mysqlquery(connection, "SELECT * FROM users WHERE id='" + _userId + "';");
    console.log(userInfo);
    if (userInfo.length == 0) {
      console.log("UNCORRECT USER");
    } else {
      let _user = userInfo[0];
      let user = {
        name: _user.name,
        balance: _user.balance,
        id: _user.id
      };
      res.json(user);
    }
  })();
});

app.post('/mineinfo', function (req, res) {
  if (!req.body.userid) res.json(undefined);
  (async () => {
    let output = await getMineInfo(connection, req.body.userid);
    res.json(output);
  })();
});

app.post('/startgame', function (req, res) {
  if (!(req.body.userid && req.body.num && req.body.bet)) res.json(undefined);
  (async () => {
    let output = await startMineGame(connection, req.body.userid, req.body.num, req.body.bet);
    console.log(output);
    res.json(output);
  })();
});

app.post('/clickmine', function (req, res) {
  if (!(req.body.number && req.body.mineId)) res.json(undefined);
  (async () => {
    let output = await mineClick(connection, req.body.number, req.body.mineId);
    console.log(output);
    res.json(output);
  })();
});

app.post('/endgame', function (req, res) {
  if (!req.body.mineId) res.json(undefined);
  (async () => {
    let output = await endMineGame(connection, req.body.mineId);
    console.log(output);
    res.json(output);
  })();

});

app.post('/videopoker/pokerinfo', function (req, res) {
  if (!req.body.userid) res.json(undefined);
  (async () => {
    let output = await getPokerInfo(connection, req.body.userid);
    console.log(output);
    res.json(output);
  })();
});
app.post('/videopoker/startgame', function (req, res) {
  if (!(req.body.userid && req.body.bet)) res.json(undefined);
  (async () => {
    let output = await startPokerGame(connection, req.body.userid, req.body.bet);
    console.log(output);
    res.json(output);
  })();
});
app.post('/videopoker/changecards', function (req, res) {
  console.log("changecards!!!!!!!!!");
  let _userId = req.body.userid;
  let _pokerId = req.body.pokerid;
  let choosen = req.body.choosen;
  if (!(req.body.userid && req.body.pokerid && req.body.choosen)) res.json(undefined);
  (async () => {
    let output = await changePokerCards(connection, req.body.userid, req.body.pokerid, req.body.choosen);
    console.log(output);
    res.json(output);
  })();
});

app.get('*', function (req, res) {


  res.sendFile(path.join(__dirname, '..', 'front', 'build', 'index.html'));
  console.log(path.join(__dirname, '..', 'front', 'build', 'index.html'));
});

app.listen(process.env.PORT || 8080);