document.addEventListener("DOMContentLoaded", async () => {
  document.querySelectorAll("#addtocart").forEach((button) => {
      button.addEventListener("click", async () => {
          console.log("Botón clicado");

          try {
              const productId = button.dataset.productid;
              const cartId = await obtenerCartId();
              if (!productId || !cartId) {
                  console.error("Error: ID del producto o ID del carrito no válido");
                  return;
              }

              await addToCart(cartId, productId);
          } catch (error) {
              console.error("Error general:", error.message);
          }
      });
  });

  async function addToCart(cartId, productId) {
      try {
          const existingCartItem = await getCartItem(cartId, productId);

          if (existingCartItem) {
              const response = await fetch(
                  `/api/carts/${cartId}/products/${productId}`,
                  {
                      method: "PUT",
                      headers: {
                          "Content-Type": "application/json",
                      },
                      body: JSON.stringify({ quantity: existingCartItem.quantity + 1 }),
                  }
              );

              if (response.status === 200) {
                  const result = await response.json();
                  console.log("Producto agregado con éxito al carrito:", result.cart);
              } else {
                  const errorMessage = await response.text();
                  console.error("Error al actualizar la cantidad del producto:", errorMessage);
              }
          } else {
              const response = await fetch(
                  `/api/carts/${cartId}/products/${productId}`,
                  {
                      method: "POST",
                      headers: {
                          "Content-Type": "application/json",
                      },
                      body: JSON.stringify({ quantity: 1 }),
                  }
              );

              if (response.status === 200) {
                  const result = await response.json();
                  console.log("Producto agregado con éxito al carrito:", result.cart);
              } else {
                  const errorMessage = await response.text();
                  console.error("Error al agregar producto al carrito:", errorMessage);
              }
          }
      } catch (error) {
          console.error("Error en la solicitud al agregar producto al carrito:", error.message);
      }
  }

  async function getCartItem(cartId, productId) {
      try {
          const response = await fetch(
              `/api/carts/${cartId}/products/${productId}`,
          );
          if (response.status === 200) {
              const result = await response.json();
              return result.cart;
          } else {
              return null;
          }
      } catch (error) {
          console.error("Error al obtener información del carrito:", error.message);
          return null;
      }
  }

  async function obtenerCartId() {
      try {
          const response = await fetch("/api/carts/");
          const { carts } = await response.json();
          console.log("Carts obtenidos:", carts);

          if (carts && carts.length > 0) {
              const cartId = carts[0]._id;
              return cartId;
          } else {
              console.error("Error: No se encontró ningún carrito en la respuesta");
              throw new Error("No se encontró ningún carrito en la respuesta");
          }
      } catch (error) {
          console.error("Error al obtener ID del carrito:", error.message);
          throw new Error(`Error al obtener ID del carrito: ${error.message}`);
      }
  }

  const goToCartButton = document.getElementById("goToCartButton");
  if (goToCartButton) {
      const cartId = await obtenerCartId();
      if (cartId) {
          goToCartButton.href = `/carts/${cartId}`;
      } else {
          console.error("Error: No se pudo obtener el ID del carrito");
      }
  }
});
