import mongoose from "mongoose"


const Product = new mongoose.Schema({

    date: {
        type: Date,
        default: Date.now
    },
    description: {
        type: String,
        required: true
    },

    picture: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    qty: {
        type: Number,
        required: true,
        default: 1
    }

})

export default mongoose.model('Product', Product)