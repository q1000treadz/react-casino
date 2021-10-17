const { createconnection, mysqlquery } = require('../mysql1');
const { generateMines, calculateCoefficient, generateOutputArray, makeSteps, getOpenMinesNumber, checkLoseMine, getMinesNumber } = require('./mines');
module.exports = {
    startMineGame: async function (connection, userId, minesNumber, bet) {
        let _mineInfo = await mysqlquery(connection, "SELECT * FROM mines WHERE userid='" + userId + "' AND active='1'");
        if (_mineInfo.length == 0) {
            let arr = generateMines(minesNumber);
            let str = "";
            for (let i = 0; i < 25; i++) {
                str += arr[i].toString();
            }
            let newid = await mysqlquery(connection, "SELECT id FROM mines ORDER BY id DESC LIMIT 1;");
            let newgame = await mysqlquery(connection, "INSERT INTO mines(id,mines,userid,bet, coefficient, active) VALUES ('" + (newid[0].id + 1) + "','" + str + "','1','" + bet + "','0','1');")
            let mid = (newid[0].id + 1);

            let _userInfo = await mysqlquery(connection, "SELECT * FROM users WHERE id='" + userId + "';");
            let userInfo = _userInfo[0];
            let newUserBalance = userInfo.balance - bet;
            let upd2 = await connection.query("UPDATE users SET balance='" + newUserBalance + "' WHERE id='" + userId + "';");//, function (err, results) {
            let res1 = {
                userid: userId,
                activegame: true,
                bet: bet,
                mineid: mid,
                value: getMinesNumber(arr),
                output: generateOutputArray(arr),
                balance: newUserBalance
            }
            return res1;
        }
    }
}