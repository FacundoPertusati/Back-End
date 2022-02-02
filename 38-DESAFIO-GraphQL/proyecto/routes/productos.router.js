const express = require('express');
const router = express.Router()
const {Mongo} = require("../db/db")
const db = new Mongo
const admin = true;

const faker = require("faker")

faker.locale = "es"


router.use(express.json()); 
router.use(express.urlencoded({ extended: true }));  


router.get("/", (req, res) => {
    db.show(req, res)
   
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

   db.showId(req, res)
   
})


router.post("/", (req, res) => {
    db.create(true, req, res)
})

router.put("/:id", (req, res) => {
    db.update(admin, req, res)
})

router.delete("/:id", async (req, res) => {
    db.delete(admin, req, res)
})

    module.exports = router;