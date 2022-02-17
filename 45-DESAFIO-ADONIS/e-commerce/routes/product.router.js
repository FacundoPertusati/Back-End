import express from "express"
const router = express.Router()
import  ProductController  from "../controller/product.controller.js"


class ProductRouter {

    constructor() {
        this.productController = new ProductController
    }
    
    start() {
        router.get("/", this.productController.read)
        router.get("/:id", this.productController.find)
        router.get("/cat/:category", this.productController.category)
        router.post("/", this.productController.save)
        router.put("/:id", this.productController.update)
        router.delete("/:id", this.productController.delete)
        return router
    }
}


export default ProductRouter