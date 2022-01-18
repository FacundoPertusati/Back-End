const LocalStrategy = require("passport-local").Strategy
const {Mongo} = require("../db/db")
const db = new Mongo
const bCrypt = require("bcrypt")



function initializePassport(passport) {
    passport.use(new LocalStrategy("login", function(user, password, done){
        if(user =="mateo" && password == "123"){
            return done(null, {user: "mateo", id: 1})
        } else {
            return done(null, false)
        }
    }))
    
 }

module.exports = {initializePassport}