var taskDAO = require('../database/dao/TaskDAO');
var automation = require('../selenium/Automation');
var mailSender = require('../mail/MailSender');
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
            tasks.forEach(function(task) {
                let maxPrice = task.maxPrice;
                let alert_list = [];
                task.result.forEach((item) => {
                    if(parseFloat(item.price) <= parseInt(maxPrice)){
                        alert_list.push(item);
                    }
                });
                if(alert_list.length > 0){
                    mailSender.send(alert_list,task.receivers);
                }  
            });
        }).catch( err =>{
            console.error('execute automation failed');
        });
    };
}

module.exports = new AutomationController();