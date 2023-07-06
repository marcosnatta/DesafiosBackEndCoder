class ProductManager {
  constructor() {
    this.products = [];
  }

  getProducts() {
    return this.products;
  }

  addProduct(title, description, price, thumbnail, code, stock) {
    if (!title || !description || !price || !thumbnail || !code || !stock) {
      console.log("Todos los campos son obligatorios");
    }
    if (this.products.find((p) => code === p.code)) {
      console.log("ya existe ese code");
    }
    const id =
      this.products.length === 0 ? 1 : this.products[this.products.length - 1].id + 1;

    const nuevoProducto = {
      id,
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };

    this.products.push(nuevoProducto);
  }
  getProductById(id){
    const productoId = this.products.find(p => p.id === id )
    if(productoId === undefined){
        console.log("el producto no existe")
    }else{
        return productoId
    }
  }


}







const producto1 = new ProductManager();
producto1.addProduct(
  "producto prueba",
  "este es un producto prueba",
  200,
  "sin imagen",
  "abc123",
  25
);
producto1.addProduct(
  "producto prueba 2",
  "este es otro producto prueba",
  300,
  "con imagen",
  "oka123",
  50
);

//producto1.addProduct("producto prueba","este es un producto prueba",200,"sin imagen","abc123",25) (metodo para verificar que el campo CODE esta repetido)

//producto1.addProduct() (metodo para verificar que los campos son obligatorios)
//console.log(producto1.getProducts())
//console.log(producto1.getProductById(3)) //metodo para verificar que el id no existe
