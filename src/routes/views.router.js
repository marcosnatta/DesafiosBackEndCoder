import {Router} from "express"
import  ProductManager  from "../ProductManager.js";


const router = Router()
const manager = new ProductManager("productos.json")

router.get("/home", async(req,res)=>{
        const allproducts = await manager.getProducts();
        res.render("home",{ products: allproducts })
    })




router.get("/realtimeproducts", async(req,res)=>{
    const allproducts = await manager.getProducts();
    res.render("realTimeProducts",{ products: allproducts })
})

export default router