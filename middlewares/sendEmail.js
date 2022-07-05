const nodemailer = require('nodemailer');


exports.sendEmail = (_bodyData = {}) => {
    return new Promise((resolve, reject) => {

        // need to open in outlook new accout
        let transporter = nodemailer.createTransport({
            host: "smtp-mail.outlook.com", // hostname
            secureConnection: false, // TLS requires secureConnection to be false
            port: 587, // port for secure SMTP
            tls: {
                ciphers: 'SSLv3'
            },
            // auth: פרטים של המייל שלכם 
            auth: {
                user: 'ntn111@outlook.co.il',
                pass: '148148148na'
            }
        });

        let mailOptions = {
            from: 'ntn111@outlook.co.il',
            replyTo: _bodyData.email,
            to: 'ntnlgrbly@gmail.com',
            subject: _bodyData.subject,
            text: `
    
    name: ${_bodyData.name}\n
    email:  ${_bodyData.email}\n
    message: ${_bodyData.msg || ""}\n
    
    `
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log("err", error);
                resolve(false)
            } else {
                console.log('Email sent: ' + info.response);
                resolve(true)
            }
        })
    });
}
