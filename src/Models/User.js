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
     *  @param {number} chatId chatId in Telegram
     *  @param {string} username of User in Telegram
     *  @param {string} first_name of User in Telegram
     *  @param {string} last_name of User in Telegram
     *  @param {string} mob Tell of User in Telegram
     *  @param {string[]} wantedProducts Ids of Products which user is looking for(not _id of mongo)
     *  @param {string[]} foundedProducts Ids of Products which user has founded(not _id of mongo)
     *  @param {boolean} isLooking determines if user is currently looking for a product
     *  @param {boolean} isBot is user a bot?
     */
    constructor(){
        super({
            id: String,
            chatId: String,
            username: String,
            first_name: String,
            last_name: String,
            mob: String,
            wantedProducts: [String],
            foundedProducts: [String],
            isLooking:Boolean,
            isBot:Boolean
        })
    }
}
module.exports = Mongoose.model('User',new User);