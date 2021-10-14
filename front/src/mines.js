import React from 'react';
import './css/App.css';
import './css/mines.css';
import './css/betField.css'
import { BetField } from './betfield';
//import App from './App';
import reportWebVitals from './reportWebVitals';
import { calculateCoefficient, CoefficientBlock } from './components/CoefficientBlock.js';
import { callBackendAPI } from './api'



function LoseBlock() {
  return (<div className="loseBlock">ВЫ ПРОИГРАЛИ</div>)
}
function WinBlock() {
  return (<div className="winBlock">ВЫ ВЫИГРАЛИ</div>)
}



class Square extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: props.value,
      status: props.status,
      showStatus: false
    };
  }
  render() {
    console.log(this.props.status);
    return (<>
      <button className={"button" + this.props.status}
        key={this.props.value}
        onClick={() => {
          if (this.props.canEdit) {

            if (this.state.showStatus === false)
              this.props.clickMine(this.props.value - 1); //this.props.value
            this.setState({ showStatus: true });
          }
        }}>
        {this.props.value}
      </button>
    </>);
  }
}

class Field extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      value: this.props.value,
      current: 0,
      output: this.props.output,
      canEdit: true,
      mineId: this.props.mineid
    };
    this.clickMine = this.clickMine.bind(this);
    console.log(this.state.output);
  }

  clickMine(val) {
    let sendObj = {
      mineId: this.props.mineId,
      number: val
    }
    callBackendAPI('/clickmine', {
      method: 'POST', headers: {
        'Content-Type': 'application/json'
      }, body: JSON.stringify(sendObj)
    })
      .then(res => {
        let status = res.mine;
        if (status != 1) {
          let u = this.state.output;
          u[val] = status;
          this.setState({ output: u });
        }
        if (status === 3) {
          this.setState({ canEdit: false });

          this.props.endGame();
          //setTimeout(()=> {console.log("Sd");}, 2000);
          //this.setState({ canEdit: false });
          // setTimeout(this.props.endGame, 2000);
        }
        else {
          this.setState(prevState => ({ current: prevState.current + 1 }));
        }
      })
      .catch(err => console.log(err));

  }
  render() {
    var arr = [];
    for (let i = 1; i < 26; i++) {
      if ((i - 1) % 5 === 0) arr.push(<br />);
      arr.push(<Square clickMine={this.clickMine} canEdit={this.state.canEdit} cssstyle="button1" value={i} status={this.state.output[i - 1]} />);
    }
    var takeButton = <button className="startgamebutton" onClick={() => { console.log("SADEDAD"); this.props.endGame(); }}>Забрать</button>;
    return (
      <div>
          {arr}
          </div>
    );
  }
}

export class Mines extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userid: 1,
      activegame: false,
      bet: 0,
      mineid: 0,
      value: 3,
      output: ""
    };
    this.startGame = this.startGame.bind(this);
    this.endGame = this.endGame.bind(this);
    this.handleChangeMines = this.handleChangeMines.bind(this);
  }
  componentDidMount() {
    let sendObj = {
      userid: 1
    }
    callBackendAPI('/mineinfo', {
      method: 'POST', headers: {
        'Content-Type': 'application/json'
      }, body: JSON.stringify(sendObj)
    })
      .then(res => { if (res.activegame) this.setState({ activegame: res.activegame, bet: res.bet, mineid: res.mineid, value: res.value, output: res.output }); })
      .catch(err => console.log(err));
  }
  handleChangeMines(event) {
    this.setState({ value: event.target.value });
  }
  startGame(bet, id) {
    if (this.state.activegame == false) {
      let sendObj = {
        bet: bet,
        gameId: id,
        userid: this.state.userid,
        num: this.state.value
      }
      callBackendAPI('/startgame', {
        method: 'POST', headers: {
          'Content-Type': 'application/json'
        }, body: JSON.stringify(sendObj)
      })
        .then(res => {
          console.log(res);
          if (res.activegame) {
            this.props.editBalance(res.balance);
            this.setState({ activegame: res.activegame, bet: res.bet, mineid: res.mineid, value: res.value, output: res.output });
            console.log(this.state);
          }
        })
        .catch(err => console.log(err));
    }
  }
  endGame() {
    console.log("ASDDDSADDSAD");
    let sendObj = {
      mineId: this.state.mineid
    }
    callBackendAPI('/endgame', {
      method: 'POST', headers: {
        'Content-Type': 'application/json'
      }, body: JSON.stringify(sendObj)
    })
      .then(res => {
        setTimeout(()=> {
        this.props.editBalance(res.balance);
        this.setState({ activegame: false, bet: 0, mineid: 0, value: 3 });
        }, 2000);

      })
      .catch(err => console.log(err));
  }
  render() {
    let chooser = <input className="input1" type="number" id="mines" name="mines" min="1" max="24" onChange={this.handleChangeMines} value={this.state.value}></input>;
    //let takeButton = <button className="startgamebutton" onClick={() => { this.endGame(); }}>Забрать</button>;  
    //(this.state.activegame) ? takeButton : ""}
    return (<>
      <div className="Block">
      <div className="Header">
      <div className="options_Buttons__APIuR">
            <div className="gameName">
            Mines
            </div>
          </div>
      </div>
        <div className="Game">
          
          <BetField id="1" isDisabled={this.state.activegame} getBetValue={this.startGame} bet={this.state.bet} value={this.state.value} chooser={chooser} />
          
        

        <div className="Component">
        <div className="mainGameBlock">
          {(this.state.activegame) ? <Field output={this.state.output} currentbet={this.state.bet} value={this.state.value} endGame={this.endGame} mineId={this.state.mineid} /> : "waiting for start"}
        
        <div className="coefficientBlockMines">
          sad
        </div>
        </div>
      </div>
      </div>
      </div>
    </>
    );
  }
}


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log)) <button className="buttonStart" onClick={()=>{this.setState({startGame:true})}}>start</button>
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
