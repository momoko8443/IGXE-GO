var Lowdb = require('lowdb');

function AccountDAO(){
    this.db = new Lowdb('database/account.json');

    this.findAccount = function(){
        return this.db.get('account').value();
    };
    this.getSteamAccount = function(){
        return this.findAccount().steam;
    };
    this.getSMTPAccount = function(){
        return this.findAccount().smtp;
    };
}
var accountDAO = new AccountDAO();
module.exports = accountDAO;