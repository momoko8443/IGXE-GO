var taskDAO = require('./database/dao/TaskDAO');

var tasks = taskDAO.findAll();

tasks.forEach(function(task) {
    task.result = [];
    taskDAO.update(task);
});