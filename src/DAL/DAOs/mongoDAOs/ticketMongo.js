import { Ticket } from "../../mongoDB/models/ticket.model.js";

class TicketMongo {
  async createTicket(ticketData) {
    const newTicket = new Ticket(ticketData);
    await newTicket.save();
    return newTicket;
  }
}

export { TicketMongo };
