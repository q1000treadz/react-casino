const { Console } = require('console');
const express = require('express');
const path = require('path');
const fs = require('fs');
const { generateMines, calculateCoefficient, generateOutputArray, makeSteps, getOpenMinesNumber, checkLoseMine, getMinesNumber } = require('./mines');
const { createconnection, mysqlquery } = require('./mysql1');
const videopoker = require('./videopoker');
const VideoPoker = require('./videopoker');



let info = fs.readFileSync('config.json');
let parsed = JSON.parse(info);

const app = express();
app.use(express.static("F:\\reactcasino\\casino\\front\\build"));

app.use(express.json());



var connection = createconnection(parsed.host,parsed.port,parsed.user,parsed.password, parsed.database);
//console.log(VideoPoker.makeOutput("2d3d4d5d6d7d8d9hThJc00001"));
app.post('/userinfo', function (req, res) {
  //(async() =>{console.log(await mysqlquery(connection, "SELECT id FROM mies ORDER BY id DESC LIMIT 1;"));})();
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
  let _userId = req.body.userid;
  (async () => {
    let _mineInfo = await mysqlquery(connection, "SELECT * FROM mines WHERE userid='" + _userId + "' AND active='1'");
    if (_mineInfo.length != 0) {
      let mineInfo = _mineInfo[0];
      let mine = {
        userid: _userId,
        activegame: true,
        bet: mineInfo.bet,
        mineid: mineInfo.id,
        value: getMinesNumber(mineInfo.mines),
        output: generateOutputArray(makeSteps(mineInfo.mines))
      };
      res.json(mine);
    } else {
      let mine = {
        userid: _userId,
        activegame: false,
      };
      res.json(mine);
    }
  })();
});
//TODO списывать баланс
app.post('/startgame', function (req, res) {
  console.log("SATATATT");
  let _userId = req.body.userid;
  let _mnum = req.body.num;
  let _bet = req.body.bet;
  (async () => {
    let _mineInfo = await mysqlquery(connection, "SELECT * FROM mines WHERE userid='" + _userId + "' AND active='1'");
    if (_mineInfo.length == 0) {
      let arr = generateMines(_mnum);
      let str = "";
      for (let i = 0; i < 25; i++) {
        str += arr[i].toString();
      }
      let newid = await mysqlquery(connection, "SELECT id FROM mines ORDER BY id DESC LIMIT 1;");
      let newgame = await mysqlquery(connection, "INSERT INTO mines(id,mines,userid,bet, coefficient, active) VALUES ('" + (newid[0].id + 1) + "','" + str + "','1','" + _bet + "','0','1');")
      let mid = (newid[0].id + 1);

      let _userInfo = await mysqlquery(connection, "SELECT * FROM users WHERE id='" + _userId + "';");
      let userInfo = _userInfo[0];
      let newUserBalance = userInfo.balance - _bet;
      connection.query("UPDATE users SET balance='" + newUserBalance + "' WHERE id='" + _userId + "';", function (err, results) {

        let res1 = {
          userid: _userId,
          activegame: true,
          bet: _bet,
          mineid: mid,
          value: getMinesNumber(arr),
          output: generateOutputArray(arr),
          balance: newUserBalance
        }
        res.json(res1);
      });
    }
  })();
});

app.post('/clickmine', function (req, res) {
  let number = req.body.number;
  let _mineId = req.body.mineId;
  console.log(req.body);
  let res1 = {
    mine: 0,
  };
  (async () => {
    let results = await mysqlquery(connection, "SELECT * FROM mines WHERE id='" + _mineId + "' AND active='1'");

    let mines = makeSteps(results[0].mines);
    if (mines[number] == 0) {
      mines[number] = 2;
      res1.mine = 2;
    } else if (mines[number] == 1) {
      mines[number] = 3;
      res1.mine = 3;
    } else {
      res1.mine = 1;
    }
    let str = "";
    for (let i = 0; i < 25; i++) {
      str += mines[i].toString();
    }
    connection.query("UPDATE mines SET mines='" + str + "' WHERE id='" + _mineId + "' AND active='1'", function (err, results) {
      res.json(res1);
    });
  })();
});

app.post('/endgame', function (req, res) {
  let _mineId = req.body.mineId;
  (async () => {
    let upd = await mysqlquery(connection, "UPDATE mines SET active='0' WHERE id='" + _mineId + "';");
    let _gameInfo = await mysqlquery(connection, "SELECT * FROM mines WHERE id='" + _mineId + "';");
    let gameInfo = _gameInfo[0];
    if (gameInfo != undefined) {
      let arr = makeSteps(gameInfo.mines);
      let open = getOpenMinesNumber(arr);
      let lost = checkLoseMine(arr);
      let mnum = getMinesNumber(arr);
      let coeff = (lost) ? 0.0 : calculateCoefficient(mnum)[open];
      //let gameId = req.body.gameId;

      let _userInfo = await mysqlquery(connection, "SELECT * FROM users WHERE id='" + gameInfo.userid + "';");
      let userInfo = _userInfo[0];
      let newUserBalance = userInfo.balance + parseFloat((parseFloat(coeff) * gameInfo.bet).toFixed(2));
      connection.query("UPDATE users SET balance='" + newUserBalance + "' WHERE id='" + gameInfo.userid + "';", function (err, results) {

        res.json({ balance: newUserBalance });
      });
    }
  })();

});

