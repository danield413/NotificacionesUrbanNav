const express = require('express');
const sgMail = require('@sendgrid/mail');
require('dotenv').config({
    path: 'sendgrid.env'
});
const cors = require('cors');
const AWS = require('aws-sdk');

const corsOptions = {
    origin: 'http://localhost:8080', // Especifica el dominio permitido (reemplaza con tu dominio)
    methods: 'GET,PUT,POST,DELETE', // Especifica los métodos HTTP permitidos
};

// Aplica el middleware cors a tu aplicación

const app = express();
const port = 8080;
app.use(cors(corsOptions));
app.use(express.json());

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_ID,
    region: 'us-east-2' // Cambia al región deseada
});

const sns = new AWS.SNS();

app.post('/enviar-sms', (req, res) => {
    const params = {
        Message: req.body.message,
        PhoneNumber: req.body.number // Reemplaza con el número de teléfono de destino
    };

    sns.publish(params, (err, data) => {
        if (err) {
            console.error('Error al enviar el mensaje de texto:', err);
            res.status(500).json({
                error: 'Error al enviar el mensaje de texto'
            });
        } else {
            console.log('Mensaje de texto enviado con éxito:', data);
            res.json({
                message: 'Mensaje de texto enviado con éxito'
            });
        }
    });
});


// Configura la clave de API de SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

//* ENVIAR CORREO
app.post('/enviar-correo', async (req, res) => {

    const data = req.body;


    const msg = {
        to: data.to,
        from: process.env.CORREO_ORIGEN,
        templateId: process.env.TEMPLATE_ID,
        dynamic_template_data: {
            name: data.name,
            content: `<h2>${data.content}</h2>`,
            subject: `${data.subject} 😎🚙 - UrbanNav UC`
        }
    };


    sgMail
        .send(msg)
        .then(() => {
            res.status(200).json({
                ok: true,
                message: "Correo enviado satisfactoriamente"
            });
            console.log('Email sent')
        })
        .catch((error) => {
            res.send('Error al enviar correo')
            res.status(500).json({
                message: `UPS, falló el envío de correo...`,
                ok: false,
                error,
            });
        })

});

app.listen(port, () => {
    console.log(`Servidor Express escuchando en el puerto ${port}`);
});