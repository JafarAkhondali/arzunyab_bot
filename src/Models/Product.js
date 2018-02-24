const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const Util = require('util');
const {BaseModel,BaseSchema} = require('./BaseModel');

/**
 * a Product which is for sale with special offer on it
 * @class Product
 * */

// class Product extends Mongoose.Schema{
/**
 *  @constructs
 *  @extends Mongoose.Schema
 *  @param {string} id Id of the product, Comes in SellerName+id format
 *  @param {string} FaName Persian Name of the product
 *  @param {string} EnName English Name of the product
 *  @param {string} FullName Composite name of product, keyword base
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
 */
//     constructor(){
//         super({
//             id: String,
//             FaName: String,
//             EnName: String,
//             FullName: { type: String, text: true, index:true},
//             url: String,
//             normalPrice: Number,
//             currentPrice: Number,
//             discountPercentage: Number,
//             discountValue: Number,
//             seller: String,
//             details: [String],
//             thumbnails: [String],
//             images: [String],
//             isExists: Boolean,
//             StartDateTime: Date,
//             EndDateTime: Date,
//         }, {
//             timestamps: true
//         })
//     }
//
//     searchUsers(){
//         return new Promise((ok,no)=>{
//             try{
//                 let users =
//                 ok()
//             }catch (e){
//                 no(e.message)
//             }
//         });
//     }
// }

try{
    const ProductSchema = new Schema({
        id: String,
        FaName: String,
        EnName: String,
        FullName: { type: String},
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
    });
    ProductSchema.index({FaName:'text',EnName:'text'});

    ProductSchema.statics ={
        searchTitle:function(title){
            return this.find({$text: {$search: title}})
                .limit(1)
        }
    }
    ProductSchema.methods ={
        getInfo: function(){
            const text =`نام محصول: ${this.FaName || ''}
            ${this.EnName || ''}
توضیحات:  
${this.details[0] || ''}
            `;
            return text;
        }
    }

    const Product = Mongoose.model('Product',ProductSchema);
    module.exports = Product;
}catch (e){
    elog(e,"Product constructor")
}