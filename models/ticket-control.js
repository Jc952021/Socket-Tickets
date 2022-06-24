const fs = require("fs");
const path = require("path");

//create class ticket
class Ticket {
  constructor(numero, escritorio) {
    this.numero = numero;
    this.escritorio = escritorio;
  }
}

//create class ticketControl
class TicketControl {
  constructor() {
    this.ultimo = 0; //seria el ultimo ticket que se atendio
    this.hoy = new Date().getDate(); //este meda el dia actual
    this.tickets = [];
    this.ultimos4 = []; //aca estara los tickets que se veran en la pantalla

    this.init();
  }

  get toJson() {
    return {
      ultimo: this.ultimo,
      hoy: this.hoy,
      tickets: this.tickets,
      ultimos4: this.ultimos4,
    };
  }

  //funcion init
  init() {
    //esto lo transforma a javascript
    const { ultimo, hoy, tickets, ultimos4 } = require("../db/db.json");
    //si es hoy entonces el contructor es igual a los datos de la db
    if (hoy === this.hoy) {
      this.ultimo = ultimo;
      this.tickets = tickets;
      this.ultimos4 = ultimos4;
      //si no resetea todo, este no conserva el anterior this de hoy ya que al ejecutar una funcion
      //se crea una nueva instancia de la clase
    } else {
      this.guardarDb();
    }
  }
  //guardar en la db
  guardarDb() {
    const jsonData = JSON.stringify(this.toJson);
    fs.writeFileSync(path.join(__dirname, "../db/db.json"), jsonData);
  }

  //funcion siguienteTicket
  siguienteTicket() {
    this.ultimo += 1;
    const ticket = new Ticket(this.ultimo, null); //este trae un objeto ticket
    this.tickets.push(ticket);
    this.guardarDb();
    return `Ticket ${this.ultimo}`;
  }
  //funcion atenderTicket
  atenderTicket(escritorio) {
    if (this.tickets.length === 0) {
      return null;
    }
    const ticket = this.tickets.shift(); //remueve el 1 ticket y lo trae aqui
  //le agrego un escritorio al ticket para que lo pueda atender
    ticket.escritorio = escritorio;
    this.ultimos4.unshift(ticket); //agrega el ticket al inicio del array para que se vea en la pantalla
    if (this.ultimos4.length > 4) {
      this.ultimos4.splice(-1, 1); //elimina el ultimo ticket
    }
    this.guardarDb();
    return ticket;
  }
}

module.exports = TicketControl;
