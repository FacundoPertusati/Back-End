const conectarMaria = require('../controllers/mariadb')
const knex = require('knex')(conectarMaria)

class Mariadb {
    
    connectDB() {
        knex.schema.hasTable("productos").then(exist => {
            if(!exist) {
          
              return knex.schema.createTable('productos', (table)=> {
                table.increments("id").primary();
                table.datetime("date", { precision: 6 }).defaultTo(knex.fn.now(6));
                table.string("name", 100).notNullable();
                table.string("description", 250);
                table.integer("code").notNullable();
                table.string("picture", 255);
                table.integer("price").notNullable();
                table.integer("stock").notNullable();
            }).then (
                (console.log('tabla creada'),
            
            
                (err) => console.log(err),
                () => knex.destroy())
            )
            }
          })
          knex.schema.hasTable("carrito").then(exist => {
            if(!exist) {
          
              return knex.schema.createTable('carrito', (table)=> {
                table.increments("id").primary();
                table.datetime("date", { precision: 6 }).defaultTo(knex.fn.now(6));
            }).then (
                (console.log('tabla creada'),
            
                (err) => console.log(err),
                () => knex.destroy())
              )
            } 
              
            })
          
            knex.schema.hasTable("relprod").then(exist => {
              if(!exist) {
            
                return knex.schema.createTable('relprod', (table)=> {
                  table.integer("idcarrito");
                  table.integer("idproducto");
                  table.integer("qty");
                  table.datetime("date", { precision: 6 }).defaultTo(knex.fn.now(6));
              }).then (
                  (console.log('tabla creada'),
              
            
                (err) => console.log(err),
                () => knex.destroy())
              )
              } 
                
              })  
    }

    show (req, res) {
        try{
            knex("productos").select("*").then((data) => {
            
            if(data.length > 0){
                res.status(200).json(data)
            }else {
        
                res.status(200).json("No existen productos disponibles")
            }
        })
           
        }catch(err) {
            console.error(err)
        }
       
        
    }

    showId(req, res){
    let id =  req.params.id 
   knex('productos').select('*').where({'id': id})
   .then((data) =>  res.status(200).json(data[0]))
     }

    create(admin, req, res) {
        if(admin){
            try{
        
        
                    knex('productos').insert({
                        name: req.query.name,
                        description: req.query.description,
                        code:  parseInt(req.query.code),
                        picture: req.query.picture,
                        price: parseInt(req.query.price), 
                        stock: parseInt(req.query.stock)
                        
                      }).then( id => knex('productos').select('*').where({'id': id[0]}).then((data) =>  res.status(200).json(data[0])))
        
        
            }catch(err){
                res.status(404).json(err)
            }
        }else{
                res.status(200).json("Error no tienes permisos para agregar productos")
            }
        
   }

    update(admin, req, res) {
        if(admin){
            try{
                let id = parseInt(req.params.id)
             knex('productos').where({id: id}).update(req.query)
             .then((data) =>  res.status(200).json(data[0]))
          }catch(err)
          {
             console.error(err)
          }
      }
      else{
        res.status(200).json("Error no tienes permisos para actualizar productos")
    }
    
    console.log(req.query)
    res.json("updated")
    
        
    }
    delete(admin, req, res) {
        
        if(admin){
            try{
                let id = parseInt(req.params.id)
                        
                   knex("productos").select("*").where({"id":id}).then(data => {
                       if(data.length > 0){
                           knex('productos')
                           .where({ id: id})
                           .del().then(() =>  res.status(200).json("Producto eliminado con éxito"))
                       } else {
                           res.status(200).json({msg: "El producto con el id " + id + " no existe"})
                       }
                   })
              
            }catch(err){
                console.error(err)
                res.status(400).json("Ha ocurrido un error")
            }
    
    }else{
        res.status(200).json("Error no tienes permisos para eliminar productos")
    }
    
    }

    // CARRITOS METHODS

    showCarrito(req, res) {

        knex("carrito").select("*").then(carrito => {
            knex('relprod').join("productos", "relprod.idproducto", "=", "productos.id").select("productos.id", "relprod.date", "relprod.qty", "productos.name", "productos.description", "productos.code", "productos.picture", "productos.price" ).then(data => {
                
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

    createCarrito(req, res) {
        knex('carrito').select("*").then(data => {
            if (data.length == 0) {
             knex('carrito').insert({
                 date: new Date()
                 
               }).then( id => knex('productos').select('*').where({'id': id[0]}).then((data) =>  console.log("carrito 1 creado")))
     
            }
         })
    }

    addCarrito(req, res) {
        let id = req.params.id_producto        

            knex("carrito").then(carrito => {
                knex("productos").select("id").where("id", "=", id).then(data => {

                    if(data.length> 0){

                        knex("relprod").select("idproducto").where("idproducto", "=", id).then(data => {
                    
                            if (data.length > 0) {
            
                                knex('relprod').where({idproducto: id}).increment({"qty": 1}).then(_ => console.log("Producto carrito cant actualizada"))
                                knex('relprod').select('*').where("idproducto", "=", id).then(_ => {
                                    
                                    knex('relprod').join("productos", "relprod.idproducto", "=", "productos.id").select("productos.id", "relprod.date", "relprod.qty", "productos.name", "productos.description", "productos.code", "productos.picture", "productos.price" ).where({"productos.id": id}).then(data => {
                                        
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

                                    knex('relprod').join("productos", "relprod.idproducto", "=", "productos.id").select("productos.id", "relprod.date", "relprod.qty", "productos.name", "productos.description", "productos.code", "productos.picture", "productos.price" ).where({"productos.id": id}).then(data => {
                                        
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
    }

    deleteItem (req, res) {
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
    
    }
}


module.exports = Mariadb