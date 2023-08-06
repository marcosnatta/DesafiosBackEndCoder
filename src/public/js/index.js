const socketClient = io()

const formulario = document.getElementById('formulario')

const productitle = document.getElementById('title')
const prodDescription = document.getElementById("description")
const prodprice =document.getElementById("price")
const prodthumbnail =document.getElementById("thumbnail")
const prodcode =document.getElementById("code")
const prodstock =document.getElementById("stock")
const prodstatus =document.getElementById("status")
const prodcategory =document.getElementById("category")

const divproducts = document.getElementById("viewProducts")

formulario.onsubmit = (e)=>{
    e.preventDefault()
    const titleproduct = {
        nombre: productitle.value,
        descripcion: prodDescription.value,
        price:prodprice.value,
        thumbnail: prodthumbnail.value,
        code: prodcode.value,
        stock: prodstock.value,
        status: prodstatus.value,
        category: prodcategory.value
    }

    socketClient.emit("producto nuevo",titleproduct)
}

socketClient.on("realTimeProducts", productonuevo=>{
    const mostrarProductos = productonuevo.map(objproducts=>{
        return `<p>Nombre del producto:${objproducts.nombre}</p><p>Descripcion del producto:${objproducts.descripcion}</p><p>Precio del producto:${objproducts.price}</p><p>Direccion del producto:${objproducts.thumbnail}</p><p>Codigo del producto:${objproducts.code}</p><p>Stock del producto:${objproducts.stock}</p><p>Status del producto:${objproducts.status}</p><p>Categoria del producto:${objproducts.category}</p>`
    }).join("")
    divproducts.innerHTML = mostrarProductos
})
