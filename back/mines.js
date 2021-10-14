module.exports = {

    generateMines: function (num) {
        var random_start = 1;
        var random_end = 25;
        var allСycles = num;
        var array = [];
        for (let i = random_start; i <= random_end; i++) {
            array.push(i);
        }
        var res = [];
        for (let countCycles = 1; countCycles <= allСycles; countCycles++) {
            res.push(array.splice(Math.random() * array.length, 1)[0]);
        }
        res.sort((a, b) => (a - b));
        var out = [];
        var t = 0;
        for (let i = 1; i <= 25; i++) {
            if (res[t] === i) { out.push(1); t++; }
            else { out.push(0); }
        }

        return out;
    },

    calculateCoefficient: function (num) {
        var max = 25;
        var arr = [];
        arr.push(1);
        let guess = max - num;
        let all = 25;
        let cur = 1;
        let ind = 1;
        for (let u = guess; u >= 1; u--) {
            cur *= (u / all);
            all--;
            arr[ind] = 1 / cur;
            ind++;
        }
        console.log(arr);
        return arr;
    },
    makeSteps: function(startArray) {
        
        let mArr = [];
        for(let i =0;i<startArray.length;i++) {
            mArr.push(Number(startArray[i]));
        }
        return mArr;
    },
    getOpenMinesNumber: function (minesArr) {
        let count = 0;
        for (let i = 0; i < minesArr.length; i++) {
            if (minesArr[i] == 2) count++;
        }
        return count;
    },

    generateOutputArray: function(minesArr) {
        let result = minesArr.map(function(mine) {
            if(mine == 0 || mine == 1) {
                return 1;
              } else if(mine==2) {
                return 2;
              } else if(mine==3){
                return 3;;
              }
        });
        return result;
    },
    
    checkLoseMine: function(minesArr) {
        let lose = false;
        for (let i = 0; i < minesArr.length; i++) {
            if (minesArr[i] == 3) lose=true;
        }
        return lose;
    },
    getMinesNumber: function(minesArr) {
        let count = 0;
        for (let i = 0; i < minesArr.length; i++) {
            if (minesArr[i] == 3 || minesArr[i] == 1) count++;
        }
        return count;
    }
}