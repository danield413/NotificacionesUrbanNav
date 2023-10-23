const express = require('express');
const sgMail = require('@sendgrid/mail');
require('dotenv').config();
const cors = require('cors');

const corsOptions = {
    origin: 'http://localhost:8080', // Especifica el dominio permitido (reemplaza con tu dominio)
    methods: 'GET,PUT,POST,DELETE', // Especifica los métodos HTTP permitidos
};

// Aplica el middleware cors a tu aplicación

const app = express();
const port = 8080;
app.use(cors(corsOptions));
app.use(express.json());

console.log(process.env.SENDGRID_API_KEY)

// Configura la clave de API de SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);


// Ruta para enviar un correo electrónico
app.post('/enviar-correo', async (req, res) => {

    const {
        to,
        subject,
        text,
        html
    } = req.body;

    const msg = {
        to,
        from: 'daniel.diaz23622@ucaldas.edu.co',
        subject,
        text,
        html,
    };

    sgMail
        .send(msg)
        .then(() => {
            res.status(200).json({
                message: `Correo enviado satisfactoriamente a ${to}`,
                ok: true,
            });
            console.log('Email sent')
        })
        .catch((error) => {
            res.send('Error al enviar correo')
            res.status(500).json({
                message: `Falló el envío de correo a ${to}`,
                ok: false,
                error,
            });
        })

});

app.listen(port, () => {
    console.log(`Servidor Express escuchando en el puerto ${port}`);
});