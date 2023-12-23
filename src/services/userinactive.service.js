import userModel from "../DAL/mongoDB/models/user.model.js";
import nodemailer from "nodemailer";
import config from "../config.js"

class InactiveUserService {
  async getInactiveUsers() {
    try {
      const inactiveUsers = await userModel.find({
        lastConnection: { $lt: new Date(Date.now() - 2880 * 60 * 1000) },
      });

      return inactiveUsers;
    } catch (error) {
      console.error('Error al obtener usuarios inactivos:', error);
      throw error;
    }
  }

  async deleteInactiveUsers(inactiveUsers) {
    try {
      await userModel.deleteMany({
        lastConnection: { $lt: new Date(Date.now() - 2880 * 60 * 1000) },
      });

      console.log('Usuarios inactivos eliminados correctamente');
    } catch (error) {
      console.error('Error al eliminar usuarios inactivos:', error);
      throw error;
    }
  }

  async sendInactiveUserEmails(inactiveUsers) {
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: config.gmail_user,
          pass: config.gmail_password,
        },
      });

      for (const user of inactiveUsers) {
        const mailOptions = {
          from: 'marcos.natta@gmail.com',
          to: user.email,
          subject: 'Eliminación de cuenta por inactividad',
          text: 'Tu cuenta ha sido eliminada debido a la inactividad en nuestro sistema.',
        };

        await transporter.sendMail(mailOptions);
        console.log(`Correo enviado a ${user.email}`);
      }
    } catch (error) {
      console.error('Error al enviar correos electrónicos:', error);
      throw error;
    }
  }
}

export default new InactiveUserService();
