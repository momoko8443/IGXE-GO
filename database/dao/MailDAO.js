var Lowdb = require('lowdb');

function MailDAO(){
    this.db = new Lowdb('database/mails.json');

    this.getMailHistory = function(mailAccount){
        return this.db.get(mailAccount).value();
    };

    this.addMailHistory = function(mailAccount,content){
        
        if(!this.db.has(mailAccount).value()){
            this.db.set([mailAccount], []).write()
        }
        return this.db.get(mailAccount).push(content).write();
    };
}
var mailDAO = new MailDAO();
module.exports = mailDAO;