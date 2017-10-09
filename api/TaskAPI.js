var express = require('express');
var taskDAO = require('../database/dao/TaskDAO');
var buyDAO = require('../database/dao/BuyDAO');
var router = express.Router();

module.exports = function(){
    router
    .get('/tasks', (req,res) => {
        let tasks = taskDAO.findAll();
        tasks.forEach(function(task) {
            let buys = buyDAO.findByTaskId(task._id);
            buys.sort((a,b)=>{
                return b.date - a.date;
            })
            let buyPrice = 'N/A';
            if(buys && buys.length > 0){
                let buyLog = buys[0];
                if(buyLog.buyPrices && buyLog.buyPrices.length > 0){
                    buyPrice = buyLog.buyPrices[0];
                }
            }
            task.buyPrice = buyPrice;
        });
        res.send(tasks);
    })
    .post('/tasks', (req, res) => {
        let task = req.body;
        taskDAO.add(task);
        res.sendStatus(200);
    })
    .put('/tasks/:id', (req, res)=>{
        let id = req.params.id;
        let task = req.body;
        taskDAO.update(task);
        res.sendStatus(200);
    })
    .patch('/tasks/:id', (req, res)=>{
        let id = req.params.id;
        let task = req.body;
        taskDAO.update(task);
        res.sendStatus(200);
    })
    .delete('/tasks/:id', (req, res)=>{
        let id = req.params.id;
        taskDAO.delete(id);
        res.sendStatus(200);
    })
    return router;
}