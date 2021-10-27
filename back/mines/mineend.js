const { createconnection, mysqlquery } = require('../mysql1');
const { generateMines, calculateCoefficient, generateOutputArray, makeSteps, getOpenMinesNumber, checkLoseMine, getMinesNumber } = require('./mines');
module.exports = {
    endMineGame: async function (connection, mineid) {
        let upd = await mysqlquery(connection, "UPDATE mines SET active='0' WHERE id='" + mineid + "';");
        let _gameInfo = await mysqlquery(connection, "SELECT * FROM mines WHERE id='" + mineid + "';");
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
            let upd2 = connection.query("UPDATE users SET balance='" + newUserBalance + "' WHERE id='" + gameInfo.userid + "';");
            return { balance: newUserBalance };
           
        }
    }
}