const {Schema, model} = require("mongoose")


const carritoSchema = new Schema({
    date: {
        type: Date,
        default: Date.now
    },
    productos: {
        items: []
    }
})

module.exports  = model('carrito', carritoSchema)
