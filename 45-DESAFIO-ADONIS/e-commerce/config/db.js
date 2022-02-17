import dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.config()


export class DB {
    connectDB() {
        try{
            mongoose.connect("mongodb+srv://coladmin:mosorio12@cluster0.kduye.mongodb.net/ecommerce?retryWrites=true&w=majority",
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
}

