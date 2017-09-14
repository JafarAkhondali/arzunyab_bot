const Mongoose = require('mongoose');
/**
 * a User represents a Telegram user
 * @class User
 * */

class User extends Mongoose.Schema {
    /**
     *  @constructs
     *  @extends Mongoose.Schema
     *  @param {number} id User id in Telegram
     *  @param {string} name of User in Telegram
     *  @param {string} mob Tell of User in Telegram
     */
    constructor(){
        super({
            id: String,
            name: String,
            mob: String,
            reason: String
        })
    }
}
module.exports = Mongoose.model('User',new User);