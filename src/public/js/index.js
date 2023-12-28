document.addEventListener('DOMContentLoaded', function () {
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
        await addToCart(cartId, productId);
        console.log(cartId,productId)
          window.location.href = `/carts/${cartId}`;        
      } catch (error) {
        console.error(error);
      }
    });
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
    const result = await response.json();
    if (response.ok) {
      console.log("Mensaje:", result.message);
      console.log("Carrito actualizado:", result.cart);
      window.location.href = `/carts/${cartId}`;
    } else {
      console.error("Error al agregar producto al carrito:", result.error);
    }
  } catch (error) {
    console.error("Error al agregar producto al carrito:", error.message);
  }
}

async function obtenerCartId() {
  try {
    const response = await fetch('/api/carts/');

    if (!response.ok) {
      throw new Error(`Error al obtener el carrito. Código de estado: ${response.status}`);
    }
    const { carts } = await response.json();
    return carts?.length > 0 ? carts[0]._id : null;
  } catch (error) {
    console.error("Error al obtener ID del carrito:", error.message);
    return null;
  }
}
