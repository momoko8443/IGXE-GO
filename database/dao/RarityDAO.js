var Lowdb = require('lowdb');

function RarityDAO(){
    this.db = new Lowdb('database/base_info.json');

    this.findAll = function(){
        return this.db.get('rarities').value();
    };
}
var rarityDAO = new RarityDAO();
module.exports = rarityDAO;