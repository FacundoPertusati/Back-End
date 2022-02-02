const axios = require("axios")

function getProducts() {
    return axios.get("/productos")
}

function getProduct() {
    return axios.get("/productos/61ad0b3fd99f235ddeea1d91")
}

function addProdCart() {
    return axios.get("/carrito/61ad0b3fd99f235ddeea1d91")
}

function addProd(){
    return axios.post("/productos", {
        name: "Pera",
        description: "Verde",
        code: 12324,
        picture: "String",
        price: 2334,
        stock: 34,
        qty: 124
    })
}

Promise.all([getProducts(), getProduct(), addProdCart(), addProd()]).then(function (results){
    const products = results[0]
    const product = results[1]
    const addProd = results[2]
    const add = results[3]
})