import { ticketService } from '../services/ticket.service.js';

class TicketController {
  async createTicket(req, res) {
    const {purchase_datetime, amount, purchaser } = req.body;

    try {

      const ticket = await ticketService.createTicket({
        code,
        purchase_datetime,
        amount,
        purchaser,
      });
      res.status(201).json({ ticket });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export const ticketController = new TicketController();