app.post('/videopoker/pokerinfo', function (req, res) {
  let _userId = req.body.userid;
  (async () => {
    let _videoPoker = await mysqlquery(connection, "SELECT * FROM videopoker WHERE userid='" + _userId + "' AND active='1'");
    if (_videoPoker.length != 0) {
      let videoPokerInf = _videoPoker[0];
      let poker = {
        userid: _userId,
        activegame: true,
        bet: videoPokerInf.bet,
        pokerid: videoPokerInf.id,
        output: (VideoPoker.makeOutput(videoPokerInf.videopoker))
      };
      res.json(poker);
    } else {
      let poker = {
        userid: _userId,
        activegame: false,
      };
      res.json(poker);
    }
  })();
});
app.post('/videopoker/startgame', function (req, res) {
  let _userId = req.body.userid;
  let _bet = req.body.bet || 1;
  (async () => {
    let _pokerInfo = await mysqlquery(connection, "SELECT * FROM videopoker WHERE userid='" + _userId + "' AND active='1'");
    if (_pokerInfo.length == 0) {
      let arr = VideoPoker.generate10Cards();
      let str = "";
      for (let i = 0; i < 5; i++) {
        str += arr.first[i].toString();
      }
      for (let i = 0; i < 5; i++) {
        str += arr.second[i].toString();
      }
      str += "00000";
      let newid = await mysqlquery(connection, "SELECT id FROM videopoker ORDER BY id DESC LIMIT 1;");
      let newgame = await mysqlquery(connection, "INSERT INTO videopoker(id,videopoker,userid,bet, coefficient, active) VALUES ('" + (newid[0].id + 1) + "','" + str + "','1','" + _bet + "','0','1');")
      let mid = (newid[0].id + 1);

      let _userInfo = await mysqlquery(connection, "SELECT * FROM users WHERE id='" + _userId + "';");
      let userInfo = _userInfo[0];
      let newUserBalance = userInfo.balance - _bet;
      connection.query("UPDATE users SET balance='" + newUserBalance + "' WHERE id='" + _userId + "';", function (err, results) {
        let res1 = {
          userid: _userId,
          activegame: true,
          bet: _bet,
          pokerid: mid,
          output: VideoPoker.makeOutput(str),
          balance: newUserBalance
        }
        res.json(res1);
      });
    }
  })();
});
app.post('/videopoker/changecards', function (req, res) {
  console.log("changecards!!!!!!!!!");
  let _userId = req.body.userid;
  let _pokerId = req.body.pokerid;
  let choosen = req.body.choosen;
  (async () => {

    let _gameInfo = await mysqlquery(connection, "SELECT * FROM videopoker WHERE id='" + _pokerId + "';");

    let gameInfo = _gameInfo[0];
    if (gameInfo != undefined) {
      if (gameInfo.active == 1) {
        let upd = await mysqlquery(connection, "UPDATE videopoker SET active='0' WHERE id='" + _pokerId + "';");
        let newVP = gameInfo.videopoker.slice(0, 20);
        let str = "";
        for (let i = 0; i < 5; i++) {
          str += choosen[i].toString();
        }
        newVP += str;
        let curCards = VideoPoker.makeOutput(newVP);
        let name = videopoker.solve(curCards);
        let coeff = VideoPoker.calcucateCoeff(videopoker.solve(curCards));
        let upd2 = await mysqlquery(connection, "UPDATE videopoker SET videopoker='" + newVP + "' WHERE id='" + _pokerId + "';");
        let _userInfo = await mysqlquery(connection, "SELECT * FROM users WHERE id='" + gameInfo.userid + "';");
        let userInfo = _userInfo[0];
        let newUserBalance = userInfo.balance + parseFloat((parseFloat(coeff) * gameInfo.bet).toFixed(2));
        connection.query("UPDATE users SET balance='" + newUserBalance + "' WHERE id='" + gameInfo.userid + "';");

        res.json({ activegame: false, output: curCards, balance: newUserBalance, coeff: (name) });
      }
    }
  })();
});

app.get('*', function (req, res) {


  res.sendFile(path.join(__dirname, '..', 'front', 'build', 'index.html'));
  console.log(path.join(__dirname, '..', 'front', 'build', 'index.html'));
});

app.listen(process.env.PORT || 8080);