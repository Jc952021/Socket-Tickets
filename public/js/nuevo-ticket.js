//referencias
const lblNuevoTicket = document.querySelector("#lblNuevoTicket");
const btnEnviar = document.querySelector("button");

const socket = io();

socket.on("connect", () => {
  btnEnviar.disabled = false;
});

socket.on("disconnect", () => {
  btnEnviar.disabled = true;
});

//1.al dar click al botonEnviar,emitir al server un evento
//me regresa un callback y le pongo como texto al lblNuevoTicket
btnEnviar.addEventListener("click", () => {
  socket.emit("siguiente-ticket", null, (siguienteTicket) => {
    lblNuevoTicket.textContent = siguienteTicket;
  });
});

//4.recibir el ultimo ticket actual
socket.on("ultimo-ticket", (ultimoTicket) => {
  lblNuevoTicket.textContent = `Ticket ${ultimoTicket}`;
});
