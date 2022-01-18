const {Schema, model } = require("mongoose")


const User = new Schema({
    date: {
        type: Date,
        default: Date.now
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})



module.exports  = model('user', User)



