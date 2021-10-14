import React from 'react';
import './css/betfield.css';
import './css/App.css';
import './css/videopoker.css'
import { callBackendAPI } from './api';
export class BetField extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            betValue: this.props.bet
        }
        this.changeValue = this.changeValue.bind(this);
        this.handleBetValue = this.handleBetValue.bind(this);
    }
    handleBetValue(event) {
        if (event.target.value > 0)
            this.setState({ betValue: event.target.value });
    }
    changeValue(id) {
        switch(id) {
            case 1:
                this.setState(prev => ({ betValue: prev.betValue+1 }));
            break;
            case 2:
                this.setState(prev => ({ betValue: prev.betValue+5 }));
            break;
            case 3:
                this.setState(prev => ({ betValue: prev.betValue+10 }));
            break;
            case 4:
                this.setState(prev => ({ betValue: prev.betValue+50 }));
            break;
            case 5:
                this.setState(prev => ({ betValue: prev.betValue+100 }));
            break;
            default:
            break;
        }
    }
    render() {
        let buttonS = (!this.props.isDisabled) ? <button className="startgamebutton" onClick={() => {
            console.log(!this.props.isDisabled);
            console.log(this.state.betValue);
            if (!this.props.isDisabled && this.state.betValue > 0) {

                this.props.getBetValue(this.state.betValue, this.props.id);
            }
        }}>Начать игру</button> : "";
        //<input className="input1" type="number" id="mines" name="mines" min="1" max="24" onChange={this.handleChangeMines} value={this.state.value}></input>
        return (
            <>

          <div className="pokerBetComponent">
          <div className="pokerBet">
            <div className="betComponent">
              <div className="betForm">
             
              <div className="bet_BetSize__2AatD"><label className="bet_Label__2-fPp 
forms_form-label__slXLj"><span>Сумма ставки</span></label></div>

<div className="bet_InputWrapper__29k6m">
    <input type="number" inputmode="decimal" id="betSize" className="input-field" name="xRywgpAz1ur" autocomplete="off" onChange={this.handleBetValue} value={this.state.betValue} disabled={this.props.isDisabled}>
    </input>
    <div className="control_ControlButtons__2jngX">
        <button className="control_ControlClear__qBf59">X</button>
        <button className="control_ControlBtn__2Mzim" id="division2" onClick={() => { if (!this.props.isDisabled) this.setState(prev => ({ betValue: Math.floor(Number(prev.betValue) / 2) })) }}>/2</button>
        <button className="control_ControlBtn__2Mzim" id="multiple2" onClick={() => { if (!this.props.isDisabled) this.setState(prev => ({ betValue: Number(prev.betValue) * 2 })) }}>*2</button>
    </div>
    
</div>
<div className="control_FastButtons__XqqH1">
<button className="control_FastBtn__Nj7lQ" onClick={() => {this.changeValue(1)}}>+1</button>
<button className="control_FastBtn__Nj7lQ" onClick={() => {this.changeValue(2)}}>+5</button>
<button className="control_FastBtn__Nj7lQ" onClick={() => {this.changeValue(3)}}>+10</button>
<button className="control_FastBtn__Nj7lQ" onClick={() => {this.changeValue(4)}}>+50</button>
<button className="control_FastBtn__Nj7lQ" onClick={() => {this.changeValue(5)}}>+100</button>
<button className="control_FastBtn__Nj7lQ" onClick={() => {this.changeValue(6)}}>max</button>
</div>

<div><button className="button_play__-Cbjj button_green__NmQms button_Button__1W86R" onClick={() => {
            console.log(!this.props.isDisabled);
            console.log(this.state.betValue);
            if (!this.props.isDisabled && this.state.betValue > 0) {

                this.props.getBetValue(this.state.betValue, this.props.id);
            }
        }}>Начать игру</button></div>

                    {this.props.chooser}
          </div>

          </div>
          </div>
          </div>
            </>
        );
    }

}