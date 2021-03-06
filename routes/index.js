var express = require('express');
var router = express.Router();
var shortid = require('shortid');
var MongoClient = require('mongodb').MongoClient;
var EventEmitter = require("events").EventEmitter;
var url = 'mongodb://windsurf:windsurf@ds011382.mlab.com:11382/heroku_g0qgkz31';

router.get('/', (req, res, next) => {
    res.sendFile('index.html', {root: __dirname});
});

// Contains main CRUD events for lists

router.post('/api/auth', (req, res) => {
    var data = [];
    MongoClient.connect(url, (err, db) => {
        var collection = db.collection('users');
        var projectsCl = db.collection('projects');
        collection
            .find({email: req.body.login, password: req.body.password})
            .toArray((err, docs) => {
            console.log(docs[0] === undefined);
            if (docs[0] === undefined) {
                db.close();
                res.status(401).end('A pair of username and password is not found.');
            } else {
                projectsCl
                    .find({user_id: docs[0].user_id})
                    .toArray((errmsg, subDocs) => {
                        data = [
                            {
                                user_id: docs[0].user_id,
                                projects: subDocs
                            }
                        ];
                        db.close();
                        res.end(JSON.stringify(data));
                    });
            }
            });
    });
});

router.post('/api/newuser', (req, res) => {
    MongoClient.connect(url, (err, db) => {
        var collection = db.collection('users');
        collection.insertOne({
            user_id: shortid.generate(),
            email: req.body.login,
            password: req.body.password
        }, (err, result) => {
            console.log(result.insertedCount);
            console.log(err);
            db.close();
            res.end();
        });
    });
});

router.put('/api/user/:uid/project', (req, res) => {
    MongoClient.connect(url, (err, db) => {
        var collection = db.collection('projects');
        collection.insertOne({
            user_id: req.params.uid,
            id: shortid.generate(),
            title: req.body.title,
            tasks: []
        }, (err, result) => {
            console.log(result.insertedCount);
            console.log(err);
            db.close();
            res.end();
        });
    });
});

router.put('/api/user/:uid/project/:pid/task', (req, res) => {
    MongoClient.connect(url, (err, db) => {
        var collection = db.collection('projects');
        collection.update({
            user_id: req.params.uid,
            id: req.params.pid
        }, {
            $push: {
                tasks: {
                    id: shortid.generate(),
                    title: req.body.title,
                    status: 'undone'
                }
            }
        }, (err, result) => {
            console.log(result.matchedCount);
            console.log(result.insertedCount);
            console.log(err);
            db.close();
            res.end();
        });
    });
});

router.delete('/api/user/:uid/project/:pid', (req, res) => {
    MongoClient.connect(url, (err, db) => {
        var collection = db.collection('projects');
        collection.deleteOne({
            user_id: req.params.uid,
            id: req.params.pid
        }, (err, result) => {
            console.log(err);
            console.log(result.deletedCount);
            db.close();
            res.end();
        });
    });
});

router.delete('/api/user/:uid/project/:pid/task/:tid', (req, res) => {
    MongoClient.connect(url, (err, db) => {
        var collection = db.collection('projects');
        collection.update({
            user_id: req.params.uid,
            id: req.params.pid
        }, {
            $pull: {
                tasks: {
                    id: req.params.tid
                }
            }
        }, (err, result) => {
            console.log(err);
            console.log(result.deletedCount);
            db.close();
            res.end();
        });
    });
});

router.patch('/api/user/:uid/project/:pid', (req, res) => {
    console.log(req.uid);
    MongoClient.connect(url, (err, db) => {
        var collection = db.collection('projects');
        collection.update({
            user_id: req.params.uid,
            id: req.params.pid
        }, {
            $set: {
                title: req.body.title
            }
        }, (err, result) => {
            console.log(err);
            console.log(result.matchedCount);
            db.close();
            res.end();
        });
    });
});

router.patch('/api/user/:uid/project/:pid/task/:tid', (req, res) => {
    MongoClient.connect(url, (err, db) => {
        var collection = db.collection('projects');
        collection.update({
            user_id: req.params.uid,
            id: req.params.pid,
            "tasks.id": req.params.tid
        }, {
            $set: {
                "tasks.$.title": req.body.title
            }
        }, (err, result) => {
            console.log(err);
            console.log(result.matchedCount);
            db.close();
            res.end();
        });
    });
});

router.patch('/api/user/:uid/project/:pid/:index', (req, res) => { // D&D handler for projects
    MongoClient.connect(url, (err, db) => {
        var collection = db.collection('projects');
        var elem = {};
        var arr = [];
        var ee = new EventEmitter();
        ee.on('delete&insert', (arr) => {
            collection.deleteMany({
                user_id: req.params.uid,
            }, (errmsg, result) => {
                collection.insertMany(arr, (errm, reslt) => {
                    console.log(errm);
                    console.log(reslt.insertedCount);
                    db.close();
                    res.end();
                });
            });
        });
        ee.on('find', () => {
            collection.find({user_id: req.params.uid})
            .toArray((err, docs) => {
                arr = docs;
                arr.forEach((el, i) => {                 // finds project`s id
                    if (el.id === req.params.pid) {       // and
                        elem = arr[i];                   // ...
                        arr.splice(i, 1);                // remove that from arr
                    }
                });                                      // then put removed project to the arr again
                arr.splice(req.params.index, 0, elem);   // but on the specified position
                ee.emit('delete&insert', arr);
            });
        });
        ee.emit('find');  
    });
});

router.patch('/api/user/:uid/project/:pid/task/:tid/:index', (req, res) => {     // do the same as previous endpoint handler
    MongoClient.connect(url, (err, db) => {                                      // but it manipulate with task`s data
        var collection = db.collection('projects');
        var index = 0;
        var ee = new EventEmitter();
        ee.on('putInNewPosition', (docs) => {
            collection.update({ user_id: req.params.uid, id: req.params.pid },
                              { $push: { tasks: { $each: [ docs[0].tasks[index] ],
                                $position: parseInt(req.params.index) } } },
                              (errmg, reslt) => {
                console.log(errmg);
                console.log(reslt.matchedCount);
                db.close();
                res.end();
            });
        });
        ee.on('removeTask', (docs) => {
            collection.update({ user_id: req.params.uid, id: req.params.pid }, 
                              { $pull: { tasks: { $elemMatch: { id: req.params.tid } } } },
                              (errmsg, result) => {
                docs[0].tasks.forEach((el, i, arr) => {
                    if (el.id === req.params.tid) index = i;
                });
                ee.emit('putInNewPosition', docs);
            });
        });
        ee.on('find', () => {
            collection.find({user_id: req.params.uid, id: req.params.pid, 
                            "tasks.id": req.params.tid})
            .toArray((err, docs) => {
                ee.emit('removeTask', docs);
            });
        });
        ee.emit('find');
    });
});

router.patch('/api/user/:uid/project/:pid/task/:tid/status/:status', (req, res) => {
    MongoClient.connect(url, (err, db) => {
        var collection = db.collection('projects');
        collection.update({
            user_id: req.params.uid,
            id: req.params.pid,
            "tasks.id": req.params.tid
        }, {
            $set: {
                "tasks.$.status": req.params.status
            }
        }, (err, result) => {
            console.log(err);
            console.log(result.matchedCount);
            db.close();
            res.end();
        });
    });
});

module.exports = router;
