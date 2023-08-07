const formulario = document.getElementById("formulario");

const productitle = document.getElementById("title");
const prodDescription = document.getElementById("description");
const prodprice = document.getElementById("price");
const prodcode = document.getElementById("code");
const prodstock = document.getElementById("stock");
const prodcategory = document.getElementById("category");
const divproducts = document.getElementById("viewProducts");
const id = document.getElementById("id");

//eliminar productos
const eliminarForm = document.getElementById("eliminarForm");
const eliminarProdId = document.getElementById("eliminarProdId");


formulario.onsubmit = (e) => {
  e.preventDefault();
  const nuevoproduct = {
    title: productitle.value,
    description: prodDescription.value,
    price: prodprice.value,
    code: prodcode.value,
    stock: prodstock.value,
    category: prodcategory.value,
  };

  socketClient.emit("addProduct", nuevoproduct);
  console.log(nuevoproduct);
};

socketClient.on("addProduct", async(nuevoproduct) => {
  const addProductos = `
        <div>
            <p>ID: ${nuevoproduct.id}</p>
            <p>Título: ${nuevoproduct.title}</p>
            <p>Descripción: ${nuevoproduct.description}</p>
            <p>Precio: ${nuevoproduct.price}</p>
            <p>Código: ${nuevoproduct.code}</p>
            <p>Stock: ${nuevoproduct.stock}</p>
            <p>Categoría: ${nuevoproduct.category}</p>
        </div>
    `;
  console.log(addProductos) 
  divproducts.innerHTML = addProductos;
});


eliminarForm.onsubmit = (e) => {
  e.preventDefault();
  const ProdId = parseInt(eliminarProdId.value);
  if (ProdId) {
    socketClient.emit("deleteProduct", ProdId);
  }
};

