import { TicketMongo } from "../DAL/DAOs/mongoDAOs/ticketMongo.js";

class TicketService {
  constructor() {
    this.ticketMongo = new TicketMongo();
  }

  async createTicket(ticketData) {
    try {
      const newTicket = await this.ticketManager.createTicket(ticketData);
      return newTicket;
    } catch (error) {
      throw new Error('Error al generar el ticket');
    }
  }
}

export const ticketService = new TicketService();
