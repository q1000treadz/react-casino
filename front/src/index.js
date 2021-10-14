import React from 'react';
import ReactDOM from 'react-dom';
import { Mines } from "./mines"
import { VideoPoker } from "./videopoker"
import { callBackendAPI } from './api'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import { Crash } from './crash';
import './css/grid.css';
class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            balance: 0,
            activegame: false,
            currentbet: 0,
            id: 0,
            data: "",
            userid: 1,
            mineId: 0,
            name: ""
        }
        this.editBalance = this.editBalance.bind(this);
    }
    componentDidMount() {
        console.log("BEBRA");
        let sendObj = {
            userid: 1
        }
        callBackendAPI('/userinfo', {
            method: 'POST', headers: {
                'Content-Type': 'application/json'
            }, body: JSON.stringify(sendObj)
        })
            .then(res => this.setState({ balance: res.balance, userid: res.id, name: res.name }))
            .catch(err => console.log(err));
    }
    editBalance(newBalance) {
        this.setState({ balance: newBalance });
    }
    render() {
        //let 
        return (
            <div className="grid-container">
                <Router>
                    <div className="header1">
                        <Link to="/"><button type="button" id="b1" class="homebutton">HOME</button></Link>
                        <div className="userprofile">
                                <div className="balancediv">
                                    Balance:
                                </div>
                                <div className="balancestatediv">
                                    {this.state.balance}
                                </div>
                                {this.state.name}
                        </div>
                    </div>


                    <div className="nav1">
                        <nav>
                            <ui>
                                <li className="buttonListElem">
                                    <Link to="/mines"><button type="button" id="b2" class="small_btn">mines</button></Link>
                                </li>
                                <li className="buttonListElem">
                                    <Link to="/crash"><button type="button" id="b3" class="small_btn">crash</button></Link>
                                </li>
                                <li className="buttonListElem">
                                    <Link to="/videopoker"><button type="button" id="b4" class="small_btn">videopoker</button></Link>
                                </li>
                            </ui>
                        </nav>
                    </div>
                    <Switch>
                        <div className="article1">
                            <Route path="/mines">
                                <Mines editBalance={this.editBalance} />
                            </Route>
                            <Route path="/crash">

                                <Crash />
                            </Route>
                            <Route path="/videopoker"><VideoPoker editBalance={this.editBalance} /></Route>
                            <Route path="/"></Route>
                        </div>
                    </Switch>

                </Router>
                <div className="footer1"></div>
            </div>
        );
    }
}
ReactDOM.render(
    <div>
        <App />
    </div>,
    document.getElementById('root')
);