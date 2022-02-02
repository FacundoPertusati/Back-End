const express = require('express');
const router = express.Router()
var { graphqlHTTP }  = require('express-graphql');
var { buildSchema } = require('graphql');
const {Mongo} = require("../db/db")
const db = new Mongo



// GraphQL schema
//https://graphql.org/graphql-js/basic-types/
var schema = buildSchema(`
    type Query {
        message: String,
        messages: [String],
        numero: Int,
        numeros: [Int],
        productos: [Producto]
    },
    
    type Producto {
        _id: String
        date: String
        name: String
        description: String
        code: Int
        picture: String
        price: Float
        stock: Int
        qty: Int
    },
    input ProductoInput {
        name: String
        description: String
        code: Int
        picture: String
        price: Float
        stock: Int
        qty: Int
    },
    type Mutation {
        createProduct(input: ProductoInput): Producto
    }
`);


var getProducts = function() {

   return db.showList()

}



// Root resolver
var root = {
    
    message: () => 'Hola Mundo!',
    messages: () => 'Hola Mundo!'.split(' '),
    numero: () => 123,
    numeros: () => [1,2,3],
    productos: getProducts,
    createProduct: ({input}) => {
       db.createProd(input)
        return input
    }


};

router.use('/', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
}));


module.exports = router;