import express from 'express'
import Carrito from '../classes/carrito.class.js'
import productos from './productos.route.js'

export const routerCarritos = express.Router()

export let carritos = [new Carrito()]



const removeItemFromArr = ( arr, item ) => {
    var i = arr.indexOf( item );
    i !== -1 && arr.splice( i, 1 );
};


routerCarritos.use(express.json());
routerCarritos.use(express.urlencoded({ extended: true }));



routerCarritos.get("/", (req, res) => {
    try{
        
            res.status(200).json(carritos)
     
    }catch(err) {
        res.status(404).json({err})
    }

})


routerCarritos.post("/:id_producto", (req, res) => {

    let id_producto = parseInt(req.params.id_producto)

    if (productos.items.filter(element => element.id == id_producto).length > 0) {

        let prodSelect = productos.items[id_producto-1]
        let prodUser = JSON.parse( JSON.stringify( prodSelect ) );
        
        
        if (carritos[0].productos.items.filter(element => element.id === id_producto).length > 0) {
            
           carritos[0].productos.items.filter(element => element.id === id_producto).map(obj => obj.qty = obj.qty + 1)
            
        }else{
        
            carritos[0].productos.items.push(prodUser)
            }
        
            res.status(200).json(carritos)
            
    } else {
        let msg = "El producto no existe en la DB"
        console.log(msg)
        res.status(200).json(msg)
    }

   
})


routerCarritos.delete("/:id_producto", (req, res) => {
    
    
    try {

        
        let id_producto = parseInt(req.params.id_producto)

        if(id_producto-1 < carritos[0].productos.items.length){

                    let elemento = carritos[0].productos.items.filter(element => element.id === id_producto)
                    let indice = carritos[0].productos.items.indexOf(elemento[0])
            
                    removeItemFromArr(carritos[0].productos.items, carritos[0].productos.items[indice])

                    res.status(200).json(carritos[0])


                } else {
                    res.status(200).json({"msg":"No existen productos en el carrito"})
                }
        
        }catch(err) {
            throw new Error(err)
        }

})
 


export default Carrito