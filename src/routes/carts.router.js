import { Router } from "express";
import { ObjectId } from "mongodb"
import {cartsMongo} from "../managers/carts/CartsMongo.js"
import {cartsModel} from "../db/models/carts.model.js"


const router = Router()

router.get('/',async(req,res)=>{
    try {
        const carts = await cartsMongo.findAll()
        res.status(200).json({ message: "carrito encontrado" , carts })
    } catch (error) {
        res.status(500).json({ error })
    }
})


router.get("/:cid", async (req, res) => {
    const { cid } = req.params;

    const cartId = new ObjectId(cid); 

    try {
        const carrito = await cartsModel.findById(cartId).populate("products.id")
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

router.delete("/:cid",async(req,res)=>{
    const {cid} = req.params
    const cartId = new ObjectId(cid);

    try {
        const borrarProds = await cartsMongo.deleteAllProducts(cartId);
        res.status(200).json({ message: "Productos eliminados del carrito", borrarProds });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al eliminar los productos del carrito" });
      }

})

router.delete('/:cid/products/:pid',async(req,res)=>{
    const {cid,pid} = req.params
    const cartId = new ObjectId(cid); 
    try {
        const resultCart = await cartsMongo.deleteCartProd(cartId,pid)
        res.status(200).json({ message: 'Success', resultCart })
    } catch (error) {
        res.status(500).json({ error })
    }
})

router.put("/:cid", async(req,res)=>{
    const { cid } = req.params;
    const cartId = new ObjectId(cid);
    const updatedData = req.body;

    try {
        const updatedCart = await cartsMongo.updateOne(cartId, updatedData);
        res.status(200).json({ message: "Carrito actualizado", updatedCart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al actualizar el carrito" });
    }
})

router.put("/:cid/products/:pid", async (req, res) => {
    const { cid, pid } = req.params;
    const updatedQuantity = req.body.quantity;
    try {
        const updatedCart = await cartsMongo.updateProductQuantity(cid, pid, updatedQuantity);
        const updatedProduct = updatedCart.products.find(product => product.id._id.toString() === pid);

        res.status(200).json({
            message: "Cantidad de producto actualizada",
            cart: updatedCart,
            updatedProduct: {
                _id: updatedProduct.id._id,
                quantity: updatedProduct.quantity
                
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error al actualizar la cantidad del producto en el carrito" });
    }
});



export default router
