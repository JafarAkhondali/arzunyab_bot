const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const Util = require('util');

/**
 * BaseModel for future built-in features in Models
 * @class BaseModel
 * */
// class BaseModel extends Mongoose.Schema{
//     constructor(){
//         super({})
//     }
// }
const BaseSchema = new Schema({});
const BaseModel = Mongoose.model('BaseModel', BaseSchema);

module.exports.BaseSchema = BaseSchema;
module.exports.BaseModel = BaseModel;