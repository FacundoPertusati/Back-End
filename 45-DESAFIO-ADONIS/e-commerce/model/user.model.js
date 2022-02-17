import mongoose from "mongoose"
import bCrypt from "bcrypt"

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


User.pre('save', async function(next){
    const hash = await bCrypt.hash(this.password, 10)
    this.password = hash
    next()
})

User.methods.isValidPassword = async function(password){
    const user = this;
    const compare = await bCrypt.compare(password, user.password)
    return compare
}


export default mongoose.model('User', User)
