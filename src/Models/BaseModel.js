const Mongoose = require('mongoose');
/**
 * BaseModel for future built-in features in Models
 * @class BaseModel
 * */
class BaseModel extends Mongoose.Schema{
    constructor(){
        super({})
    }
}

module.exports = BaseModel;