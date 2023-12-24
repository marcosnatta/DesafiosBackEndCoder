import nodemailer from "nodemailer"
import config from "./config.js"

async function sendTestEmail() {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: config.gmail_user,
        pass: config.gmail_password,
      },
    });
  
    const mailOptions = {
      from: 'marcos.natta@gmail.com',
      to: 'marcos.natta@gmail.com', // Reemplaza con tu dirección de correo electrónico
      subject: 'Prueba de Correo Electrónico',
      text: 'Esto es una prueba de correo electrónico.',
    };
  
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Correo electrónico de prueba enviado:', info.response);
    } catch (error) {
      console.error('Error al enviar el correo electrónico de prueba:', error);
    }
  }
  
  sendTestEmail();