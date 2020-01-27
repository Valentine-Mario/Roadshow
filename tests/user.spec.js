var expect = require('chai').expect;
const app=require('../app')
var request = require('supertest');


describe('#()login', ()=>{
    it('should return a token', (done)=>{
        request(app)
        .post('/user/login')
        .set("Content-Type", "application/json")
        .send({
            email:'name1@gmail.com',
            password:'123456'
        })
        .end((err, res)=>{
            if (err) done(err);
            expect(res.statusCode).to.equal(200)
            expect(res.body).to.have.property('token');
        })
         done();
    })
    
})