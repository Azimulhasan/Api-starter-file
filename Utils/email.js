const nodemailer = require('nodemailer')

const sendEmail = async (options) => {

    // Create a transporter - MailTrap
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        }
    })

    // Create a transporter - Ethereal.email
    // const transporter = nodemailer.createTransport({
    //     host: 'smtp.ethereal.email',
    //     port: 587,
    //     auth: {
    //         user: 'stephen.heidenreich@ethereal.email',
    //         pass: 'R1stwTKYjB1yNumUs4'
    //     }
    // });

    const mailOptions = {
        from: "ZarnDearc <Support@blockbazaar.com",
        to: options.email,
        subject: options.subject,
        text: options.message,
        // HTML
    }

    // send the mail
    await transporter.sendMail(mailOptions,)

}

module.exports = sendEmail