import { Router } from "express";
import { ObjectId } from "mongodb"
import {cartsMongo} from "../managers/carts/CartsMongo.js"
const router = Router()


router.get("/:cid", async (req, res) => {
    const { cid } = req.params;

    const cartId = new ObjectId(cid); 

    try {
        const carrito = await cartsMongo.findById(cartId);
        res.status(200).json({ message: "Carrito encontrado", carrito });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al buscar el carrito" });
    }
});


router.post("/", async(req,res)=>{
    try {
        const createCart = await cartsMongo.createCart()
        res.status(200).json({message:"productos",carro: createCart})
    } catch (error) {
        console.log(error)
        res.status(500).json({error})
    }
})

router.post("/:cid/products/:pid", async (req, res) => {
    const { cid, pid } = req.params;

    const cartId = new ObjectId(cid); 
    const productId = new ObjectId(pid); 

    try {
        const updatedCart = await cartsMongo.addProductToCart(cartId, productId);
        res.status(200).json({ message: "Producto agregado al carrito", carrito: updatedCart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al agregar el producto al carrito" });
    }
});


export default router