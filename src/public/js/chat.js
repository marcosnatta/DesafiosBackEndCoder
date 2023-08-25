const socket = io();

document.getElementById("formularioChat").addEventListener("submit", (event) => {
  event.preventDefault();
  const usuario = document.getElementById("usuario").value;
  const message = document.getElementById("message").value;

  
  socket.emit("chatMessage", { usuario, message });
  document.getElementById("message").value = "";
  console.log(message)
});


socket.on("chatMessage", (messageData) => {
  const messages = document.getElementById("messages");
  const nuevomensaje = document.createElement("li");
  nuevomensaje.textContent = `${messageData.usuario}: ${messageData.message}`;
  messages.appendChild(nuevomensaje);
});