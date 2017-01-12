import React, {Component} from 'react';

// Contains "Welcome page" components

export default class Intro extends Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e) {
        this.props.onClick(e.target.id);
    }

    render() {
        return (
            <div className="row">
                <div className="col-md-5"></div>
                <div className="col-md-2 centered-row">
                    <img id="laptop" src="screen-laptop.png" alt="laptop"/>
                    <button
                        type="button"
                        className="btn btn-default btn-lg"
                        id="signUp"
                        onClick={this.handleClick}>
                        <b id="signUp">Sign up</b>
                    </button>
                    <p id="or">OR</p>
                    <button
                        type="button"
                        className="btn btn-default btn-lg"
                        id="signIn"
                        onClick={this.handleClick}>
                        <b id="signIn">Sign in</b>
                    </button>
                </div>
                <div className="col-md-5"></div>
            </div>
        );
    }
}