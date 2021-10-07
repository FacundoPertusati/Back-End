const productos = require('../rutas/productos.rutas')
class Producto {
    constructor(id, name, description, code, picture, price, stock){
        this.id = id
        this.date = new Date()
        this.qty = 1
        this.name = name
        this.description = description
        this.code = code
        this.picture = picture
        this.price = price
        this.stock = stock
    }
}
module.exports= Producto;