var webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;

var proxy = require('selenium-webdriver/proxy');

var phantomjs = require('./phantomCapability');
var taskDAO = require('../database/dao/TaskDAO');
var resultDAO = require('../database/dao/ResultDAO');
var buyDAO = require('../database/dao/BuyDAO');
var accountDAO = require('../database/dao/AccountDAO');

function Automation() {
    this.driver = null;
    let self = this;
    let steam = accountDAO.getSteamAccount();
    this.execute = function (tasks,date) {
        return new Promise((resolve, reject) => {
            this.driver = new webdriver.Builder()
                //.forBrowser('chrome')
                .withCapabilities(phantomjs)
                //.setProxy(proxy.manual({ http: 'web-proxy.jpn.hp.com:8080' }))
                .build();
            doAsyncSeries(tasks).then( ()=> {
                this.driver.quit();
                resolve();
            }).catch(err=>{
                console.error('search weapons failed');
                this.driver.quit();
                reject();
            });
            function doAsyncSeries(tasks) {
                return tasks.reduce(function (promise, task) {
                    return promise.then(function (result) {
                        return self.watch(task,date);
                    });
                },self.login());
            }
        });
    };

    this.watch = function(task,date) {
        return new Promise( (resolve, reject) => {
            let results = [];
            task.url = encodeURI(task.url);
            this.driver.get(task.url);
            this.driver.findElements(By.css('div.mod-hotEquipment')).then(elems => {
                doAsyncSeries(elems).then( ()=> {
                    if(results && results.length > 0){
                        results.forEach(function(result) {
                            result["task_id"] = task._id;
                            resultDAO.add(result);
                        });
                        let weapeonDetailUrl = results[0].href; 
                        self.getAskBuyInfo(weapeonDetailUrl).then(buyPriceInfo=>{
                            console.log(buyPriceInfo);
                            let item = {};
                            item["task_id"] = task._id;
                            item["buyPrices"] = buyPriceInfo;
                            item["date"] = date;
                            buyDAO.add(item);
                            resolve();
                        });
                    }else{
                        resolve();
                    }
                    
                }).catch( err => {
                    console.error('weapons were not found');
                    reject();
                });
                function doAsyncSeries(elements) {
                    return elements.reduce(function (promise, element) {
                        return promise.then(function (result) {
                            return analysePrice(element);
                        });
                    },new Promise( (resolve, reject)=>{
                        resolve();
                    }));
                }

                function analysePrice(element) {
                    return new Promise( (resolve, reject) => {
                        element.findElement(By.css('div.mod-hotEquipment-bd > div.s3 > span > strong')).getAttribute('innerText').then(price => {
                            element.findElement(By.css('div.mod-hotEquipment-bd > div.s2 > span > b')).getAttribute('innerText').then(market_avg_price => {
                                element.findElement(By.css('div.mod-hotEquipment-hd > a:nth-child(1)')).getAttribute('href').then(href => {
                                    element.findElement(By.css('div.mod-hotEquipment-hd > span')).getAttribute('innerText').then(exterior => {
                                        exterior = exterior.split(':')[1];
                                        results.push({'price':price,'href':href,'marketAvgPrice':market_avg_price,'exterior':exterior,'date':date});
                                        console.log(price,href,market_avg_price,exterior);
                                        resolve();
                                    }).catch(err => {
                                        console.log('weapon\'s exterior was not found');
                                        reject();
                                    })                                                            
                                }).catch(err => {
                                    console.log('weapon\'s link was not found');
                                    reject();
                                });
                            }).catch(err => {
                                console.log('weapon\'s market avg price was not found');
                                reject();
                            });
                        }).catch(err => {
                            console.log('weapon\'s price was not found');
                            reject();
                        });
                    });                   
                }
            })
        });
    };

    this.getAskBuyInfo = function(url){
        return new Promise((resolve, reject)=>{
            console.log('start to get asks to buy info');
            this.driver.get(url);
            this.driver.wait(until.titleContains('CSGO饰品交易平台'), 10000).catch(err => {
                console.error('can not load weapeaon detail page');
                reject();
            });
            //
            this.driver.findElement(By.id('product_purchases')).click().catch( err => {
                console.error('load ask to buy tab failed');
                reject();
            });
            this.driver.wait(until.elementIsVisible(this.driver.findElement(By.id("purcheases_div"))),10000).catch(err => {
                console.error('can not load weapeaon detail table');
                reject();
            });
            this.driver.findElements(By.css("#js-dota2-sale > tbody > tr ")).then(elems => {
                let pendingHtml = elems.map(function (elem) {
                    return elem.findElement(By.css('td:nth-child(2)')).getAttribute('innerText');
                });
                Promise.all(pendingHtml).then(prices => {
                    let tmp = [];
                    prices.forEach(price => {
                        tmp.push(price.slice(1));
                    })
                    resolve(tmp.sort((a,b)=>{
                        return b-a;
                    }));
                }).catch(err => {
                    console.error('can not load ask to buy detail item price');
                    reject();
                });
            }).catch(err => {
                console.error('can not load ask to buy detail item');
                reject();
            });
        });
    };

    this.login = function() {
        return new Promise((resolve, reject) => {
            console.log('start to login');
            this.driver.get('https://www.igxe.cn/login');
            this.driver.wait(until.titleContains('Steam'), 10000).catch(err => {
                console.error('can not load steam login page');
                reject();
            });
            this.driver.findElement(By.id('steamAccountName')).sendKeys(steam.username).catch( err => {
                console.error('login failed');
                reject();
            } );
            this.driver.findElement(By.id('steamPassword')).sendKeys(steam.password).catch( err => {
                console.error('login failed');
                reject();
            });
            this.driver.findElement(By.id('imageLogin')).click().catch( err => {
                console.error('login failed');
                reject();
            });
            this.driver.wait(until.titleContains('csgo'), 30000).then(result => {
                console.log('login success');
                resolve(result);
            }).catch(err => {
                console.error('login failed');
                reject();
            });
        });
    }
}

module.exports = new Automation();

