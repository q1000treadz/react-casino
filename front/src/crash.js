import React from 'react';
import './css/App.css';

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
  
function generateCrash() {
    let maxN = Math.pow(2,52);
    let t = getRandomInt(maxN);
    let multiplier = (((maxN*100)-t)/(maxN-t))/100;
    return multiplier;
}
var t = 200;
class CrashGame extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentCoeff: 1.00,
        }
        this.upCoeff = this.upCoeff.bind(this);
    }


    upCoeff() {
        this.setState(prev => ({currentCoeff:Number(Number(prev.currentCoeff)+0.01).toFixed(2)}));
        t-=1;
        console.log(t);
        setTimeout(this.upCoeff, t);
    }
    componentDidMount() {
        setTimeout(this.upCoeff, t);
       
        
    }
  
      componentWillUnmount() {
        clearInterval(this.timerID);
      }
    render() {
        return (
            <>
            {this.state.currentCoeff}
            </>
        );
    }
}


export class Crash extends React.Component {
    constructor(props) {
        super(props);

        this.winGame = this.winGame.bind(this);
        this.loseGame = this.loseGame.bind(this);
    }

    winGame(coeff) {
        console.log("sdd");
        console.log(this.state.money+(this.state.bet*parseFloat(coeff)-this.state.bet));
        this.setState(prev => ({startGame:false,money:(parseFloat(prev.money)+(parseFloat(prev.bet)*parseFloat(coeff)- parseFloat(prev.bet))).toFixed(2)}));
        this.props.endGame(coeff);
     }
      loseGame() {
   
          console.log(this.state.bet);
        this.setState(prev => ({startGame:false,money:(parseFloat(prev.money)-parseFloat(prev.bet)).toFixed(2)}));
        this.props.endGame(0.0);
   
      }
    render() {
        return (
            /*
            {generateCrash()}<br/>
            {generateCrash()}<br/>
            {generateCrash()}<br/>*/
            <>
            {(this.props.startGame  && this.props.id=="2") 
            ? 
            <CrashGame /> 
            : 
            (<div style={{'text-align': 'center'}}>WORK IN PROGRESS</div>)}
            </>
        );
    }
}

