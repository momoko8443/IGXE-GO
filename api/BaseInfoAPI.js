var express = require('express');
var weaponDAO = require('../database/dao/WeaponDAO');
var rarityDAO = require('../database/dao/RarityDAO');
var exteriorDAO = require('../database/dao/ExteriorDAO');
var receiverDAO = require('../database/dao/ReceiverDAO');
var router = express.Router();

module.exports = function(){
    router.get('/baseinfo', (req,res) => {
        let weapons = weaponDAO.findAll();
        let rarities = rarityDAO.findAll();
        let exteriors = exteriorDAO.findAll();
        let receivers = receiverDAO.findAll();
        res.send({"weapons":weapons,"rarities":rarities,"exteriors":exteriors,"receivers":receivers});
    });
    return router;
}