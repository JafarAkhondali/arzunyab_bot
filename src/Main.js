// +--------------------------------+
// |           <Imports>            |
// +________________________________+

//Third-party libraries
const
    XPath = require('xpath'), // XPath query executor library
    Cheerio = require('cheerio'), //Lets stick with cheer, XPath is not good for this part
    Dom = require('xmldom').DOMParser, // Dom parser from plain strings
    Request = require('request'), // Http Request helper
    Rp = require('request-promise'), //Request promise for node
    //R2 = require('r2'), //Successor of request
    Telegraf = require('telegraf'), // a Library for working with Telegram api
    Promise = require('bluebird'), // Promises implementation in Node
    Q = require('q'), // Another promise implementation, different features
    FS = require("fs"), //Disk IO things
    DotEnv = require('dotenv'), //Load .env values
    Mongoose = require('mongoose'); // MongoDB object modeling



//Application libraries

//=============[Helpers]================
require("./Helper/helper.js")(); //Adds all functions in helper.js to current namespace

//=============[Models]================
const
    User = require("./Models/User"),
    Product = require("./Models/Product")
    ;


//=============[Telegram Bot]================

const
    PoromotionTelegramBot = require('./Bot/PoromotionTelegramBot')
    ;

// +--------------------------------+
// |          </Imports>            |
// +________________________________+

//|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-

// +--------------------------------+
// |          <Config>              |
// +________________________________+

//============[Telegram]============
const PROMOTION_BOT_TOKEN = ENV("TELEGRAM_TOKEN"); // Bot api PROMOTION_BOT_TOKEN
const pollingConfig = {
    interval: 0,
    timeout: 60
};

//============[DigiKala]============
const
    DigiKalaURL = ENV('DigiKalaURL'),
    digiKalaOffUrl = ENV('DIGIKALA_OFF_URL'), //JSON of promoted products
    DigiKalaImagesUrl = ENV('DigiKalaImagesUrl');


//============[DataBase(Mongo)]============
const
    MONGODB_USER=ENV('MONGODB_USER'),
    MONGODB_PASSWORD=ENV('MONGODB_PASSWORD'),
    MONGODB_URI=ENV('MONGODB_URI')
    ;

// +--------------------------------+
// |         </Config>              |
// +________________________________+

//|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-

// +--------------------------------+
// |         <Functions>            |
// +________________________________+

/**
 * @return {Product[]} Offed products in DigiKala
 */
async function getDigiKalaProducts(){
    return new Promise( async (ok, no)=>{
        let products = [];
        try { //Get promoted products as json from API
            let json = await Rp({
                uri: digiKalaOffUrl,
                json: true
            });

            for (p_fulljson of json["responses"][0]["hits"]["hits"]) {
                let p_json = p_fulljson['_source'];
                let p = new Product({
                    id: "digikala_"+p_json["ProductId"],
                    FaName: p_json["FaTitle"],
                    EnName: p_json["EnTitle"],
                    FullName: p_json["FaTitle"] + p_json["EnTitle"],
                    url: DigiKalaURL + "/Product/DKP-" + p_json["ProductId"],
                    normalPrice: p_json["Price"],
                    currentPrice: p_json["Price"] - p_json["Discount"],
                    discountPercentage: Math.floor(((p_json["Price"] - p_json["Discount"]) / p_json["Price"]) * 100),
                    discountValue: p_json["Discount"],
                    seller: "دیجی کالا",
                    details: [p_json["KeyFeatures"]],
                    thumbnails: [DigiKalaImagesUrl + p_json['ProductImagePath'].replace("Original", "220")],
                    images: [DigiKalaImagesUrl + p_json['ProductImagePath']],
                    isExists: p_json['ExistStatus'] == 2,
                    StartDateTime: p_json['StartDateTime'],
                    EndDateTime: p_json['EndDateTime'],
                });
                products.push(p);
            }
        } catch (e) {
            no(e.message)
        }
        return ok({
            products:products,
            seller:'digikala'
        });
    })
};



/**
 * @return {Product[]} Promoted products in Bamiloo
 */
async function getBamilooProducts(){
    return new Promise( async (ok, no)=> {
        let products = ['asd','sad'];
        try{
            //TODO: Add Bamiloo products
            no("Method not implented yet");
            ok({
                products:products,
                seller:'bamiloo'
            });
        }catch(e){
            no(e.message)
        }
    });
}

/**
 * @return {Promise<Product[]>} A Promise that contains all captured Products
 */
const getNewProducts = async ()=>{
    return new Promise((ok, no)=>{
        let allProducts = [
            getDigiKalaProducts(),
            getBamilooProducts()
        ];
        //Promise me to call back, ok? <3
        Q.allSettled(allProducts).then((arr)=>{
            ok({
                ok:arr.filter(i=>i.state === 'fulfilled').map(i=>i.value),
                no:arr.filter(i=>i.state !== 'fulfilled').map(i=>i.reason)
            })
            // ok({
            //     ok:arr.filter(i=>i.state === 'fulfilled').map(i=>i.value),
            //     no:arr.filter( (i=>i.state !== 'fulfilled').map(i=>i.value))
            // })
        });
        // let all = Promise.all(allProducts.map(function (promise) {
        //     return promise.reflect();
        // })).filter(function(promise) {return promise.isFulfilled();})
        //     // or .then(promises => promises.filter(/*...*/))
        //     .then(function (data) {
        //         // only successful ones are available here...
        //         ok(all);
        //     });


    })
};

// +--------------------------------+
// |        </Functions>            |
// +________________________________+

//|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-


// +--------------------------------+
// |            <Main>              |
// +________________________________+




let bot = new PoromotionTelegramBot(PROMOTION_BOT_TOKEN);
bot.Start();

// +--------------------------------+
// |           </Main>              |
// +________________________________+


//+--------------------------------+
//|         BotCommands            |
//+________________________________+
// bot.command('hi').answer((ct=>{
//     if(ct.message["text"]=="back"){
//         log("IN BACK");
//         return ct.goParent();
//     }
//     else
//         return ct.sendMessage(ct.message["text"]);
// }));



const options = {
    db: { native_parser: true },
    useMongoClient: true,
}



Mongoose.Promise = Promise;
Mongoose.connect(MONGODB_URI, options);
const db = Mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () =>{
    log("connected");
    log("Downloading ...");
    getNewProducts().then(resultProducts=>{
        console.dir(resultProducts);
        log("Done downloading");

        resultProducts.ok.map(sellerProducts=>{
            let seller = sellerProducts.seller;
            sellerProducts.products.map(product=>{
                //product.searchUsers(); Todo Search user
            })
        })

    }).catch(msg=>{
        elog(msg)
    });

});

/*

 If user is searching for something new: TODO
    Search all products, then behave with it like other users TODO

 How to behave with other users: TODO
     Periodically do a crawling: TODO
         Perform a crawl to get all products in all sites
         Foreach Product:
             if Product id is duplicate in DB:
                 if product.exists:
                    Leave it
             elif:
                Move to trash
             elif:
                Add it to collection TODO
                Do a search for it in all users() TODO







 If user is searching for something new:
 Search all products, then behave with it like other users

 How to behave with other users:
 Periodically do a crawling:
 Perform a crawl to get all products in all sites
 Foreach Product:
 if Product id is duplicate in DB:
 if product.exists:
 Leave it
 elif:
 Move to trash
 elif:
 Add it to collection
 Do a search for it in all users()
















 Todo: Save data in mongo using Mongoose
 Todo: Delete old products, Add new products, then search for item's user hasn't found already
 Todo: Cron job or timer for jobs
 */
