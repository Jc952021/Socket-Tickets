const ticketControl = require("../models/ticket-control");

const TicketControl = new ticketControl();

const socketController = (socket) => {
  //cuando un nuevo cliente se conecta
  //3.enviar al cliente el ultimo ticket actual
  socket.emit("ultimo-ticket", TicketControl.ultimo);
  //cuando inicia el server enviar los ultimos 4 tickets
  socket.emit("ultimos-tickets", TicketControl.ultimos4);
  //emitir la longotud de los tickets
  socket.emit("pendientes", TicketControl.tickets.length);

  //2.recibir lo que me envia el cliente y ejecutar la funcion
  socket.on("siguiente-ticket", (payload, callback) => {
    //este me retorna el ticket que se genero : Ticket ${this.ultimo}
    const siguiente = TicketControl.siguienteTicket();
    callback(siguiente);
    //emitir la longotud de los tickets
    socket.broadcast.emit("pendientes", TicketControl.tickets.length);
  });

  //4. recibir el escritorio y enviarle el ticket con el escritorio
  socket.on("atender-ticket", ({ escritorio }, callback) => {
    if (!escritorio) {
      return callback({
        ok: false,
        msg: "El escritorio es necesario",
      });
    }

    const ticket = TicketControl.atenderTicket(escritorio);
    //notificar cambio en los ultimos 4 tickets ya que al atender un ticket se elimina de la cola
    //se pone el broadcast para que se envie a todos los clientes ya que si no ponias, solo se envia al usuario que envio el atender-ticket
    //ya que esta dentro de ese socket
    socket.broadcast.emit("ultimos-tickets", TicketControl.ultimos4);
    //emitir la longotud de los tickets a el mismo
    socket.emit("pendientes", TicketControl.tickets.length);
    //emitir la longotud de los tickets a todos los usuarios
    socket.broadcast.emit("pendientes", TicketControl.tickets.length);

    if (!ticket) {
      return callback({
        ok: false,
        msg: "No hay tickets",
      });
    }
    callback({
      ok: true,
      ticket,
    }); //enviamos el ticket
  });

  //5. enviar al cliente los ultimos 4 tickets
  socket.emit("ultimos-tickets", TicketControl.ultimos4);
};

module.exports = {
  socketController,
};
