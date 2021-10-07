const express = require('express')
const router = express.Router()
const {knex} = require('../controllers/serverdb')

router.use(express.json()); 
router.use(express.urlencoded({ extended: true }));  
let admin = true;


router.get("/", (req, res) => {
    try{
        knex("lista").select("*").then((data) => {
        
        if(data > 0){
            
            res.status(200).json(data)
        }else {
            res.status(200).json("No existen productos disponibles")
        }
    })
       
    }catch(err) {
        console.error(err)
    }
   
})
router.get('/vista', (req, res) => {
    
    res.render("index", productos);
})

router.get("/:id", (req, res) => {

   let id =  req.params.id 
   knex('lista').select('*').where({'id': id})
   .then((data) =>  res.status(200).json(data[0]))
})

router.post("/", (req, res) => {
    if(admin){
    try{


            knex('lista').insert({
                name: req.query.name,
                description: req.query.description,
                code:  parseInt(req.query.code),
                picture: req.query.picture,
                price: parseInt(req.query.price), 
                stock: parseInt(req.query.stock)
                
              }).then( id => knex('lista').select('*').where({'id': id[0]}).then((data) =>  res.status(200).json(data[0])))


    }catch(err){
        res.status(404).json(err)
    }
}else{
        res.status(200).json("Error no tienes permisos para agregar productos")
    }
})


router.put("/:id", (req, res) => {
    if(admin){
          try{
              let id = parseInt(req.params.id)
           knex('lista').where({id: id}).update(req.query)
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

})

router.delete("/:id", (req, res) => {
    if(admin){
        try{
            let id = parseInt(req.params.id)
                    
               knex("lista").select("*").where({"id":id}).then(data => {
                   if(data.length > 0){
                       knex('lista')
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
})

    module.exports =[router];