import React, {Component} from 'react';
import Dragula from 'react-dragula';
import './Lists.css';
import './dragula.css'

// Contains List`s components, dragged by Dragula library

class TextField extends Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.value = this.props.taskTitle;
    }

    handleChange(e) {
        this.value = e.target.value;
    }

    handleClick() {
        var url = '';
        if (this.props.id === 'taskline') {
            url = `project/${this.props.itemId.projectId}/task/${this.props.itemId.taskId}`;
        } else if (this.props.id === 'projtitle') 
            url = `project/${this.props.itemId}`;
        this.props.handleState('regular');
        this.props.sendQuery(url, {
                method: 'PATCH',
                contentType: 'application/json; charset=UTF-8',
                body: JSON.stringify({title: this.value})
            });
    }

    render() {
        if (this.props.txtfield === 'regular') {
            return (
                <p id={this.props.id}>{this.props.title}</p>
            );
        } else if (this.props.txtfield === 'edit') {
            return (
                <div className="input-group" id="upd">
                    <input
                        type="text"
                        className="form-control"
                        placeholder={this.props.title}
                        id="updInputTs"
                        onChange={this.handleChange}/>
                    <span className="input-group-btn">
                        <button className="btn btn-default" type="button" onClick={this.handleClick}>Apply</button>
                    </span>
                </div>
            );
        }
    }
}

class AddTask extends Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.value = '';
    }

    handleChange(e) {
        this.value = e.target.value;
    }

    handleClick() {
        this.props.sendQuery(`project/${this.props.projectId}/task`, {
                method: 'put',
                contentType: 'application/json; charset=UTF-8',
                body: JSON.stringify({title: this.value})
            });
    }

    render() {
        return (
            <div id="add-task" className="panel-body" name="project">
                <div className="input-group">
                    <span className="input-group-addon">
                        <span className="glyphicon glyphicon-plus"></span>
                    </span>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Start typing here to create a task..."
                        onChange={this.handleChange}/>
                    <span className="input-group-btn">
                        <button className="btn btn-secondary" type="button" onClick={this.handleClick}>Add task</button>
                    </span>
                </div>
            </div>
        );
    }
}

class Heading extends Component {
    constructor(props) {
        super(props);
        this.state = {
            txtState: 'regular'
        }

        this.handleClick = this.handleClick.bind(this);
        this.handleState = this.handleState.bind(this);
    }

    handleClick(e) {
        switch (e.target.id) {
            case('delete-project'):
                this.props.sendQuery(`project/${this.props.projectId}`, {
                        method: 'delete',
                        body: null
                    });
                break;
            case('edit-project'):
                this.handleState('edit');
                break;
            default:
                break;
        }
    }

    handleState(value) {
        this.setState({txtState: value});
        console.log(this.state);
    }

    render() {
        return (
            <div className="panel-heading handle" name="project">
                <img id="calendar" src="icons/calend.png" alt="calendar"/>
                <TextField
                    id={"projtitle"}
                    title={this.props.projectTitle}
                    itemId={this.props.projectId}
                    sendQuery={this.props.sendQuery}
                    txtfield={this.state.txtState}
                    handleState={this.handleState}/>
                <div id="projevent">
                    <img
                        id="delete-project"
                        src="icons/trash.png"
                        alt="delete"
                        onClick={this.handleClick}/>
                    <img id="icon" src="icons/separator.png" alt="separate"/>
                    <img
                        id="edit-project"
                        src="icons/pen.png"
                        alt="edit"
                        onClick={this.handleClick}/>
                </div>
            </div>
        );
    }
}

class Checkbox extends Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        var url = `project/${this.props.projectId}/task/${this.props.taskId}/`
        if (this.props.status === 'done') {
            url += 'undone';
        } else if (this.props.status === 'undone') 
            url += 'done';
        this.props.sendQuery(url, {
                method: "PATCH",
                body: null
            });
    }

    render() {
        if (this.props.status === 'done') {
            return (<input
                id="mark"
                type="checkbox"
                name="mark"
                checked
                onChange={this.handleChange}/>);
        } else 
            return (<input id="mark" type="checkbox" name="mark" onChange={this.handleChange}/>);
        }
    }

class TaskField extends Component {
    constructor(props) {
        super(props);
        this.state = {
            txtState: 'regular'
        }

        this.handleClick = this.handleClick.bind(this);
        this.handleState = this.handleState.bind(this);
    }

    handleClick(e) {
        switch (e.target.alt) {
            case('trash'):
                this.props.sendQuery(`project/${this.props.projectId}/task/${this.props.taskId}`, {
                        method: 'delete',
                        body: null
                    });
                break;
            case('edit'):
                this.handleState('edit');
                break;
            default:
                break;
        }
    }

    handleState(value) {
        this.setState({txtState: value});
    }

