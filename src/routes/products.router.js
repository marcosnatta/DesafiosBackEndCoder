import { Router } from "express";
import  ProductManager  from "../ProductManager.js";
const router = Router();
 
router.get("/", async (req, res) => {
  try {
    const allproducts = await ProductManager.getProducts();
    if (!req.query.limit) {
        res.send(allproducts)
    } else{
        return res.send(allproducts.slice(0,Number(req.query.limit)))
	} 
}catch (error){
    res.send({error:"tenemos un error"})
	}
});

router.get("/products/:pid", async (req, res) => {
  try {
    const idproductos = await ProductManager.getProductById(
      Number(req.params.pid)
    );
    if (idproductos) {
      return res.send(idproductos);
    } else {
      return res.send("el producto no se encontro");
    }
  } catch (err) {
    res.send({ error: "tenemos un error" });
  }
});

export default router;
