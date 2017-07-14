var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var baseInfoRouter = require('./api/BaseInfoAPI');
var taskRouter = require('./api/TaskAPI');
var automationController = require('./controller/AutomationController');
var schedule = require('node-schedule');

var app = express();

var port = process.env.PORT || 3200;

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use('/api', baseInfoRouter());
app.use('/api', taskRouter());

var j = schedule.scheduleJob('*/10 * * * *', function () {
    console.log('automation task is running');
    automationController.run();
});

//automationController.run();


app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}/`);
});