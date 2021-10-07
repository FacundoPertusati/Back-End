const express = require('express');
const router = express.Router()
const {knex} = require('../controllers/serverdb')

router.use(express.json());
router.use(express.urlencoded({ extended: true }));




router.get("/", (req, res) => {

    knex("carrito").select("*").then(carrito => {
        knex('relprod').join("lista", "relprod.idproducto", "=", "lista.id").select("lista.id", "relprod.date", "relprod.qty", "lista.name", "lista.description", "lista.code", "lista.picture", "lista.price" ).then(data => {
            
            let elemCarritos = []
            data.forEach(element => {
                   let item = {
                       id_carrito: carrito[0].id,
                       date_carrito: carrito[0].date,
                       productos: {
                           ...element
                       }
                    }
                    elemCarritos.push(item)
                });
                res.status(200).json(elemCarritos)
            })
    })

    })
 
router.post("/:id_producto", (req, res) => {
            let id = req.params.id_producto

            knex("carrito").then(carrito => {
                knex("lista").select("id").where("id", "=", id).then(data => {

                    if(data.length> 0){

                        knex("relprod").select("idproducto").where("idproducto", "=", id).then(data => {
                    
                            if (data.length > 0) {
            
                                knex('relprod').where({idproducto: id}).increment({"qty": 1}).then(_ => console.log("Producto carrito cant actualizada"))
                                knex('relprod').select('*').where("idproducto", "=", id).then(_ => {
                                    
                                    knex('relprod').join("lista", "relprod.idproducto", "=", "lista.id").select("lista.id", "relprod.date", "relprod.qty", "lista.name", "lista.description", "lista.code", "lista.picture", "lista.price" ).where({"lista.id": id}).then(data => {
                                        
                                        let elemCarritos = []
                                            data.forEach(element => {
                                                let item = {
                                                    id_carrito: carrito[0].id,
                                                    date_carrito: carrito[0].date,
                                                    productos: {
                                                        ...element
                                                    }
                                                    }
                                                    elemCarritos.push(item)
                                                });
                                                res.status(200).json(elemCarritos)
                                    })
            
                                } )
                                
                            } else {
                                knex("relprod").insert({idcarrito: 1, idproducto: id, qty: 1}).then( _ => {
                                    console.log("producto agregado al carrito")

                                    knex('relprod').join("lista", "relprod.idproducto", "=", "lista.id").select("lista.id", "relprod.date", "relprod.qty", "lista.name", "lista.description", "lista.code", "lista.picture", "lista.price" ).where({"lista.id": id}).then(data => {
                                        
                                        let elemCarritos = []
                                            data.forEach(element => {
                                                let item = {
                                                    id_carrito: carrito[0].id,
                                                    date_carrito: carrito[0].date,
                                                    productos: {
                                                        ...element
                                                    }
                                                    }
                                                    elemCarritos.push(item)
                                                });
                                                res.status(200).json(elemCarritos)
                                    })
                                
                                
                                })
                                    
                            }
            
            
                        })


                    } else {
                            res.status(200).json("El producto que intenta agregar no existe")
                        }
                  })      

            })

 })
    
    
    // SELECT * FROM ((relprod INNER JOIN lista ON idproducto = lista.id) INNER JOIN carrito ON idcarrito = carrito.id);

router.delete("/:id_producto", (req, res) => {

    try{
        let id = parseInt(req.params.id_producto)
                
           knex("relprod").select("*").where("idproducto", "=", id).then(data => {
               if(data.length > 0){
                   knex('relprod')
                   .where("idproducto", "=", id)
                   .del().then(() =>  res.status(200).json("Producto eliminado del carrito con éxito"))
               } else {
                   res.status(200).json({msg: "El producto con el id " + id + " no existe en el carrito"})
               }
           })
      
    }catch(err){
        console.error(err)
        res.status(400).json("Ha ocurrido un error")
    }

   
})

module.exports = [router];