const Mongoose = require('mongoose');
const Util = require('util');
const Product = require('./Product');

/**
 * Class ExpiredProduct Collection for saving unused products
 * @extends Product
 *
 *
 */

class ExpiredProducts extends Mongoose.Schema{
    
}


try{
    Util.inherits(Product, ExpiredProducts);
    module.exports = Mongoose.model('ExpiredProducts',new ExpiredProducts);
}catch (e){
    elog(e)
}