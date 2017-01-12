var expect = require("chai").expect;
var request = require("request");
var temp;

describe("Todo lists", function () {

    describe("authentication", function () {

        var url = "http://localhost:3000/api/auth";
        var data = 'SkUme3X3';

        it("returns status 200 when ok", function (done) {
            request.post({
                url: url,
                form: {
                    email: 'example@example.org',
                    password: 'example'
                }
            }, function (error, response, body) {
                expect(response.statusCode).to.equal(200);
                done();
            });
        });

        it("returns user id", function (done) {
            request.post({
                url: url,
                form: {
                    email: 'example@example.org',
                    password: 'example'
                }
            }, function (error, response, body) {
                expect(body).to.equal(data);
                done();
            });
        });
        
        it("returns status 401 when user passes wrong data", function (done) {
            request.post({
                url: url,
                form: {
                    email: 'wrong@wrong.org',
                    password: 'wrong'
                }
            }, function (error, response, body) {
                expect(response.statusCode).to.equal(401);
                done();
            });
        });

    });

    describe("newuser", function () {

        var url = "http://localhost:3000/api/newuser";
        var data = 'SkUme3X3';
        
        it("returns status 403 when user already exists", function (done) {
            request.post({
                url: url,
                form: {
                    email: 'example@example.org',
                    password: 'example'
                }
            }, function (error, response, body) {
                expect(response.statusCode).to.equal(403);
                done();
            });
        });

        it("returns status 200 when ok", function (done) {
            request.post({
                url: url,
                form: {
                    email: 'first@first.org',
                    password: 'first'
                }
            }, function (error, response, body) {
                temp = body;
                expect(response.statusCode).to.equal(200);
                done();
            });
        });

    });
    
});
