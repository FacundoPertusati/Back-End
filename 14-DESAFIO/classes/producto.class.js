import productos from '../routes/productos.route.js';


export class Producto {
    constructor (id, name, description, code, picture, price, stock) {
        this.id = id
        this.date = new Date()
        this.name = name
        this.description = description
        this.code = code
        this.picture = picture
        this.price = price
        this.stock = stock
        this.qty = 1
    }
}

export default Producto
