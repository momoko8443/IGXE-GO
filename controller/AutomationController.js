var taskDAO = require('../database/dao/TaskDAO');
var automation = require('../selenium/Automation');
var mailSender = require('../mail/MailSender');
var receiverDAO = require('../database/dao/ReceiverDAO');
function AutomationController(){
    let domain = 'https://www.igxe.cn';
    function convertBoolean(flag){
        if(flag){
            return '1';
        }else{
            return '0';
        }
    }
    this.run = function(){
        let tasks = taskDAO.findAllRunning();
        let _tasks = [];
        tasks.forEach(function(task) {
            let searchURL = domain + task.weapon.value + '?';
            searchURL += 'keyword=' + task.keyword;
            searchURL += '&search_page_no=1';
            searchURL += '&search_relate_price=';
            searchURL += '&search_is_sticker=' + convertBoolean(task.isSticker);
            searchURL += '&search_is_stattrak=' + convertBoolean(task.isStatTrak);
            searchURL += '&search_price_gte=';
            searchURL += '&search_price_lte=';
            searchURL += '&search_rarity_id=' + task.rarity.value;
            searchURL += '&search_exterior_id=' + task.exterior.value;
            searchURL += '&search_sort_key=2';
            searchURL += '&search_sort_rule=0';
            //console.log(searchURL);
            _tasks.push({'_id':task._id,'url':searchURL});
        });
        automation.execute(_tasks).then(()=>{
            console.info('run automation successfully');
            let tasks = taskDAO.findAllRunning();
            let alert_list = [];
            tasks.forEach(function(task) {
                task.result.forEach((item) => {
                    if(parseFloat(item.price) <= parseInt(task.maxPrice)){
                        let alertItem = {};
                        alertItem.task = task;
                        alertItem.item = item;
                        alert_list.push(alertItem);
                    }
                }); 
            });
            if(alert_list.length > 0){
                let mailPool = {};
                let alertPool = {};
                alert_list.forEach( alertItem => {
                    let receivers = alertItem.task.receivers;
                    if(!receivers || receivers.length === 0){
                        receivers = receiverDAO.findAll();
                    }
                    receivers.forEach(receiver => {
                        if(!mailPool[receiver.mail]){
                            mailPool[receiver.mail] = [];
                        }
                        mailPool[receiver.mail].push(alertItem);
                    });
                });
                mailSender.send(mailPool);
            } 
        }).catch( err =>{
            console.error('execute automation failed');
        });
    };
}

module.exports = new AutomationController();