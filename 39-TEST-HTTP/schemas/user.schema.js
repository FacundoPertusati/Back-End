const {Schema, model } = require("mongoose")


const User = new Schema({
    date: {
        type: Date,
        default: Date.now
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: false
    },
    age: {
        type: Number,
        required: false
    },
    prefix: {
        type: String,
        required: false
    },
    telephone: {
        type: Number,
        required: false
    },
    avatar: {
        type: String,
        required: false
    }
})



module.exports  = model('user', User)



