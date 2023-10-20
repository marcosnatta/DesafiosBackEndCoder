import { Router } from "express";
import { ObjectId } from "mongodb"
import {productsMongo} from "../DAL/DAOs/mongoDAOs/ProductsMongo.js"
import { isAdmin } from "../middlewares/auth.middlewares.js";
const router = Router();


router.get("/", async (req, res) => {
    try {
      const allproducts = await productsMongo.findAll(req.query);
      res.json({ allproducts });
    } catch (error) {
      console.error("Error al obtener productos:", error);
      res.status(500).json({ error });
    }
  });
  
router.get("/:pid", async (req, res) => {
    const { pid } = req.params
    const prodId = pid
    try {
    const product = await productsMongo.findById(prodId);
    
    res.status(200).json({message:"id del producto", product});    
  } catch (error) {
    res.status(500).json({error})
  }
});
//is admin
router.post("/", async(req,res)=>{

    const { title, description, price, thumbnail, code, stock, category } = req.body;

    if(!title || !description || !price || !thumbnail || !code || !stock || !category ){
        return res.status(400).json({message: "faltan datos del producto"})
    }
    
    try {
        const newProduct = await productsMongo.createProduct(req.body)
        console.log(newProduct)
        res.status(200).json({message: "producto creado", producto: newProduct})
    } catch (error) {
        res.status(500).json({error})
    }
 })

//isAdmin
router.delete("/:pid",async(req,res)=>{
    const { pid } = req.params
try {
    const deleteProducts = await productsMongo.deleteProduct(pid)
    res.status(200).json({message:"producto borrado"})
} catch (error) {
    res.status(500).json({ error })
}
})
//isAdmin
router.put("/:pid",async(req,res)=>{
    const { pid } = req.params

    try {
        const updateproduct = await productsMongo.updateProduct(pid,req.body)
        res.status(200).json({message: "producto actualizado"})
    } catch (error) {
        res.status(500).json({ error })
    }
})




  
export default router