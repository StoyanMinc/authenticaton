import nodemailer from 'nodemailer';
import path from 'path';
import hbs from 'nodemailer-express-handlebars'
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.resolve(__filename);

const sendEmail = async (subject, send_to, reply_to, template, send_from, name, link) => {
    const transporter = nodemailer.createTransport({
         service: 'gmail',
    auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASSWORD,
    },
    })
    
    const handlebarsOptions = {
        viewEngine: {
            extName: '.handlebars',
            partialsDir: path.resolve(__dirname, '../../views'),
            defaultLayout: false
        },
        viewPath: path.resolve(__dirname, '../../views'),
        extName: '.handlebars'
    };

    transporter.use('compile', hbs(handlebarsOptions));

    const mailOptions = {
        subject: subject,
        from: send_from,
        to: send_to,
        reply_to: reply_to,
        template: template,
        context: {
            name: name,
            link: link
        }
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Message send: %s', info.messageId);
        return info
    } catch (error) {
        console.log('Error sending email:', error);
        throw error;
    }
};

export default sendEmail;