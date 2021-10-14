var Hand = require('pokersolver').Hand;
//Spades, clubs, diamonds and hearts.
console.log(Hand.solve(['9d', 'Qd', 'Jd', 'Kd', 'Td']));
console.log(Hand.solve(['2s', 'Qd', '2c', '2h', '2d']).name);

//INSERT INTO videopoker(id,videopoker,userid,bet,active) VALUES('1','4d7cJhQhAsAcAhTd2h3h00000','1','10','1');
generateDeck = function () {
    let result = [];
    let suits = ["s", "c", "d", "h"];
    let numbers = ["2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K", "A"];
    for (let i = 0; i < suits.length; i++) {
        for (let j = 0; j < numbers.length; j++) {
            result.push(numbers[j] + suits[i]);
        }
    }
    return result;
}

shuffle = function (array) {
    let currentIndex = array.length, randomIndex;

    while (currentIndex != 0) {

        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}
module.exports = {
    generate10Cards: function () {
        let shuffledDeck = shuffle(generateDeck());
        let result = {};
        result.first = shuffledDeck.slice(0, 5);
        result.second = shuffledDeck.slice(5, 10);
        return result;
    },
    makeOutput: function (array) {
        console.log("ARRAy");
        console.log(array);
        console.log(array.length);
        if (array.length == 25) {
            let cards = [];
            for (let t = 20; t < 25; t++) {
                if (array[t] == "0") {
                    cards.push(array.slice((t - 20) * 2, (t - 20) * 2 + 2));
                } else {
                    cards.push(array.slice((t - 20) * 2 + 10, (t - 20) * 2 + 10 + 2));
                }
            }
            console.log("CARDS");
            console.log(cards);
            return cards;
        }

        return [];
    },
    solve(arr) {
        return Hand.solve(arr).name;
    },
    calcucateCoeff(name) {
        switch (name) {
            case 'Pair':
                return 1.00;
                break;
            case 'Two Pair':
                return 2.00;
                break;
            case 'Three of a Kind':
                return 3.00;
                break;
            case 'Straight':
                return 4.00;
                break;
            case 'Flush':
                return 6.00;
                break;
            case 'Full House':
                return 9.00;
                break;
                case 'Four of a Kind':
                    return 22.00;
                    break;
                    case 'Straight Flush':
                        return 60.00;
                        break;
                        case 'Royal Flush': //descr
                            return 800.00;
                            break;
                            default:
                                return 0.0;
                                break;

        }
    }
}
//console.log(generate10Cards(shuffle(generateDeck())));