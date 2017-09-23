/**
 * @module helper
 * */


const DotEnv = require('dotenv'); //Load .env values
const result = DotEnv.config();//Read the config from .env file
if (result.error) {
    elog(result.error.message);
}

/**
 * @param {string} key name of the key used in env
 * @param {string} def value to use if key was empty
 */
const ENV = (key,def)=>{
    let val = process.env[key];
    if (val =="" && def !==undefined){
        val = def;
    }
    return val;
}
//console.log(ENV("DEBUG"));



/**
 * Logs general data
 * @param {string} message Message of the log
 * @param {string} from Where event has been occurred at
 * @param {string} type logging
 */
const log = (message ,from="Somewhere",type="info") =>{
    let date = new Date().toISOString().replace('T', ' ').substr(0, 19);
    let msg = `[${date}][${type}]${from}: ${message}`;
    if (ENV("DEBUG",true)){
        if (type == 'info')
            console.log(JSON.stringify(msg, null, 4));
        else if(type =='error'){
            console.error(msg);
        }
    }
}

/**
 * Logs error
 * @param {string} message Message of log to print\store
 * @param {string} from of file error occurred at
 */
const elog = (message,from="Somewhere") =>{
    log(message, from,"error");
}


module.exports = function () {
    this.ENV = ENV;
    this.log = log;
    this.elog = elog;
}
