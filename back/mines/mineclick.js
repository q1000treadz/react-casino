const { createconnection, mysqlquery } = require('../mysql1');
const { generateMines, calculateCoefficient, generateOutputArray, makeSteps, getOpenMinesNumber, checkLoseMine, getMinesNumber } = require('./mines');
const { endMineGame } = require('./mineend');
module.exports = {
    mineClick: async function (connection, number, mineid) {
        let res1 = {
            mine: 0,
        };
        let results = await mysqlquery(connection, "SELECT * FROM mines WHERE id='" + mineid + "' AND active='1'");
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
        let upd2 = connection.query("UPDATE mines SET mines='" + str + "' WHERE id='" + mineid + "' AND active='1'");
        if (res1.mine == 3) {
            let balance = await endMineGame(connection, mineid);
            res1.balance = balance.balance;
        }
        return res1;
    }
}