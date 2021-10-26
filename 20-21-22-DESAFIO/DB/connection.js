const mongoose = require("mongoose")

const connectionDatabase = async () => {
    try{
        await mongoose.connect("mongodb+srv://coladmin:mosorio12@cluster0.kduye.mongodb.net/desafio20?retryWrites=true&w=majority",
         {
             useNewUrlParser: true,
             useUnifiedTopology: true
         }
     );
     console.log('Database connected')

    }
    catch(error){
        throw new Error(error)
    }
}

module.exports = connectionDatabase