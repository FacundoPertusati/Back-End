const express = require('express');
const router = express.Router()
const {opcion} = require("./productos.rutas")
const {Memoria, Mongo} = require("../classes/mongo")
const mariaDB = require("../classes/mariadb")
const FileSys = require("../classes/fs")

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

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
        seleccion.createCarrito()

        break;
    case 5:
        seleccion = new Mongo()
        seleccion.connectDB()
        break;    
    case 6:
        seleccion = new Mongo()
        seleccion.connectDBAtlas()
        break;
}


router.get("/", (req, res) => {
    seleccion.showCarrito(req, res)
    })
 
router.post("/:id", (req, res) => {
    seleccion.addCarrito(req, res)
 })
    
router.delete("/:id", (req, res) => {
    seleccion.deleteItem(req, res)   
})

module.exports = [router];