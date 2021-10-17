const { createconnection, mysqlquery } = require('../mysql1');
const { generateMines, calculateCoefficient, generateOutputArray, makeSteps, getOpenMinesNumber, checkLoseMine, getMinesNumber } = require('./mines');
module.exports = {
    getMineInfo: async function (connection, _userId) {
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
                return mine;
            } else {
                let mine = {
                    userid: _userId,
                    activegame: false,
                };
                return mine;
            }
    }
}
/*return new Promise(function (resolve, reject) {
    db.query(sql, function (err, results, fields) {
        if (err) { console.log(err); throw err; }
        return resolve(results);
    });
});*/