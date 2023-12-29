document.querySelectorAll('#addtocart').forEach(button => {
  button.addEventListener('click', async () => {
    console.log("Botón clicado");

    try {
      const productId = button.dataset.productid;
      const cartId = await obtenerCartId();
      if (!productId || !cartId) {
        console.error("Error: ID del producto o ID del carrito no válido");
        return;
      }

      const result = await addToCart(cartId, productId);
      if (result && result.success) {
        console.log("Mensaje:", result.message);
        console.log("Carrito actualizado:", result.cart);
        window.location.href = `/carts/${cartId}`;
      } else {
        console.error("Error al agregar producto al carrito:", result ? result.error : "Error desconocido");
      }
    } catch (error) {
      console.error("Error general:", error.message);
    }
  });
});

async function addToCart(cartId, productId) {
  try {
    const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ quantity: 1 }),
    });

    if (response.status === 200) {
      const result = await response.json();
      return { success: true, message: result.message, cart: result.cart };
    } else {
      const errorMessage = await response.text();
      return { success: false, error: `Error al agregar producto al carrito: ${errorMessage}` };
    }
  } catch (error) {
    return { success: false, error: `Error al agregar producto al carrito: ${error.message}` };
  }
}

async function obtenerCartId() {
  try {
    const response = await fetch('/api/carts/');
    const { carts } = await response.json();
    return carts?.length > 0 ? carts[0]._id : null;
  } catch (error) {
    throw new Error(`Error al obtener ID del carrito: ${error.message}`);
  }
}
