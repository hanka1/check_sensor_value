import nodemailer from 'nodemailer'
import config from "./config.js"

let transporter = nodemailer.createTransport({
    host: config.EMAIL_SERVICE,
    port:465,
    secure: true, // true for 465, false for other ports
    logger: true,
    debug: true,
    secureConnection: false,
    auth: {
        user: config.EMAIL_ADDRESS_FROM, 
        pass: config.EMAIL_PASSWORD, 
    },
    tls:{
        rejectUnAuthorized: true
    }
})

  
function mailOptions (text) {
    let msg = {
        from: config.EMAIL_ADDRESS_FROM,
        to: config.EMAIL_ADDRESS_TO,
        subject: config.EMAIL_SUBJECT,
        text: text
    }

    return JSON.stringify(msg)
}

  
export default {
      transporter,
      mailOptions,
}