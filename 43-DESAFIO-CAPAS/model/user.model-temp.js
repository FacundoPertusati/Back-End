import mongoose from "mongoose"


const User = new mongoose.Schema({
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
    name:{
        type: String,
        required: true
    },
    lastname:{
        type: String,
        required: true
    },
    address: {
        type: String,
        required: false
    },
    telephone: {
        type: Number,
        required: false
    }
})



export default mongoose.model('User', User)
