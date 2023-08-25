import {Router} from "express"
import {productsMongo} from "../managers/products/ProductsMongo.js"

const router = Router()

router.get("/home", async(req,res)=>{
        const allproducts = await productsMongo.findAll();
        res.render("home",{ products: allproducts })
    })




router.get("/realtimeproducts", async(req,res)=>{
    const allproducts = await productsMongo.findAll();
    res.render("realTimeProducts",{ products: allproducts })
})

//findbyid o findall

router.get("/chat", (req,res)=>{
    res.render("chat")
})

export default router