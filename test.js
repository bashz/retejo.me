var app = require('./app');
var request = require('supertest');
var should = require('should');

describe('API', function () {
    describe('#signup', function () {
        it('Should create a new user', function (done) {
            request(app)
                    .post('/api/signup')
                    .set('Accept', 'text/html')
                    .send({
                        username: 'user1',
                        password: 'password',
                        confirmpass: 'password',
                        email: 'user1@domain.com',
                        confirmemail: 'user1@domain.com'
                    })
                    .expect(200)
                    .expect('Content-Type', 'text/html; charset=utf-8')
                    .end(function (err, res) {
                        if (err)
                            return done(err);
                        res.text.should.be.equal('account created successfully, you may now log in');
                        done();
                    });
        });
        it('Should login successfully', function (done) {
            request(app)
                    .post('/api/login')
                    .set('Accept', 'text/html')
                    .send({
                        username: 'user1',
                        password: 'password',
                    })
                    .expect(200)
                    .expect('Content-Type', 'text/html; charset=utf-8')
                    .end(function (err, res) {
                        if (err)
                            return done(err);
                        res.text.should.be.equal('success');
                        done();
                });
        });
        it('Should notify that the username already exists', function (done) {
            request(app)
                    .post('/api/signup')
                    .set('Accept', 'text/html')
                    .send({
                        username: 'user1',
                        password: 'password',
                        confirmpass: 'password',
                        email: 'user2@domain.com',
                        confirmemail: 'user2@domain.com'
                    })
                    .expect(200)
                    .expect('Content-Type', 'text/html; charset=utf-8')
                    .end(function (err, res) {
                        if (err)
                            return done(err);
                        res.text.should.be.equal('this username already exists in our database, please contact support if you need to recover your account');
                        done();
                    });
        });
        it('Should notify that the email already exists', function (done) {
            request(app)
                    .post('/api/signup')
                    .set('Accept', 'text/html')
                    .send({
                        username: 'user2',
                        password: 'password',
                        confirmpass: 'password',
                        email: 'user1@domain.com',
                        confirmemail: 'user1@domain.com'
                    })
                    .expect(200)
                    .expect('Content-Type', 'text/html; charset=utf-8')
                    .end(function (err, res) {
                        if (err)
                            return done(err);
                        res.text.should.be.equal('this email already exists in our database, please contact support if you need to recover your account');
                        done();
                    });
        });
        it('Should notify that the password and password confirmation are not the same', function (done) {
            request(app)
                    .post('/api/signup')
                    .set('Accept', 'text/html')
                    .send({
                        username: 'user3',
                        password: 'passwords',
                        confirmpass: 'password',
                        email: 'user3@domain.com',
                        confirmemail: 'user3@domain.com'
                    })
                    .expect(200)
                    .expect('Content-Type', 'text/html; charset=utf-8')
                    .end(function (err, res) {
                        if (err)
                            return done(err);
                        res.text.should.be.equal('passwords don\'t match');
                        done();
                    });
        });
        it('Should notify that the email and email confirmation are not the same', function (done) {
            request(app)
                    .post('/api/signup')
                    .set('Accept', 'text/html')
                    .send({
                        username: 'user3',
                        password: 'password',
                        confirmpass: 'password',
                        email: 'user3@domain.com',
                        confirmemail: 'user@domain.com'
                    })
                    .expect(200)
                    .expect('Content-Type', 'text/html; charset=utf-8')
                    .end(function (err, res) {
                        if (err)
                            return done(err);
                        res.text.should.be.equal('emails don\'t match');
                        done();
                    });
        });
    });
});
