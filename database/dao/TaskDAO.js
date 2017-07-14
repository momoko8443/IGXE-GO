var Lowdb = require('lowdb');
var shortid = require('shortid');
function TaskDAO() {
    this.db = new Lowdb('database/tasks.json');
    this.db.defaults({ tasks: [] }).write();

    this.findAll = function () {
        return this.db.get('tasks').value();
    };

    this.findAllRunning = function(){
        return this.db.get('tasks').filter({'isRunning': true}).value();
    };

    this.add = function (task) {
        if (!task._id) {
            task._id = shortid.generate();
        }
        this.db.get('tasks').push(task).write();
    };
    this.update = function(task){
        if(task._id){
            let exist = this.db.get('tasks').find({'_id':task._id});
            if (exist.value()) {
                exist.assign(task).write();
            }
        }
    };
    this.delete = function(id){
        let exist = this.db.get('tasks').find({'_id':id});
        if (exist.value()) {
            this.db.get('tasks').remove({ '_id': id }).write();
        }
    };
}
var taskDAO = new TaskDAO();
module.exports = taskDAO;