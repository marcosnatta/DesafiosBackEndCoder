import fs from "fs";

class CartsManager {
  constructor(path) {
    this.path = path;
  }

  async getAllCarts() {
    if (fs.existsSync(this.path)) {
      const carritos = await fs.promises.readFile(this.path, `utf-8`);
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
  
      await fs.promises.writeFile(this.path, JSON.stringify(carritos));
      return NewCart
  }

  async addProduct(cid,pid){
    const carritos = await this.getAllCarts()
    const carro = carritos.find(c=>c.id===cid)
    const prodIndex = carro.productos.findIndex(p=>p.product===pid)
    if(prodIndex === -1){
      carro.productos.push({product: pid, quantity:1})
    } else {
      carro.productos[prodIndex].quantity++
    }
    await fs.promises.writeFile(this.path, JSON.stringify(carritos))
    return carro
  }

}

export const cartsManager = new CartsManager("./carts.json")