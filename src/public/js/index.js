const addToCartButton = document.getElementById("addtocart");

addToCartButton.addEventListener("click", async () => {
  try {
    console.log("Botón 'Agregar al carrito' clicado");

    const pid = addToCartButton.dataset.pid;

    const response = await fetch(`/api/carts`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener carritos");
    }

    const { carts } = await response.json();
    console.log("Carts:", carts);

    let cid;
    if (carts.length > 0) {
      cid = carts[0]._id;
      console.log("Cart ID:", cid);
    } else {
      console.error("No se recibió un carrito válido");
      return;
    }

    const addToCartResponse = await fetch(`/api/carts/${cid}/products/${pid}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ quantity: 1 }),
    });

    if (!addToCartResponse.ok) {
      throw new Error("Error al agregar producto al carrito");
    }

    const result = await addToCartResponse.json();
    console.log("Mensaje:", result.message);
    console.log("Carrito actualizado:", result.cart);
  } catch (error) {
    console.error(error.message);
  }
});
