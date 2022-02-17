import User from "../model/user.model.js";
import bCrypt from "bcrypt"


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

// const createHash = function (password) {
//     return bCrypt.hashSync(password, bCrypt.genSaltSync(10),null)
// }

// const isValidPassword = function(user, password) {
//     return bCrypt.compareSync(password, user.password) 
//     }


// async function userExist(email){
//     try{
//         const query = await User.find({email: email})
    
//         if(query.length > 0) return true
//         else return false
    
//     }catch(err){
//         console.error(err)
//     }
// }

// export async function create(data) {
//     try{
//         const exist = await userExist(data.email)
//         if(exist){
//             return false
//         } else {
//             const newUser = new User(data)
//             return await newUser.save()
//         }
//     }catch(err){
//         console.error(err)
//     }
// }