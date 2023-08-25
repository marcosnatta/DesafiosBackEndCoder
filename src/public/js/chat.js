const socketClient = io();

document.getElementById("formularioChat").addEventListener("submit", (event) => {
  event.preventDefault();
  const user = document.getElementById("usuario").value;
  const message = document.getElementById("message").value;

  
  socketClient.emit("chatMessage", { usuario, message });
  document.getElementById("message").value = "";
});

// Muestra los mensajes al cliente
socketClient.on("chatMessage", (messageData) => {
  const messages = document.getElementById("messages");
  const nuevomensaje = document.createElement("li");
  nuevomensaje.textContent = `${messageData.user}: ${messageData.message}`;
  messages.appendChild(nuevomensaje);
});