var Lowdb = require('lowdb');

function ExteriorDAO(){
    this.db = new Lowdb('database/base_info.json');

    this.findAll = function(){
        return this.db.get('exteriors').value();
    };
}
var exteriorDAO = new ExteriorDAO();
module.exports = exteriorDAO;