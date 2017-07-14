var express = require('express');
var taskDAO = require('../database/dao/TaskDAO');
var router = express.Router();

module.exports = function(){
    router
    .get('/tasks', (req,res) => {
        let tasks = taskDAO.findAll();
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