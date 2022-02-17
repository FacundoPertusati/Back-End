import * as product from "../service/product.service.js";
import { msgs } from "../config/constants.js";


class ProductController {

    async read(req, res) {
        try {
            const query = await product.read()
            if(!query){
                res.status(400).send(msgs.products.read)
            }else {
                res.status(200).send(query)
            }
        }catch(err)
    {
        console.error(msgs.error, err)
    }
}


async find(req, res) {
    try {
        const query = await product.find(req.params.id)
        if(!query){
            res.status(400).send(msgs.products.find)
         }else{
             res.status(200).send(query)
         }
    }catch(err)
{
    console.error(msgs.error, err)
}
}


async category(req, res){
    try{
        const query = await product.findCategory(req.params.category)
        if(!query){
            res.status(400).send(msgs.products.category)
        }else {
            res.status(200).send(query)
        }

    }catch(err){
        console.error(msgs.error, err)
    }

}
    async save(req, res) {
        try{
            const data = req.body
            res.json(await product.save(data))
        }catch(err){
            console.error(msgs.error, err)
        }
    }
    async update(req, res) {
        try {
            const newData = req.body
            const query = await product.update(req.params.id, newData)
            if(!query){
                res.status(400).send(msgs.products.update)
             }else{
                 res.status(200).send(query)
             }
         }
         catch(err)
            {
                console.error(msgs.error, err)
            }
    }
    async delete(req, res) {
        try{
            const query = await product.del(req.params.id)
    
            if(!query){
               res.status(400).send(msgs.products.delete)
            }else{
                res.status(200).send(query)
            }
        }
        catch(err)
        {
            console.error(msgs.error, err)
        }
       
    }
}

export default ProductController