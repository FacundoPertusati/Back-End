import express from 'express'
import { administrador } from '../server.js'

export const router = express.Router()

export let productos = {
    items: []
}
import Producto from '../classes/producto.class.js'

const removeItemFromArr = ( arr, item ) => {
    var i = arr.indexOf( item );
    i !== -1 && arr.splice( i, 1 );
};


router.use(express.json());
router.use(express.urlencoded({ extended: true }));


 productos.items.push(new Producto (productos.items.length+1, "Café", "molido origen quindio", 1420, "https://cdn3.iconfinder.com/data/icons/business-avatar-1/512/3_avatar-512.png", 4500, 35 ))
 productos.items.push(new Producto (productos.items.length+1, "Café arguello", "molido origen quindio", 1420, "https://cdn3.iconfinder.com/data/icons/business-avatar-1/512/3_avatar-512.png", 4500, 35 ))

router.get("/", (req, res) => {
    try{
        if(productos.items.length > 0){
            res.status(200).json(productos)
        }else{
            res.status(404).json({"error": "No existen productos disponibles"})
        }
    }catch(err) {
        res.status(404).json({err})
    }

})

router.get("/:id", (req, res) => {
    try{
        if (req.params.id <= (productos.items.length)) {
            res.status(200).json(productos.items[req.params.id-1])
        } else {
            res.status(404).json({"error": "Producto no encontrado"})
        }
    }catch(err) {
        res.status(404).json({err})
    }
})

router.post("/", (req, res) => {
   //id, date, name, description, code, picture, price, stock
   if (administrador){
    try{
        productos.items.push(new Producto (productos.items.length+1,
                req.query.name,
                req.query.description, 
                parseInt(req.query.code), 
                req.query.picture, 
                parseInt(req.query.price),
                parseInt(req.query.stock)
                ))
        res.status(200).json(productos.items[productos.items.length-1])
    }catch(err){
        res.status(404).json(err)
    }

   }else {
       res.status(200).json({"error": "No tiene privilegios para agregar productos"})
   }
    
})


router.put("/:id", (req, res) => {

    if(administrador) {
        try {
            let id = parseInt(req.params.id)
            productos.items[id-1] = {
                "id": parseInt(id),
                "date": new Date(),
                "name": req.query.name,
                "description": req.query.description,
                "code": parseInt(req.query.code),
                "picture": req.query.picture,
                "price": parseInt(req.query.price),
                "stock": parseInt(req.query.stock),
            }
            res.json(productos.items[id-1])
        } catch(err){
            throw new Error(err)
        }

    }else {
        res.status(200).json({"error": "No tiene privilegios para actualizar productos"})
    }

})

router.delete("/:id", (req, res) => {
    if (administrador) {
        try {

            let id = parseInt(req.params.id)
    
                if(id-1 < productos.items.length){
                    res.status(200).json("producto eliminado")
                    removeItemFromArr(productos.items, productos.items[id-1])
                } else {
                    res.status(200).json({"msg":"No hay productos"})
                }
        
        }catch(err) {
            throw new Error(err)
        }

    } else {
        res.status(200).json({"error": "No tiene privilegios para borrar productos"})
    }
   
})

export default productos