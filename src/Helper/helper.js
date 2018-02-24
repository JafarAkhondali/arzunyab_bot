/**
 * @module helper
 * */

/**
 * @param {string} key name of the key used in env
 * @param {Object} def value to use if key was empty
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
    let msg = `[${date}][${type}]${from}: `;
    if (ENV("DEBUG",true)){
        if (type == 'info') {
            console.log(msg);
            console.dir(message, {depth: 1});
        }
        else if(type =='error'){
            console.error(msg+message);
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


const escapeToRegex = (str)=>{
    let escaped = escape(str).replace(/%/g,'-\\');
    if (escaped.charAt(0)=="-")
        escaped = escaped.substring(1)
    escaped = "["+escaped+"]";
    return escaped;
}

/**
 * Used for convert Arabic characters to Persian
 *
 * @api private
 * @method _arabicChar
 * @param {String} value
 * @return {Object} PersianJs Object
 */
function ToPersian(value) {
    if (!value) {
        return;
    }
    var arabicChars = ["ي", "ك", "‍", "دِ", "بِ", "زِ", "ذِ", "ِشِ", "ِسِ", "‌", "ى"],
        persianChars = ["ی", "ک", "", "د", "ب", "ز", "ذ", "ش", "س", "", "ی"];

    for (var i = 0, charsLen = arabicChars.length; i < charsLen; i++) {
        value = value.replace(new RegExp(arabicChars[i], "g"), persianChars[i]);
    }
    return value;
}




module.exports = function () {
    this.ENV = ENV;
    this.log = log;
    this.elog = elog;
    this.escapeToRegex = escapeToRegex ;
    this.ToPersian = ToPersian;
}



const DotEnv = require('dotenv'); //Load .env values
const result = DotEnv.config();//Read the config from .env file
if (result.error) {
    elog(result.error.message);
}