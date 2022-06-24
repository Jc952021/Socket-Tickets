//referencias
const lblNuevoEscritorio = document.querySelector("h1");
const btnAtender = document.querySelector("button");
const lblTicketAtendido = document.querySelector("small");
const alertMostrar = document.querySelector(".alert");
const lblPendientes = document.querySelector("#lblPendientes");

//1. ver los parametros que se envian al escritorio
const params = new URLSearchParams(window.location.search);
if(!params.has("escritorio")){ //si params no tiene escritorio
  window.location = "index.html" ; //redireccionar a la pagina principal
  throw new Error("El escritorio es necesario");
}
//ocultar el alert y el pendiente cuando no hay nada pendiente
alertMostrar.style.display = "none";

const socket = io();
//2.poner el escritorio en el h1 
const escritorio = params.get("escritorio");
lblNuevoEscritorio.textContent = `Escritorio ${escritorio}`;  

socket.on("connect", () => {
  btnAtender.disabled = false;
});

socket.on("disconnect", () => {
  btnAtender.disabled = true;
});

//3 al dar click al botonAtender,emitir al server un evento
btnAtender.addEventListener("click", () => {
//le envio un obj params con el valor del escritorio y me duevuelve el ticket
  socket.emit("atender-ticket", {escritorio}, ({ok,msg,ticket}) => {
    if(!ok){
      lblTicketAtendido.textContent = "Nadie";
      return alertMostrar.style.display = "block";
    }
    lblTicketAtendido.textContent = `Ticket ${ticket.numero}`;
  });
});
//4 recibir los tickets pendientes
socket.on("pendientes", (pendientes) => {
  lblPendientes.textContent = pendientes;
})


