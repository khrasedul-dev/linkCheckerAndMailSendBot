const nodemailer = require('nodemailer')
const smtpTransport = require('nodemailer-smtp-transport')



module.exports = (email,ctx)=>{

    const mail = nodemailer.createTransport(smtpTransport({
        service: "gmail",
        auth:{
            user: "khrasedul7@gmail.com",
            pass: "rps1234@"
        }
    }))

    const object = {
        from: "khrasedul7@gmail.com",
        to: email,
        subject: `Callback url mail`,
        html:`This is demo mail`
    }


    mail.sendMail(object).then(()=>ctx.reply("Please check your mailbox"))
    
}