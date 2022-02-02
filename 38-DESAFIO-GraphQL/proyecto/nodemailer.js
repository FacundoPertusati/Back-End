const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'leonardo.erdman93@ethereal.email',
        pass: 'muKQ4w2CYUJFJvdyuk'
    }
});

const mailOptions = {
    from: "Servidor node",
    to: "dimematthe@gmail.com",
    subject: "Ha iniciado sesión",
    html: "<h1>Sign in</h1>"
}

const mailOptionsLogOut = {
    from: "Servidor node",
    to: "dimematthe@gmail.com",
    subject: "Ha cerrado sesión",
    html: "<h1>Log out sucess</h1>"
}


module.exports = {transporter, mailOptions, mailOptionsLogOut}