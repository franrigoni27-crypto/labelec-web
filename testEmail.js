require('dotenv').config();
const nodemailer = require('nodemailer');

console.log("--- INICIANDO PRUEBA DE EMAIL ---");
console.log("Usuario configurado:", process.env.EMAIL_USER);
// No mostramos la contraseña completa por seguridad, solo la longitud
console.log("Longitud de contraseña:", process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : "No definida");

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER, // Se envía a sí mismo para probar
    subject: 'Prueba Técnica Labelec',
    text: 'Si estás leyendo esto, la configuración funciona perfectamente.'
};

console.log("Intentando enviar...");

transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.log("❌ ERROR FATAL:");
        console.log(error);
    } else {
        console.log("✅ ÉXITO TOTAL:");
        console.log("ID del mensaje:", info.messageId);
        console.log("Respuesta del servidor:", info.response);
        console.log("¡Revisa tu bandeja de entrada o spam ahora!");
    }
});