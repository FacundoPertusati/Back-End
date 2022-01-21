const express = require('express');
const router = express.Router()
const {Mongo} = require("../db/db")
const db = new Mongo
router.use(express.json());
router.use(express.urlencoded({ extended: true }));


router.get("/", (req, res) => {
    res.send("hello")
    // db.showCarrito(req, res)
    })
 
router.post("/:id", (req, res) => {
    db.addCarrito(req, res)
 })
    
router.delete("/:id", (req, res) => {
    db.deleteItem(req, res)   
})

module.exports = [router];