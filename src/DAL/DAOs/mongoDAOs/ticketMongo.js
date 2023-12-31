function generateUniqueCode() {
  return Date.now().toString();
}
import nodemailer from "nodemailer";
import { Ticket } from "../../mongoDB/models/ticket.model.js";
import config from "../../../config.js";

class TicketMongo {


  async createTicket(ticketData, userEmail) {
    try {
      const { purchase_datetime, amount } = ticketData;
      if (!purchase_datetime || !amount) {
        throw new Error("purchase_datetime y amount son campos obligatorios");
      }
      const code = generateUniqueCode();
      const newTicket = new Ticket({
        ...ticketData,
        code: code,
      });

      await newTicket.save();
      console.log('Correo electrónico del usuario:', userEmail);

      this.sendEmail(newTicket, userEmail);

      return newTicket;
    } catch (error) {
      console.error("Error al crear el ticket:", error.message);
      throw error;
    }
  }

  
  async sendEmail(ticket, userEmail) {
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: config.gmail_user,
          pass: config.gmail_password,
        },
      });

      const mailOptions = {
        from: "tucorreo@gmail.com",
        to: userEmail,
        subject: "Compra Exitosa",
        html: `<p>Su compra se efectuó correctamente. Detalles del ticket:</p>
               <p>ID del Ticket: ${ticket._id}</p>
               <p>Fecha y Hora de la Compra: ${ticket.purchase_datetime}</p>
               <p>Monto Total: ${ticket.amount}</p>
               <p>¡Gracias por comprar!</p>`,
      };

      await transporter.sendMail(mailOptions);
      console.log("Correo electrónico enviado con éxito");
    } catch (error) {
      console.error("Error al enviar el correo electrónico:", error.message);
    }
  }
}

export { TicketMongo };
