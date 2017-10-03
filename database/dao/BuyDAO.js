var Lowdb = require('lowdb');
var shortid = require('shortid');
function BuyDAO() {
    this.db = new Lowdb('database/buys.json');
    this.db.defaults({ buys: [] }).write();

    this.findAll = function () {
        return this.db.get('buys').value();
    };
    this.find = function(buyId) {
        return this.db.get('buys').find({'_id':buyId}).value();
    };

    this.findByTaskId = function(taskId){
        return this.db.get('buys').filter({'task_id':taskId}).value();
    };

    this.add = function (buy) {
        if (!buy._id) {
            buy._id = shortid.generate();
        }
        this.db.get('buys').push(buy).write();
    };
    this.update = function(buy){
        if(buy._id){
            let exist = this.db.get('buys').find({'_id':buy._id});
            if (exist.value()) {
                exist.assign(buy).write();
            }
        }
    };
    this.delete = function(id){
        let exist = this.db.get('buys').find({'_id':id});
        if (exist.value()) {
            this.db.get('buys').remove({ '_id': id }).write();
        }
    };
}
var BuyDAO = new BuyDAO();
module.exports = BuyDAO;