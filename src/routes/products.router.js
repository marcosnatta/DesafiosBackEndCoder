import { Router } from "express";
import  ProductManager  from "../ProductManager.js";

const router = Router();
const manager = new ProductManager("productos.json")


router.get("/products", async (req, res) => {

  try {
    const allproducts = await manager.getProducts();
    if (!req.query.limit) {
        res.status(200).json({ message: "productos", allproducts })
    } else{
        res.status(200).json({message:"productos", seleccionados: allproducts.slice(0,Number(req.query.limit))})
	} 
}catch (error){
    res.status(500).json({message:"tenemos un error"})
	}
});


router.get("/:pid", async (req, res) => {
    const { pid } = req.params
    try {
    const product = await manager.getProductById(+pid);

    res.status(200).json({message:"producto", product});    
  } catch (error) {
    res.status(500).json({message:"tenemos un error"})
    console.log(error)
  }
});


router.post("/products",async(req,res)=>{

    try {
    const { title, description, price, thumbnail, code, stock, status, category } = req.body;

    const newProduct = await manager.addProduct(title, description, price, thumbnail, code, stock, status, category);
        res.status(200).json({ message: "producto creado ", product: newProduct })
        console.log(newProduct)
    } catch (error) {
        res.status(500).json({ error })
        console.log(error)
    }
})


router.delete("/:pid",async(req,res)=>{
    const { pid } = req.params
try {
    const deleteProducts = await manager.deleteProduct(+pid)
    res.status(200).json({message:"producto borrado"})
} catch (error) {
    res.status(500).json({ error })
}
})

router.put("/:pid",async(req,res)=>{
    const { pid } = req.params

    try {
        const updateproduct = await manager.updateProduct(+pid,req.body)
        res.status(200).json({message: "producto actualizado"})
    } catch (error) {
        res.status(500).json({ error })
    }
})
export default router
