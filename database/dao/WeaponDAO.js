var Lowdb = require('lowdb');

function WeaponDAO(){
    this.db = new Lowdb('database/base_info.json');

    this.findAll = function(){
        return this.db.get('weapons').value();
    };
}
var weaponDAO = new WeaponDAO();
module.exports = weaponDAO;