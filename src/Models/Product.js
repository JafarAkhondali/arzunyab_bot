const Mongoose = require('mongoose');
const Util = require('util');
const BaseModel = require('./BaseModel');

/**
 * a Product which is for sale with special offer on it
 * @class Product
 * */

class Product extends Mongoose.Schema{
    /**
     *  @constructs
     *  @extends Mongoose.Schema
     *  @param {string} id Id of the product, Comes in SellerName+id format
     *  @param {string} FaName Persian Name of the product
     *  @param {string} EnName English Name of the product
     *  @param {string} FullName Composite name of product, used in search for best result
     *  @param {string} url Full url of the product
     *  @param {Number} normalPrice NormalPrice of product
     *  @param {number} currentPrice Current price of Product
     *  @param {number} discountPercentage Discount percentage of the price of the Product
     *  @param {number} discountValue Discount value of price of Product
     *  @param {string} seller Seller name
     *  @param {string} details Details of the product
     *  @param {string[]} thumbnails Thumbnails of the product
     *  @param {string[]} images Full urls of Images
     *  @param {bool} isExists Determines whether the products is available or not
     *  @param {date} StartDateTime DateTime of when this product promotion started
     *  @param {date} EndDateTime DateTime of when this product promotion started
     *  @property {date} createdAt DateTime to show date of creation
     *  @property {date} updatedAt DateTime to show last time of change
     *
     */
    constructor(){
        super({
            id: String,
            FaName: String,
            EnName: String,
            FullName:String,
            url: String,
            normalPrice: Number,
            currentPrice: Number,
            discountPercentage: Number,
            discountValue: Number,
            seller: String,
            details: [String],
            thumbnails: [String],
            images: [String],
            isExists: Boolean,
            StartDateTime: Date,
            EndDateTime: Date,
        }, {
            timestamps: true
        })
    }
    
    searchUsers(){
        return new Promise((ok,no)=>{
            try{
                let users = 
                ok()
            }catch (e){
                no(e.message)
            }
        });
    }



}

try{
    Util.inherits(BaseModel, Product);
    module.exports = Mongoose.model('Product',new Product);
}catch (e){
    elog(e)
}