const nodemailer = require('nodemailer');

// Nodemailer
const sendEmail = async (options) => {
    // 1) Create transporter (service that will send email like "gmail","Mailgun", "mialtrap", sendGrid)

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: "smtp.gmail.com",
        port: 465,
        secure: false,
        auth : {
            user: 'mr.robot393@gmail.com',
            pass: 'wymg bhvf tqrc wbkn'
        }
    })

    // 2) Define email options (like from, to, subject, email content)

    const mailOpts = {
        from: 'E-shop App <mr.robot393@gmail.com>',
        to: options.email,
        subject: options.subject,
        text: options.message
    }

    // 3) Send email
    await transporter.sendMail(mailOpts);
}

module.exports = sendEmail