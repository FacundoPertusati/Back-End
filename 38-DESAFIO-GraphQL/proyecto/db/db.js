require('dotenv').config()

const userSchema = require("../schemas/user.schema")
const carritoSchema = require("../schemas/carrito.schema")
const productSchema = require("../schemas/products.schema")

const bCrypt = require("bcrypt") // for encryript passwords

const createHash = function (password) {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10),null)
}

const isValidPassword = function(user, password) {
    return bCrypt.compareSync(password, user.password) 
    }
    

   


const mongoose = require("mongoose")


class Mongo {
    
    connectDB() {

        console.log("soy atlas")
    
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


    async findUser(req){
        const userSaved = await userSchema.findOne({user: req.body.user})

        return userSaved
         

        // if(userSaved) {
        //     res.redirect("/vista")
        // }else{
        //     res.redirect("/password-invalid")       
        // }
    }

    async createUser(req, res) {
        const userExist = await userSchema.findOne({user: req.body.user})
       
        if(!userExist){
        
            try{
                
                let user = { 
                    user: req.body.user,
                    password: createHash(req.body.password)
                    }
            const newUser = new userSchema(user)
            res.status(200).json(await newUser.save())
    
        }catch(err){
            res.status(404).json(err)
        }
    }else{
            res.status(200).json("El usuario que intentas crear ya existe")
        }
    }

    async showList () {
        try{
            const prodsSave = await productSchema.find()
            if (prodsSave.length > 0){
                return prodsSave
            }
            else {
                return {message: "No existen productos todavía"}
            }
           
        }catch(err) {
            console.error(err)
        }
        
    }

    async show (req, res) {
        try{
            const prodsSave = await productSchema.find()
            if (prodsSave.length > 0){
                res.json(prodsSave)
            }
            else {
                res.json({message: "No existen productos todavía"})
            }
           
        }catch(err) {
            console.error(err)
        }
    }

    async showId(req, res){

        const {id} =  req.params
        if (!id) res.json({message: "Se requiere el ID"})

        try {
               const productSaved = await productSchema.findById(id)
               res.json(productSaved)
     
        }catch(err){
            res.status(404).json({message: err})
        }
    }
    async createProd(input) {
       
            try{
                
                let prod = { 
                    name: input.name,
                    description: input.description,
                    code:  input.code,
                    picture: input.picture,
                    price: input.price, 
                    stock: input.stock,
                    }
            const newProd = new productSchema(prod)
            await newProd.save()
    
        }catch(err){
            res.status(404).json(err)
        }

    }

    async create(admin, req, res) {
        if(admin){
        
            try{
                
                let prod = { 
                    name: req.body.name,
                    description: req.body.description,
                    code:  parseInt(req.body.code),
                    picture: req.body.picture,
                    price: parseInt(req.body.price), 
                    stock: parseInt(req.body.stock),
                    }
            const newProd = new productSchema(prod)
            res.status(200).json(await newProd.save())
    
        }catch(err){
            res.status(404).json(err)
        }
    }else{
            res.status(200).json("Error no tienes permisos para agregar productos")
        }
    }

    async update(admin, req, res) {
        
        if(admin){
            try{
                const id  = req.params.id
                let info = req.body
                await productSchema.updateOne({_id: id}, info)
                  
                res.status(200).json("Producto actualizado")
                
    
          }
          catch(err)
          {
             console.error(err)
          }
      }
    }
    async delete(admin, req, res) {
        let id = req.params.id

        if(admin){
            try{
                if (!id) res.json({message: "Se requiere el ID"})
        
    
                const productSaved = await productSchema.findByIdAndDelete(id)
                res.json(`El producto ${productSaved.name} ha sido eliminado con éxito`)
                    
                   
              
            }catch(err){
                console.error(err)
                res.status(400).json("Ha ocurrido un error")
            }
    
    }else{
        res.status(200).json("Error no tienes permisos para eliminar productos")
    }
    }


    // CARRITO METHODS

    async showCarrito(req, res) {
        try{
            const carritoSave = await carritoSchema.find()
            if (carritoSave.length > 0){
                res.json(carritoSave)
            }
            else {
                res.json({message: "No existen productos en el carrito todavía"})
            }
           
        }catch(err) {
            console.error(err)
        }
    }
    async addCarrito(req, res) {


        const {id} =  req.params
        if (!id) res.json({message: "Se requiere el ID"})

        try {
          const validar = productSchema.exists({_id:id}, function (err, doc) {
                if (err){
                    res.json("Producto no existe en la DB")
                }else{

                    validarProdCart()
                    }
            
            });
            
            const validarProdCart = async () => {

                const arrCarrito = await carritoSchema.findById("6157c6c9b6a9a9695555f6bc")
                const checkCarrito = arrCarrito.productos.items.filter(element => element._id == id)
                if(checkCarrito.length > 0) {
                    existeActualizar()
                } else {
                    noExisteCrear()
                }

         }

            async function existeActualizar(){
                const productSaved = await productSchema.findById(id)
                const getQty = await carritoSchema.findOne({"productos.items._id": productSaved._id})
                const item = await carritoSchema.updateOne({"productos.items._id": productSaved._id}, {"$set": {
                    "productos.items.$.qty": getQty.productos.items[0].qty +  1
                }}, res.json("Cantidad de producto actualizada"))
                
            }

            async function noExisteCrear() {
                const productSaved = await productSchema.findById(id)
                const carrito = await carritoSchema.findById("6157c6c9b6a9a9695555f6bc")
                carrito.productos.items.push(productSaved)
                res.json(await carrito.save())
            }
    
        }catch(err){
            res.status(404).json({message: err})
        }
    }
    
    async deleteItem(req, res) {
        const mongoose = require("mongoose")
        mongoose.set('useFindAndModify', false);

        const {id} = req.params
        const carr = await carritoSchema.findByIdAndUpdate(
                 "6157c6c9b6a9a9695555f6bc",
                { productos: {
                  $pull: {
                    items:{_id: id}
                  },
                }}
                
              )
              res.json("item eliminado del carrito" + carr)
         };

}

module.exports = {Mongo}