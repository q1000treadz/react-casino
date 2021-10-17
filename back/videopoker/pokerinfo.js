const { createconnection, mysqlquery } = require('../mysql1');
const VideoPoker = require('./videopoker');
module.exports = {
    getPokerInfo: async function (connection, userId) {
        let _videoPoker = await mysqlquery(connection, "SELECT * FROM videopoker WHERE userid='" + userId + "' AND active='1'");
        if (_videoPoker.length != 0) {
            let videoPokerInf = _videoPoker[0];
            let poker = {
                userid: userId,
                activegame: true,
                bet: videoPokerInf.bet,
                pokerid: videoPokerInf.id,
                output: (VideoPoker.makeOutput(videoPokerInf.videopoker))
            };
            return poker;
        } else {
            let poker = {
                userid: userId,
                activegame: false,
            };
            return poker;
        }
    }
}