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
    BotBrother = require('bot-brother'), // An stateful library for working with Telegram api
    Promise = require('bluebird'), // Promises implementation in Node
    Q = require('q'), // Another promise implementation, different features
    FS = require("fs"), //Disk IO things
    DotEnv = require('dotenv'), //Load .env values
    Mongoose = require('mongoose'); // MongoDB object modeling



require("./Helper/helper.js")(); //Adds all functions in helper.js to current namespace


//=============Models================
const User = require("./Models/User");
const Product = require("./Models/Product");


// +--------------------------------+
// |          </Imports>            |
// +________________________________+

//|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-

// +--------------------------------+
// |          <Config>              |
// +________________________________+

//============[Telegram]============
const token = ENV("TELEGRAM_TOKEN"); // Bot api token
const pollingConfig = {
    interval: 0,
    timeout: 65
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
        return ok(products);
    })
};



/**
 * @return {Product[]} Promoted products in Bamiloo
 */
async function getBamilooProducts(){
    return new Promise( async (ok, no)=> {
        let products = ['asd','sad'];
        try{
            ok(products);
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
        Q.allSettled(allProducts).then((...arr)=>{});
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


let bot = BotBrother({
    key: token,
    sessionManager: BotBrother.sessionManager.memory(),
    polling: pollingConfig
});


// +--------------------------------+
// |           </Main>              |
// +________________________________+


//+--------------------------------+
//|         BotCommands            |
//+________________________________+
bot.command('hi').answer((ct=>{
    ct.sendMessage("Hi <3")
}));


const options = {
    db: { native_parser: true },
    user: MONGODB_USER,
    pass: MONGODB_PASSWORD,
    useMongoClient: true,
}
Mongoose.Promise = Promise;
Mongoose.connect(MONGODB_URI, options);
const db = Mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () =>{
    getDigiKalaProducts().then((products,no)=>{
        if (no){
            elog(e.message,"Main.js");
        }else{
            //products.map(product => product.save())
            log("Connection opened");
        }
    });
});
getNewProducts().then(ok=>{
    console.dir(ok, { depth: 3});
}).catch(msg=>{
    elog(msg)
});
//getNewProducts()
/*
 Todo:Save data in mongo using Mongoose
 Todo:Cron job or timer for jobs
 Todo:Add Bamiloo products
 */
