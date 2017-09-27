var Lowdb = require('lowdb');
var shortid = require('shortid');
function ResultDAO() {
    this.db = new Lowdb('database/results.json');
    this.db.defaults({ results: [] }).write();

    this.findAll = function () {
        return this.db.get('results').value();
    };
    this.find = function(resultId) {
        return this.db.get('results').find({'_id':resultId}).value();
    };

    this.add = function (result) {
        if (!result._id) {
            result._id = shortid.generate();
        }
        this.db.get('results').push(result).write();
    };
    this.update = function(result){
        if(result._id){
            let exist = this.db.get('results').find({'_id':result._id});
            if (exist.value()) {
                exist.assign(result).write();
            }
        }
    };
    this.delete = function(id){
        let exist = this.db.get('results').find({'_id':id});
        if (exist.value()) {
            this.db.get('results').remove({ '_id': id }).write();
        }
    };
}
var ResultDAO = new ResultDAO();
module.exports = ResultDAO;