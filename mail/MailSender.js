var nodemailer = require('nodemailer');
var receiverDAO = require('../database/dao/ReceiverDAO');
var accountDAO = require('../database/dao/AccountDAO');
var mailDAO = require('../database/dao/MailDAO');
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

    this.send = function(mailPool){
        for(let receiver in mailPool){
            let elements = [];
            let alert_items = mailPool[receiver];
            alert_items.forEach((alertItem) => {
                let title = '';
                title += alertItem.task.weapon.name + ' | ';
                title += alertItem.task.keyword + ' | ';
                title += alertItem.task.exterior.name + ' | ';
                title += '售价: ' + alertItem.item.price + ' | ';
                title += '磨损度: ' + alertItem.item.exterior + ' | ';
                if(parseFloat(alertItem.task.maxPrice) > 0){
                    let discount = parseFloat(alertItem.item.price)/parseFloat(alertItem.item.marketAvgPrice);
                    title += '(低于警示价:' + (parseFloat(alertItem.task.maxPrice) - parseFloat(alertItem.item.price)).toFixed(2) + ' 低于市场平均价: ' + (parseFloat(alertItem.item.marketAvgPrice) - parseFloat(alertItem.item.price)).toFixed(2) + ' 折扣:' + discount.toFixed(2) +')';
                    if(!existInMailHistory(receiver,title)){
                        let fontColor = 'black';
                        switch(true){
                            case discount < 0.8 :
                                fontColor = 'red';
                                break;
                            case discount < 0.85 :
                                fontColor = 'orange';
                                break;
                            default:
                                fontColor = 'black';
                                break;
                        }
                        
                    }
                    elements.push('<li><a style="color:' + fontColor + '" href="'+ alertItem.item.href +'">'+ title +'</a></li>');
                }                
                mailDAO.addMailHistory(receiver,title);
            });
            if(elements.length > 0){
                let html_body = '<ul>'+ elements.join(' ') +'</ul>';
                let from = '"IGXE-AUTO" <' + smtp.username  + '>';
                let mailOptions = {
                    from: from, // sender address
                    to: receiver, // list of receivers
                    subject: '[IGXE AUTO]', // Subject line
                    text: '有新的低价武器出现', // plain text body
                    html: html_body // html body
                };
                sendMail(mailOptions);
            }
        }
    };

    function existInMailHistory(receiver,content){
        let history = mailDAO.getMailHistory(receiver);
        for(let index in history){
            if(history[index] === content){
                return true;
            }
        }
        return false;
    }

    function sendMail(mailOptions){
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
            }else{
                console.log('Message %s sent: %s', info.messageId, info.response);
            }
        });
    }
}