    render() {
        return (
            <div id="taskfield" className="handle-task">
                <Checkbox
                    status={this.props.status}
                    taskId={this.props.taskId}
                    projectId={this.props.projectId}
                    sendQuery={this.props.sendQuery}/>
                <TextField
                    id={"taskline"}
                    title={this.props.taskTitle}
                    itemId={{
                    projectId: this.props.projectId,
                    taskId: this.props.taskId
                }}
                    sendQuery={this.props.sendQuery}
                    txtfield={this.state.txtState}
                    handleState={this.handleState}/>
                <div id="choose">
                    <img
                        id="icon"
                        src="icons/trash.png"
                        style={{cursor: "pointer"}}
                        alt="trash"
                        onClick={this.handleClick}/>
                    <img id="icon" src="icons/separator.png" alt="separate"/>
                    <img
                        id="icon"
                        src="icons/pen.png"
                        style={{cursor: "pointer"}}
                        alt="edit"
                        onClick={this.handleClick}/>
                    <img id="icon" src="icons/separator.png" alt="separate"/>
                    <img id="icon" src="icons/Resize%20Vertical-48.png" alt="resize"/>
                </div>
            </div>
        );
    }

}

export default class Lists extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: ''
        }

        this.sendQuery = this.sendQuery.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.data = [];
    }

    handleClick(e) {
        switch (e.target.id) {
            case('addtodo'):
                this.sendQuery('project', {
                    method: "put",
                    body: null
                });
                this.props.onClick('data');
                break;
            case('logout'):
                this.props.onClick('intro');
                break;
            default:
                break;
        }
    }

    sendQuery(url, options) {
        var newurl = url;
        if (options.method !== 'post') 
            newurl = `/api/user/${this.data[0].user_id}/${url}`;
        console.log(newurl);
        var xhr = new XMLHttpRequest();
        console.log(options);
        console.log(options.contentType);
        xhr.open(options.method, newurl, false);
        if (options.body === null) {
            xhr.send(null);
        } else {
            xhr.setRequestHeader("Content-Type", options.contentType);
            xhr.send(options.body);
            console.log(xhr.responseText);
            if (xhr.status === 200) {
                console.log(xhr.responseText);
                if (newurl === '/api/auth') {
                    this.data = JSON.parse(xhr.responseText);
                }
            }
        }
        if (xhr.status === 200) {
            if (newurl !== '/api/auth') {
                if (this.state.value === newurl) {
                    this.setState({value: `${newurl}-1`});
                } else 
                    this.setState({value: newurl});
                }
            } else 
            alert(xhr.responseText);
        }
    
    dragulaDecorator = (componentBackingInstance) => {
        if (componentBackingInstance) {
            let options = {
                moves: (el, container, handle) => {
                    console.log(el.children);
                    if (el.children[0].id === 'taskfield') {
                        return handle.classList
                            .contains('handle-task');
                    } else 
                        return handle.classList
                            .contains('handle');
                    }
                };
            Dragula([componentBackingInstance], options).on('drop', (el, target) => {
                var index = 0;
                for (var i = 0; i < target.children.length; ++i) {
                    if (target.children[i].children[1].id === el.children[1].id) 
                        index = i;
                    }
                var url = '';
                if (el.children[0].id === 'taskfield') {
                    url = `project/${el.children[2].id}/task/${el.children[1].id}/${index}`;
                } else 
                    url = `project/${el.children[1].id}/${index}`;
                this.sendQuery(url, {
                    method: 'PATCH',
                    body: null
                });
            });
        }
    };

    render() {
        this.sendQuery('/api/auth', {
            method: 'post',
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
            body: `login=${this
                .props
                .storage
                .getItem('login')}&password=${this
                .props
                .storage
                .getItem('password')}`
        });
        var tasks = [];
        var projects = this.data[0].projects.map((project) => {
                tasks = project.tasks.map((task) => {
                        return (
                            <li key={task.id} className="panel-body">
                                <TaskField
                                    sendQuery={this.sendQuery}
                                    taskId={task.id}
                                    taskTitle={task.title}
                                    projectId={project.id}
                                    status={task.status}/>
                                <div id={task.id}></div>
                                <div id={project.id}></div>
                            </li>
                        );
                    });
                return (
                    <li key={project.id} className="panel panel-default">
                        <Heading
                            sendQuery={this.sendQuery}
                            projectTitle={project.title}
                            projectId={project.id}/>
                        <div id={project.id}></div>
                        <AddTask sendQuery={this.sendQuery} projectId={project.id}/>
                        <ul
                            id="tasks"
                            className="container gu-unselectable"
                            ref={this.dragulaDecorator}>
                            {tasks}
                        </ul>
                    </li>
                );
            });
        return (
            <div>
                <div>
                    <div className="row">
                        <ul className="container gu-unselectable" ref={this.dragulaDecorator}>
                            {projects}
                        </ul>
                    </div>
                    <div className="row">
                        <div className="col-md-5"></div>
                        <div className="col-md-2 centered-row">
                            <button
                                type="button"
                                className="btn btn-default btn-lg"
                                id="addtodo"
                                onClick={this.handleClick}>
                                <span className="glyphicon glyphicon-plus"></span>
                                <b id="addtodo">Add TODO List</b>
                            </button>
                        </div>
                        <div className="col-md-5"></div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="dropdown" id="menu">
                        <button
                            className="btn btn-default dropdown-toggle"
                            type="button"
                            data-toggle="dropdown">
                            <span className="glyphicon glyphicon-cog"></span>
                            <span className="caret"></span>
                        </button>
                        <ul className="dropdown-menu">
                            <li className="dropdown-header">Menu</li>
                            <li>
                                <a
                                    id="logout"
                                    onClick={this.handleClick}
                                    style={{cursor: "pointer"}}>Logout</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}
