import React from 'react';
import { callBackendAPI } from './api'
import { BetField } from './betfield';
import './css/videopoker.css'
import './css/betfield.css';
import './css/gamefield.css'
export class VideoPoker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userid: 1,
      activegame: false,
      bet: 0,
      pokerid: 0,
      output: "",
      choosen: [1, 1, 1, 1, 1],
      pastgame: false
    };
    this.imageClick = this.imageClick.bind(this);
    this.changeCards = this.changeCards.bind(this);
    this.startGame = this.startGame.bind(this);
  }
  componentDidMount() {
    let sendObj = {
      userid: 1
    }
    callBackendAPI('/videopoker/pokerinfo', {
      method: 'POST', headers: {
        'Content-Type': 'application/json'
      }, body: JSON.stringify(sendObj)
    })
      .then(res => { if (res.activegame) this.setState({ pastegame: false, activegame: res.activegame, bet: res.bet, pokerid: res.pokerid, output: res.output }); })
      .catch(err => console.log(err));
  }
  imageClick(index) {
    let arr = this.state.choosen;
    if (arr[index] == 1) arr[index] = 0;
    else arr[index] = 1;
    this.setState({ choosen: arr });
  }
  changeCards() {
    console.log("CHANGE CARDS");
    if (this.state.activegame == true) {
      this.setState({ choosen: [1, 1, 1, 1, 1] });
      let sendObj = {
        userid: 1,
        choosen: this.state.choosen,
        pokerid: this.state.pokerid
      }
      callBackendAPI('/videopoker/changecards', {
        method: 'POST', headers: {
          'Content-Type': 'application/json'
        }, body: JSON.stringify(sendObj)
      })
        .then(res => {
          this.setState({ output: res.output, pastgame: true, coeff: res.coeff });
          console.log("OUTPUT");

          this.props.editBalance(res.balance);
          console.log(res.output);
          setTimeout(() => { this.setState({ activegame: res.activegame, pastgame: false, bet: 0, pokerid: 0, coeff: "" }); }, 3000);
        })
        .catch(err => console.log(err));
    }
  }
  startGame(_bet) {
    if (this.state.activegame == false) {
      let sendObj = {
        bet: _bet,
        userid: 1
      }
      callBackendAPI('/videopoker/startgame', {
        method: 'POST', headers: {
          'Content-Type': 'application/json'
        }, body: JSON.stringify(sendObj)
      })
        .then(res => {
          console.log(res);
          if (res.activegame) {
            this.props.editBalance(res.balance);
            this.setState({ pastegame: false, activegame: res.activegame, bet: res.bet, pokerid: res.pokerid, value: res.value, output: res.output });
          }
        })
        .catch(err => console.log(err));
    }
  }
  render() {
    function importAll(r) {
      let images = {};
      r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
      return images;
    }

    const images = importAll(require.context('./images/cards/', false, /\.(png|jpe?g|svg)$/));
    let active = [];
    if(this.state.activegame == false) {
      for (let i = 0; i < 5; i++) {
        let src = "back.png";
        active.push(<button id={i}><img src={images[src].default} width="100" height="150" alt={i}></img></button>);
      }
    } else {
    for (let i = 0; i < this.state.output.length; i++) {
      let src = this.state.output[i] + ".png";
      active.push(<button id={i} className={!this.state.choosen[i] ? "choosenCard" : ""} onClick={() => { if (!this.state.pastgame) this.imageClick(i) }}><img src={images[src].default} width={!this.state.choosen[i] ? "90" : "100"} height={!this.state.choosen[i] ? "140" : "150"} alt={i}></img></button>);
    }
  }

    let inactive = "";//<button onClick={this.startGame}>Начать игру</button>;

    let winCombinations = [
      {name:"Pair", coeff: "x1.00"},
      {name:"Two Pair", coeff: "x2.00"},
      {name:"Three of a Kind", coeff: "x3.00"},
      {name:"Straight", coeff: "x4.00"},
      {name:"Flush", coeff: "x6.00"},
      {name:"Full House", coeff: "x9.00"},
      {name:"Four of a Kind", coeff: "x22.00"},
      {name:"Straight Flush", coeff: "x60.00"},
      {name:"Royal Flush", coeff: "x800.00"}
    ];
    let _coefficientBlock = [];
    for(let i =0;i<9;i++)
    _coefficientBlock.push(<div className={this.state.coeff==winCombinations[i].name ? "coefficentElemChoosen" : "coefficentElem"}><div className="payoffsName">{winCombinations[i].name}</div><div className="payoffsCoeff">{winCombinations[i].coeff}</div></div>);
    
    /*
    <div className="pokerBetComponent">
          <div className="pokerBet">
            <div className="betComponent">
              <div className="betForm">
              <BetField id="1" isDisabled={this.state.activegame} getBetValue={this.startGame} bet={this.state.bet} />
          </div>
          </div>
          </div>
          </div>
    */
    return (
      <>
        <div className="Block">
          
          <div className="Header">
            <div className="options_Buttons__APIuR">
            <div className="gameName">
            Video Poker
            </div>
          </div>
          </div>
          <div className="Game">
              <BetField id="1" isDisabled={this.state.activegame} getBetValue={this.startGame} bet={this.state.bet} />
             
          <div className="Component">
          <div className="mainGameBlock">
            <div className="cardsBoard">
            <div className="cards">
            {active}
            </div>
              <button className="Cards_Deal__1Xbph" onClick={() => { if(this.state.activegame == true && !this.state.pastgame) this.changeCards()}}>Сменить карты</button>
              
            
            </div>
            <div className="coefficientBlockPoker">
            <div className="coefficentRow">
              
            {_coefficientBlock[0]}
            {_coefficientBlock[1]}
            {_coefficientBlock[2]}
              </div>
              <div className="coefficentRow">
              {_coefficientBlock[3]}
            {_coefficientBlock[4]}
            {_coefficientBlock[5]}
              </div>
            <div className="coefficentRow">
            {_coefficientBlock[6]}
            {_coefficientBlock[7]}
            {_coefficientBlock[8]}
              </div>
              </div>
            </div>
          </div>
          </div>
        </div>
      </>
    );
  }
}