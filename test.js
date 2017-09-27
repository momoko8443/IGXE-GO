var taskDAO = require('./database/dao/TaskDAO');

var t = taskDAO.find('S1UlXc3SW');
console.log(t.result.filter(function(o){
    let from = (new Date(2017,8,10)).getTime();
    let to = (new Date(2017,9,10)).getTime();
    if(o.date >= from && o.date <= to ){
        return true;
    }
    return false
}));