const nodemailer = require('nodemailer')

const transport = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    secure: false,
    auth: {
        user: 'prajapatinayan17107@gmail.com',
        pass: 'rrijfgzupdjpbwnt'
    }
})


const sendMail = async (message) => {
    let respons = await transport.sendMail(message)
    // console.log(respons)
}

module.exports = sendMail;