import { TicketMongo } from "../DAL/DAOs/mongoDAOs/ticketMongo.js";

class TicketService {
  constructor() {
    this.ticketMongo = new TicketMongo();
  }

  async createTicket(ticketData, userEmail) {
    try {
      const newTicket = await this.ticketMongo.createTicket(ticketData, userEmail);
      return newTicket;
    } catch (error) {
      throw new Error(error);
    }
  }
}

export const ticketService = new TicketService();
