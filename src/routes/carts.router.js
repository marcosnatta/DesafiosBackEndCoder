import { Router } from "express";
import { cartsManager } from "../CartsManager.js"

const router = Router()


router.get("/:cid", async(req,res)=>{
    const {id} = req.params
    try{
        const carrito = await cartsManager.getCart(+id)
        res.status(200).json({message:"carrito", carrito})
    } catch (error){
        res.status(500).json({error})
    }
})

router.post("/", async(req,res)=>{
    try {
        const createCart = await cartsManager.createCart()
        res.status(200).json({message:"productos",carro:createCart})
    } catch (error) {
        console.log(error)
        res.status(500).json({error})
    }
})

router.post("/:cid/products/:pid",async(req,res)=>{
    const {cid,pid} = req.params
    try {
        const addProduct = await cartsManager.addProduct(+cid, +pid)
        res.status(200).json({message: "carrito-producto", carrito: addProduct})
    } catch (error) {
        console.log(error)
        res.status(500).json({ error })
    }
})

export default router