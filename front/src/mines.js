import React from 'react';
import './css/App.css';
import './css/mines.css';
import './css/betfield.css'
import { BetField } from './betfield';
//import App from './App';
import reportWebVitals from './reportWebVitals';
import { calculateCoefficient, CoefficientBlock } from './components/CoefficientBlock.js';
import { callBackendAPI } from './api'
import { connect } from 'react-redux';
import { minesFetchData, assignState } from './action/mines';


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
      mineid: this.props.mineid,
      activegame: this.props.activegame
    };
    this.clickMine = this.clickMine.bind(this);
    console.log(this.state.output);
  }
  componentDidMount() {
    console.log("FIELD");
    console.log(this.props);
  }
  clickMine(val) {
    let sendObj = {
      mineid: this.props.mineid,
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

          console.log(res);
          this.props.endGame(res);
        }
        else {
          this.setState(prevState => ({ current: prevState.current + 1 }));
        }
      })
      .catch(err => console.log(err));

  }
  render() {
    var arr = [];
    var farray = [];
    for (let i = 1; i < 26; i++) {
      if ((i - 1) % 5 === 0) {
        arr.push(<div className="minesSquareFieldRow">{farray}</div>);
        farray = [];
      }
      farray.push(<Square clickMine={this.clickMine} canEdit={this.state.canEdit} cssstyle="button1" value={i} status={this.state.output[i - 1]} />);
    }
    arr.push(<div className="minesSquareFieldRow">{farray}</div>);
    var takeButton = <div><button className="startgamebutton" onClick={() => { console.log("SADEDAD"); this.props.endGame(); }}>Забрать</button></div>;
    return (
      <div>
        <div className="minesSquareField">
          {arr}
        </div>
        <div>
          {takeButton}
        </div>
      </div>
    );
  }
}

class Mines extends React.Component {
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
    
    console.log(this.props);
    console.log("componentDidMount");
    console.log(this.props.callBackendAPI('/mineinfo',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(sendObj)
    }
  ));
    this.props.callBackendAPI('/mineinfo',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(sendObj)
      }
    );
   // this.props.assignState(obj);
    console.log("CALLBACKENDAPI");
    console.log(this.props.state);
    //this.setState(this.props.state);
    /* callBackendAPI('/mineinfo', {
     method: 'POST', headers: {
       'Content-Type': 'application/json'
     }, body: JSON.stringify(sendObj)
   })
     .then(res => { if (res.activegame) this.setState({ activegame: res.activegame, bet: res.bet, mineid: res.mineid, value: res.value, output: res.output }); })
     .catch(err => console.log(err));*/
  }
  componentDidUpdate() {
    console.log("UPDATE");
    console.log(this.props.state);
  }
  handleChangeMines(event) {
    this.setState({ value: event.target.value });
  }
  startGame(bet, id) {
    if (this.props.state.activegame == false) {
      let sendObj = {
        bet: bet,
        gameId: id,
        userid: this.props.state.userid,
        num: this.props.state.value
      }
      this.props.callBackendAPI('/startgame',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(sendObj)
        }
      );
      ///this.props.assignState(obj);
      /*
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
            console.log(this.props.state);
          }
        })
        .catch(err => console.log(err));*/
    }
  }
  endGame(res = undefined) {
    console.log("res");
    console.log(res);
    if (res == undefined) {
      console.log("ASDDDSADDSAD");
      let sendObj = {
        mineid: this.props.state.mineid
      }
      this.props.callBackendAPI('/endgame',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(sendObj)
        }
      );
     
      //this.props.editBalance(res.balance);
      this.props.assignState({ activegame: false, bet: 0, mineid: 0 });
      /*
      callBackendAPI('/endgame', {
        method: 'POST', headers: {
          'Content-Type': 'application/json'
        }, body: JSON.stringify(sendObj)
      })
        .then(res => {
          setTimeout(() => {
            this.props.editBalance(res.balance);
            this.setState({ activegame: false, bet: 0, mineid: 0 });
          }, 2000);

        })
        .catch(err => console.log(err));*/
    } else {
      this.props.editBalance(res.balance);
      this.props.assignState({ activegame: false, bet: 0, mineid: 0 });
      //this.setState({ activegame: false, bet: 0, mineid: 0 });
    }
  }
  render() {
    let chooser = <input className="input1" type="number" id="mines" name="mines" min="1" max="24" onChange={this.handleChangeMines} value={this.props.state.value}></input>;
    //let takeButton = <button className="startgamebutton" onClick={() => { this.endGame(); }}>Забрать</button>;  
    //(this.props.state.activegame) ? takeButton : ""}
    let count = 0;
    for (let i = 0; i < this.props.state.output.length; i++) {
      if (this.props.state.output[i] == "2") count++;
    }
    console.log("RENDER");
    console.log(this.props.state);
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

          <BetField id="1" isDisabled={this.props.state.activegame} getBetValue={this.startGame} bet={this.props.state.bet} value={this.props.state.value} chooser={chooser} />



          <div className="Component">
            <div className="mainGameBlock">
              {(this.props.state.activegame) ? <Field activegame={this.props.state.activegame} output={this.props.state.output} currentbet={this.props.state.bet} value={this.props.state.value} endGame={this.endGame} mineid={this.props.state.mineid} /> : "waiting for start"}

              <div className="coefficientBlockMines">
                <div className="hits_HitRow__2xXXQ">
                  <div className="hits_Item__1SvQF">
                    <div className="hits_coeff__1lz94">
                      {count}
                    </div>
                    <div className="hits_hit__2qdbe">
                      {this.props.state.output}
                    </div>
                  </div>
                  <div className="hits_Item__1SvQF">
                    <div className="hits_coeff__1lz94">
                      X1.3
                    </div>
                    <div className="hits_hit__2qdbe">
                      2 hit
                    </div>
                  </div>
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

const mapsStateToProps = state => {
  return { state };
}

const mapDispatchToProps = dispatch => {
  return {
    callBackendAPI: (url, object) => dispatch(minesFetchData(url, object)),
    assignState: (object) => dispatch(assignState(object))
  };
}
export default connect(mapsStateToProps, mapDispatchToProps)(Mines);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log)) <button className="buttonStart" onClick={()=>{this.setState({startGame:true})}}>start</button>
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
