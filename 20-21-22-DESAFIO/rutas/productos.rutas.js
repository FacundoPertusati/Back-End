const express = require('express');
const router = express.Router()
const {Memoria, Mongo} = require("../classes/mongo")
const mariaDB = require("../classes/mariadb")
const FileSys = require("../classes/fs")
const sqlite = require("../classes/sqlite")
const faker = require("faker")

faker.locale = "es"

//---------------------------Escoja la opción -----------------------------------

// "Escoja la base de datos: 0. Memoria / 1. FS / 2. MariaDB Local / 3. MariaDB Remoto / 4. SQLite3 /5. MongoDB Local / 6. MongoDB Atlas / 7. Firebase")

const opcion = 6
let admin = true;

//--------------------------------------------------------------------------------
let seleccion = 1

switch(opcion) {
    case 0:
        seleccion = new Memoria()
        break;
    case 1:
        seleccion = new FileSys()
        break;
    case 2:
        seleccion = new mariaDB()
        seleccion.connectDB()
        break;
    case 4:
        seleccion = new sqlite()
        seleccion.connectDB() 
    case 5:
        seleccion = new Mongo()
        seleccion.connectDB()
        break;    
    case 6:
        seleccion = new Mongo()
        seleccion.connectDBAtlas()
        break;
}


router.use(express.json()); 
router.use(express.urlencoded({ extended: true }));  


router.get("/", (req, res) => {
    seleccion.show(req, res)
   
})

router.get('/vista-test/', (req, res) => {
    let productos = {items:[]
    }

    for(let i = 0; i< 10 ;i++) {

        //nombre precio foto

        let obj = {
            nombre: faker.vehicle.manufacturer(),
            precio: faker.commerce.price(),
            foto: faker.image.transport(100, 100, true)
        }

       productos.items.push(obj)
    }

    res.render("index", productos);

})

router.get('/vista-test/:cant', (req, res) => {

    let productos = {items:[]
    }

    const {cant} = req.params
    if(cant > 0) {
        for(let i = 0; i< cant ;i++) {
    
            //nombre precio foto
    
            let obj = {
                nombre: faker.commerce.productName(),
                precio: faker.commerce.price(),
                foto: faker.image.food(100, 100, true)
            }
    
           productos.items.push(obj)
        }
        
    }


    res.render("index", productos);
})

router.get("/:id", (req, res) => {

   seleccion.showId(req, res)
   
})


router.post("/", (req, res) => {
    seleccion.create(admin, req, res)
})

router.put("/:id", (req, res) => {
    seleccion.update(admin, req, res)
})

router.delete("/:id", async (req, res) => {
    seleccion.delete(admin, req, res)
})

    module.exports ={router, opcion};