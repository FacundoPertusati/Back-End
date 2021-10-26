const fs = require ('fs')
const Producto = require('../classes/producto.class')

class fileSys {

    show (req, res) {
            try{
                if(fs.existsSync('productos.txt')){
                    fs.readFile('productos.txt', 'utf-8',(error,data)=>{
                        if(!error){
                            console.log(data)
                            res.json(data)
                        }else{
                            console.log(`Error: ${error}`)
                        }
                    })
                }else{
                fs.writeFile('productos.txt','productos',(error, data)=>{
                    if (!error){
                        console.log('lol');
                        res.json('sin productos')
                    }else{
                        console.console.log(`Error: ${error}`);
                    }
                })    
                }

        }  catch(err) {
        res.status(404).json({err})
        }        
    }
    create (admin, req, res) {

            try{
                const producto = new Producto(
                    req.query.name, 
                    req.query.description,
                    req.query.code,
                    req.query.picture,
                    req.query.price,
                    req.query.stock)
                 fs.appendFile('productos.txt',  JSON.stringify(producto),(error) =>{
                        if(!error){
                            fs.readFile('productos.txt', 'utf-8',(error, data)=>{
                                if (!error){
                                    res.json(data)
                                }else{
                                    console.console.log(`Error: ${error}`);
                                }
                            })  
                        }
                    })
               
            }catch(err){
                res.status(404).json(err)
            }
    }

    update(admin, req, res) {
        if(admin){
            try {
                let id = parseInt(req.params.id)
                productos[id] = {
                    "id": parseInt(id),
                    "date": new Date(),
                    "name": req.query.name,
                    "description": req.query.description,
                    "code": req.query.code,
                    "picture": req.query.picture,
                    "price": parseInt(req.query.price),
                    "stock": req.query.stock,
                }
                res.json(productos[id])
            } catch(err){
                throw new Error(err)
            }
        }else{
            res.status(200).json("Error no tienes permisos para actualizar productos")
        }
    }
    delete(admin, req, res) {
        if(admin){
            try {
                fs.unlink('productos.txt',(error)=>{
                    if(error) throw error;
                    console.log('eliminado')
                    res.json('eliminado')
                })
            }catch(err) {
                throw new Error(err)
            }
        }else{
            res.status(200).json("Error no tienes permisos para eliminar productos")
        }
    }
}

module.exports = fileSys