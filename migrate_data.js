var taskDAO = require('./database/dao/TaskDAO');
var resultDAO = require('./database/dao/ResultDAO');
var tasks = taskDAO.findAll();

tasks.forEach(function(task) {
    let results = task.result
    results.forEach(function(result){
        result["task_id"] = task._id;
        resultDAO.add(result);
    });
    delete task.result;
    taskDAO.update(task);
});