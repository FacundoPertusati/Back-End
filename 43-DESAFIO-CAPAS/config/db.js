import dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.config()


export class DB {
    connectDB() {
        try{
            mongoose.connect(process.env.MONGO_URL,
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

