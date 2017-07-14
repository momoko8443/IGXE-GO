var Lowdb = require('lowdb');

function AccountDAO(){
    this.db = new Lowdb('database/account.json');

    this.getSteamAccount = function(){
        return this.db.get('steam').value();
    };
    this.getSMTPAccount = function(){
        return this.db.get('smtp').value();
    };
}
var accountDAO = new AccountDAO();
module.exports = accountDAO;