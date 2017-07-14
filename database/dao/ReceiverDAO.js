var Lowdb = require('lowdb');

function ReceiverDAO(){
    this.db = new Lowdb('database/base_info.json');

    this.findAll = function(){
        return this.db.get('receivers').value();
    };
}
var receiverDAO = new ReceiverDAO();
module.exports = receiverDAO;