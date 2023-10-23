const express = require('express');
const sgMail = require('@sendgrid/mail');
require('dotenv').config();
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
    accessKeyId: 'AKIA4DHVKFTNFJDVCBYY',
    secretAccessKey: '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',
    region: 'us-east-2' // Cambia al región deseada
});

const sns = new AWS.SNS();

app.post('/enviar-sms', (req, res) => {
    const params = {
      Message: 'Este es un mensaje de prueba desde Express y AWS SNS.',
      PhoneNumber: '+573132360531' // Reemplaza con el número de teléfono de destino
    };
  
    sns.publish(params, (err, data) => {
      if (err) {
        console.error('Error al enviar el mensaje de texto:', err);
        res.status(500).json({ error: 'Error al enviar el mensaje de texto' });
      } else {
        console.log('Mensaje de texto enviado con éxito:', data);
        res.json({ message: 'Mensaje de texto enviado con éxito' });
      }
    });
  });


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