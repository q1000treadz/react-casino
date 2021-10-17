const { createconnection, mysqlquery } = require('../mysql1');
const VideoPoker = require('./videopoker');
module.exports = {
    changePokerCards: async function (connection, userid, pokerid, choosen) {
        let _gameInfo = await mysqlquery(connection, "SELECT * FROM videopoker WHERE id='" + pokerid + "';");

        let gameInfo = _gameInfo[0];
        if (gameInfo != undefined) {
            if (gameInfo.active == 1) {
                let upd = await mysqlquery(connection, "UPDATE videopoker SET active='0' WHERE id='" + pokerid + "';");
                let newVP = gameInfo.videopoker.slice(0, 20);
                let str = "";
                for (let i = 0; i < 5; i++) {
                    str += choosen[i].toString();
                }
                newVP += str;
                let curCards = VideoPoker.makeOutput(newVP);
                let name = VideoPoker.solve(curCards);
                let coeff = VideoPoker.calcucateCoeff(VideoPoker.solve(curCards));
                let upd2 = await mysqlquery(connection, "UPDATE videopoker SET videopoker='" + newVP + "' WHERE id='" + pokerid + "';");
                let _userInfo = await mysqlquery(connection, "SELECT * FROM users WHERE id='" + gameInfo.userid + "';");
                let userInfo = _userInfo[0];
                let newUserBalance = userInfo.balance + parseFloat((parseFloat(coeff) * gameInfo.bet).toFixed(2));
                let ups3 = connection.query("UPDATE users SET balance='" + newUserBalance + "' WHERE id='" + gameInfo.userid + "';");

                return { activegame: false, output: curCards, balance: newUserBalance, coeff: (name) };
            }
        }
    }
}