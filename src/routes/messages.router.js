import { Router } from "express";
import { transporter } from "../nodemailer.js";
import { __dirname } from "../utils.js";
const router = Router()

router.get("/", async (req,res)=>{
    const messageOpt ={
        from: "marcos natta",
        to: ["marcos.natta@gmail.com"],
        subject: "mensaje de marcos",
        text:"hola crack",
        // html:
        // "<h1>Primer mensaje con nodemailer</h1>",
        //attachments:[{ path: __dirname+"imagen a enviar"}] sirve para enviar imagenes 
    }
    await transporter.sendMail(messageOpt);
    res.send("mensaje enviado")
})

export default router;