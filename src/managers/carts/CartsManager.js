import fs from "fs";
import { __dirname } from "../../utils.js"



const path = __dirname + "./carts.json"
class CartsManager {

  async getAllCarts() {
    if (fs.existsSync(path)) {
      const carritos = await fs.promises.readFile(path, `utf-8`);
      return JSON.parse(carritos);
    } else {
      return [];
    }
  }

  async getCart(id){
    const carritos = await this.getAllCarts()
    const carro = carritos.find(c=>c.id===id)
    return carro
  }

  async createCart(){
    const carritos = await this.getAllCarts() 
    let id
      if (!carritos.length) {
        id = 1;
      } else {
        id = carritos[carritos.length - 1].id + 1;
      }
      const NewCart = {productos:[], id}
      carritos.push(NewCart);
  
      await fs.promises.writeFile(path, JSON.stringify(carritos));
      return NewCart
  }

  async addProduct(cid,pid){
    const carritos = await this.getAllCarts()
    const carro = carritos.find(c=>c.id===cid)

    if(carro){
      const prodIndex = carro.productos.findIndex(p=>p.product===pid)
      if(prodIndex === -1){
        carro.productos.push({product: pid, quantity:1})
      } else {
        carro.productos[prodIndex].quantity++
      }
      await fs.promises.writeFile(path, JSON.stringify(carritos))
      return carro
    } else{
      return error
    }
  }

}

export const cartsManager = new CartsManager("carts.json")

