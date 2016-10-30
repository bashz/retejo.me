var app = require('./app');
var request = require('supertest');
var should = require('should');

describe('API', function () {
  describe('#signup', function () {
    it('Should create new user', function (done) {
      request(app)
              .post('/api/signup')
              .set('Accept', 'text/html')
              .send({
                username: 'user1',
                password: 'password',
                confirmpass: 'password',
                email: 'user1@domain.tld',
                confirmemail: 'user1@domain.tld'
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
    it('Should notify that username already exist', function (done) {
      request(app)
              .post('/api/signup')
              .set('Accept', 'text/html')
              .send({
                username: 'user1',
                password: 'password',
                confirmpass: 'password',
                email: 'user2@domain.tld',
                confirmemail: 'user2@domain.tld'
              })
              .expect(200)
              .expect('Content-Type', 'text/html; charset=utf-8')
              .end(function (err, res) {
                if (err)
                  return done(err);
                res.text.should.be.equal('this username already exists in our database, please contact team@retejo.me if you need to recover your account');
                done();
              });
    });
    it('Should notify that password and password confirmation are not the same', function (done) {
      request(app)
              .post('/api/signup')
              .set('Accept', 'text/html')
              .send({
                username: 'user3',
                password: 'passwords',
                confirmpass: 'password',
                email: 'user3@domain.tld',
                confirmemail: 'user3@domain.tld'
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
  });
});