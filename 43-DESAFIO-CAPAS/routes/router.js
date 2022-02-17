import express from "express";
export const router = express.Router();
import { wrongMsgRoute } from "../config/constants.js"
import  ProductRouter  from "./product.router.js";
import MessageRouter from "./message.router.js";
import UserRouter from "./user.router.js";


// Including Routers

const productRouter = new ProductRouter
const messageRouter = new MessageRouter
const userRouter = new UserRouter

//we need to add user, cart, orders
router.use("/product", productRouter.start())
router.use("/chat", messageRouter.start())
router.use("/", userRouter.start())




// Wrong routes
router.get("**",(req,res)=>{
    res.status(200).json(wrongMsgRoute)
})
router.post("**",(req,res)=>{
    res.status(200).json(wrongMsgRoute)
})
router.delete("**",(req,res)=>{
    res.status(200).json(wrongMsgRoute)
})

