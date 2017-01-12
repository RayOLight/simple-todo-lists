import React, {Component} from 'react';
import './App.css';
import Lists from './Lists.js'
import Form from './Form.js'
import Intro from './Intro.js'

// Main app file, that engages with other in ./src
// When <App /> class changes own state, all of components will rednder immediately

export default class App extends Component {
    constructor() {
        super();
        this.state = {
            id: 'intro'
        };

        this.changeState = this.changeState.bind(this);
        this.setStorage = this.setStorage.bind(this);
        if (localStorage.getItem('login') !== undefined) {
            this.storage = localStorage;
        } else if (sessionStorage.getItem('login') !== undefined) {
            this.storage = sessionStorage;
        } else 
            this.storage = {};
    }

    setStorage(value, login, password) {
        console.log('setting storage');
        if (value === 'false') {
            this.storage = sessionStorage;
        } else if (value === 'true') {
            this.storage = localStorage;
        } else 
            console.log('err');
        this.storage.setItem('login', login);
        this.storage.setItem('password', password);
    }

    changeState(value) {
        this.setState({id: value});
    }

    render() {
        console.log(this.storage.getItem('login'));
        return (
            <div className="container-fulid">
                <div className="row">
                    <div className="col-md-12">
                        <p id="head">
                            SIMPLE TODO LISTS
                        </p>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-3"></div>
                    <div className="col-md-6">
                        {(this.storage) && (this.state.id === 'intro') && <Intro onClick={this.changeState}/>}
                        {(this.storage) && ((this.state.id === 'signUp') || (this.state.id === 'signIn')) && 
                        <Form
                            name={this.state.id}
                            setStorage={this.setStorage}
                            changeState={this.changeState}/>}
                        {(this.state.id === 'data') && <Lists onClick={this.changeState} storage={this.storage}/>}
                    </div>
                    <div className="col-md-3"></div>
                </div>
            </div>
        );
    }
}
