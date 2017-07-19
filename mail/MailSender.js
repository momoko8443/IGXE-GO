var nodemailer = require('nodemailer');
var receiverDAO = require('../database/dao/ReceiverDAO');
var accountDAO = require('../database/dao/AccountDAO');

module.exports = new MailSender();

function MailSender(){
    let smtp = accountDAO.getSMTPAccount();
    let transporter = nodemailer.createTransport({
        host: smtp.server,
        port: smtp.port,
        secure: true, // secure:true for port 465, secure:false for port 587
        auth: {
            user: smtp.username,
            pass: smtp.password
        }
        //proxy: 'http://web-proxy.jpn.hp.com:8080'
    });

    this.send = function(alert_items,receivers){
        let to_list = [];
        if(!receivers || receivers.length === 0){
            receivers = receiverDAO.findAll();
        }
        receivers.forEach(function(receiver) {
            to_list.push(receiver.mail);
        }, this);

        let elements = [];
        alert_items.forEach((item) => {
            elements.push('<li><a href="'+ item.href +'">跳转到IGXE</a></li>');
        });
        let html_body = '<ul>'+ elements.join(' ') +'</ul>';
        let from = '"IGXE-AUTO" <' + smtp.username  + '>';
        let mailOptions = {
            from: from, // sender address
            to: to_list.join(','), // list of receivers
            subject: '[Low Price Reminder] 有新低价武器出现 ', // Subject line
            text: '有新低价武器出现', // plain text body
            html: html_body // html body
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
            }else{
                console.log('Message %s sent: %s', info.messageId, info.response);
            }
        });
    };
}

