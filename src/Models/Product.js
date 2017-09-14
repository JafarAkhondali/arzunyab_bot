const Mongoose = require('mongoose');
/**
 * a Product which can be for sale
 * @class Product
 * */

class Product extends Mongoose.Schema {
    /**
     *  @constructs
     *  @extends Mongoose.Schema
     *  @param {string} id Id of the product
     *  @param {string} name Name of the product
     *  @param {string} url Full url of the product
     *  @param {Number} normalPrice NormalPrice of product
     *  @param {number} currentPrice Current price of Product
     *  @param {number} discountPercentage Discount percentage of the price of the Product
     *  @param {number} discountValue Discount value of price of Product
     *  @param {string} seller Seller name
     *  @param {string} details Details of the product
     *  @param {string[]} thumbnails Thumbnails of the product
     *  @param {string[]} images Full urls of Images
     *
     *
     */
    constructor(){
        super({
            id: String,
            name: String,
            url: String,
            normalPrice: Number,
            currentPrice: Number,
            discountPercentage: Number,
            discountValue: Number,
            seller: String,
            details: [String],
            thumbnails: [String],
            images: [String],
            StartDateTime: Date,
            EndDateTime: Date,
            AddedDateTime:Date,
            isFinished:Date,
        })
    }
}
module.exports = Mongoose.model('Product',new Product);