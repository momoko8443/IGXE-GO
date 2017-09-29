var mysql = require('mysql');
var taskDAO = require('./database/dao/TaskDAO');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Passw0rd333',
    database: 'igxe'
});

connection.connect(function (err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }

    console.log('connected as id ' + connection.threadId);
});

var taskDAO = require('./database/dao/TaskDAO');

var tasks = taskDAO.findAll();

tasks.forEach(function(task) {
    let task_id = task._id;
    let result = task.result;
    result.forEach(function(item){
        if(item.date){
            let re = 
            {
                "task_id":task_id,
                "price":parseFloat(item.price),
                "href":item.href,
                "marketAvgPrice":parseFloat(item.marketAvgPrice),
                exterior:item.exterior,
                date: new Date(item.date)
            };
            connection.query('INSERT INTO result SET ?', re, function (error, results, fields) {
                if (error) {
                    throw error;
                }
            });
        }
    });
});

connection.end();
// var re  = {task_id: "aa", price: 111, href:"xxxx",marketAvgPrice:122,exterior:"xxx",date:new Date()};
// var query = connection.query('INSERT INTO result SET ?', re, function (error, results, fields) {
//   if (error) {
//       throw error;
//   }
// });