import React, {Component} from 'react';

// Contains form components

class Input extends Component {

    render() {
        return (
            <div className="form-group">
                <label htmlFor={this.props.htmlFor} className="col-sm-2 control-label">{this.props.type}</label>
                <div className="col-sm-10">
                    <input
                        type={this.props.type}
                        className="form-control"
                        id={this.props.id}
                        placeholder={this.props.type}
                        name={this.props.type}
                        onChange={this.props.handleChange}
                        required/>
                </div>
            </div>
        );
    }
}

export default class Form extends Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.value = 'false';
        this.login = '';
        this.password = '';
    }

    handleClick(e) {
        console.log(e.target.id);
        switch (e.target.id) {
            case 'intro':
                this.props.changeState(e.target.id);
                break;
            case 'sent':
                if (this.props.name === 'signUp') {
                    fetch('/api/newuser', {
                        method: 'post',
                        headers: {
                            "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
                        },
                        body: `login=${this.login}&password=${this.password}`
                    }).then((response) => {
                        console.log('success');
                    }).catch((response) => {
                        console.log('fail');
                    });
                }
                this.props.setStorage(this.value, this.login, this.password);
                this.props.changeState('data');
                break;
            default:
                break;
        }
    }

    handleChange(e) {
        switch (e.target.type) {
            case 'checkbox':
                this.value = this.value === 'true'
                    ? 'false'
                    : 'true';
                break;
            case 'email':
                this.login = e.target.value;
                break;
            case 'password':
                this.password = e.target.value;
                break;
            default:
                break;
        }
    }

    render() {
        return (
            <div id="form" className="row">
                <p id="signfoo">
                    {this.props.name}<span
                        id="intro"
                        className="glyphicon glyphicon-remove"
                        onClick={this.handleClick}
                        style={{cursor: "pointer"}}></span>
                </p>
                <form className="form-horizontal" name="userForm" noValidate>
                    <Input
                        handleChange={this.handleChange}
                        htmlFor="inputEmail3"
                        type="email"
                        id="inputEmail3"/>
                    <Input
                        handleChange={this.handleChange}
                        htmlFor="inputPassword3"
                        type="password"
                        id="inputPassword3"/>
                    <div className="form-group">
                        <div className="col-sm-offset-2 col-sm-10">
                            <div className="checkbox">
                                <label>
                                    <input type="checkbox" onChange={this.handleChange}/>
                                    Remember me
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="col-sm-offset-2 col-sm-10">
                            <button
                                type="button"
                                id="sent"
                                className="btn btn-default"
                                onClick={this.handleClick}>Sent
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}