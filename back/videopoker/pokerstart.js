const { createconnection, mysqlquery } = require('../mysql1');
const VideoPoker = require('./videopoker');
module.exports = {
    startPokerGame: async function (connection, userId, bet) {
        let _pokerInfo = await mysqlquery(connection, "SELECT * FROM videopoker WHERE userid='" + userId + "' AND active='1'");
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
            let newgame = await mysqlquery(connection, "INSERT INTO videopoker(id,videopoker,userid,bet, coefficient, active) VALUES ('" + (newid[0].id + 1) + "','" + str + "','1','" + bet + "','0','1');")
            let mid = (newid[0].id + 1);

            let _userInfo = await mysqlquery(connection, "SELECT * FROM users WHERE id='" + userId + "';");
            let userInfo = _userInfo[0];
            let newUserBalance = userInfo.balance - bet;
            connection.query("UPDATE users SET balance='" + newUserBalance + "' WHERE id='" + userId + "';");
            let res1 = {
                userid: userId,
                activegame: true,
                bet: bet,
                pokerid: mid,
                output: VideoPoker.makeOutput(str),
                balance: newUserBalance
            }
            return res1;
        }
    }
}