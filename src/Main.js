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
    Promise = require('promise'), // Promises implementation in Node
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
    let products = [];
    //Get promted products as json from API
    let json = await Rp({
        uri: digiKalaOffUrl,
        json: true
    });

    for (p_fulljson of json["responses"][0]["hits"]["hits"]){
        let p_json = p_fulljson['_source'];
        let p = new Product({
            id: p_json["ProductId"],
            name: p_json["FaTitle"],
            url: DigiKalaURL+"/Product/DKP-"+p_json["ProductId"],
            normalPrice: p_json["Price"],
            currentPrice: p_json["Price"] - p_json["Discount"],
            discountPercentage: Math.floor(((p_json["Price"] - p_json["Discount"])/p_json["Price"])*100),
            discountValue: p_json["Discount"],
            seller: "دیجی کالا",
            details: [p_json["KeyFeatures"]],
            thumbnails:[DigiKalaImagesUrl +  p_json['ProductImagePath'].replace("Original","220") ],
            images:[DigiKalaImagesUrl + p_json['ProductImagePath']],
            StartDateTime: p_json['StartDateTime'],
            EndDateTime: p_json['EndDateTime'],
        });
        products.push(p);
    }
    return products;
};

/**
 * @return {Promise<Product[]>} A Promise that contains all captured Products
 */
const getNewProducts = () => {
    return new Promise((ok,no)=>{ //Create a new promise
        let producst = []; //products storage
        getDigiKalaProducts().then((data,err)=>{ //get Products from digikala and appends it to var
            if (!err){
                producst.push(...data)
            }
            ok(producst);
        });
    });
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
// bot.command('show_all').answer((ct=>{
//     getNewProducts.map(()=>{
//         ct.sendMessage("Hi <3")
//     })
// }));

try{
    getDigiKalaProducts().then((ok,no)=>{
        console.log(ok)
    });
}catch (e){
    console.error(`Error: ${e.message}`)
}
//getNewProducts()
/*
 Todo:Save data in mongo using Mongoose
 Todo:Cron job or timer for jobs
 Todo:Add Bamiloo products
 */

 