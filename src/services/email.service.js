import nodemailer from 'nodemailer';
import config from "../config.js";

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: config.gmail_user,
        pass: config.gmail_password,
      },
    });
  }

  async sendEmail(mailOptions) {
    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Correo electrónico enviado:', info.response);
      return info;
    } catch (error) {
      console.error('Error al enviar el correo electrónico:', error);
      throw error;
    }
  }
}

export default new EmailService();
