const Telegraf = require('telegraf'); // An stateful library for working with Telegram api
const { Extra, Markup, Router,session } = require('telegraf');
const Strings = require('../Strings/app-strings');
const TelegrafFlow = require('telegraf-flow');
const { WizardScene } = TelegrafFlow;
const User = require('../Models/User');
const Product = require('../Models/Product');
/**
 * Logic of Telegram bot for interactive communication with user and controller commands
 * @class Product
 * */

//Currently ES6 lacks in const Variables for classes, So i'll just put them outside
const
    className = "PromotionTelegramBot",
    MENU_WELCOME = [
        [Strings.AddProduct],
        [Strings.ShowRandomProduct],
        [Strings.ShowMyProducts],
        [Strings.AboutMe],
    ],
    MENU_CANCEL = [
        [Strings.Back]
    ]

    ;







function ShowProductInfo(ctx, product, keyboardCallBack) {
    const dafuq = product.getInfo();
    const replyOptions = Markup.inlineKeyboard([
        Markup.urlButton(Strings.ViewProduct(product.seller), product.url)
    ]).extra();

    ctx.replyWithPhoto(product.images[0], replyOptions).then((ok,no)=>{
        if (ok){
            ctx.reply(dafuq ,Telegraf.Extra
                .markdown()
                .markup(keyboardCallBack));
        }
    });
}






//=================[Flows]======================
//This functions will show the flows of the app

const AddProductFlow = new WizardScene('AddProductFlow',
    (ctx) => {
        // if (!(ctx.message && ctx.message.text)){
        //     return;
        // }
        if (ctx.message.text == "حله ❤️"){
            ctx.flow.leave();
            return ctx.reply(Strings.FinishedFindingArticles);
        }
        // log(ctx.message.text)
        ctx.reply(Strings.LetMeSeeWhatCanIFind);
        Product.searchTitle(ctx.message.text).then((res, err)=> {
            if (err)
                elog(err);
            if (err || res.length === 0) {
                ctx.reply(Strings.ProductNotAvailbleNow);
            } else {
                let product = res[0];
                ShowProductInfo(ctx, product,(m) => m.keyboard([
                    m.callbackButton('حله ❤️','solved'),
                    m.callbackButton('دیگه چی؟ 😐','else')
                ]).resize());
            }
        });



    }//,
    // (ctx) => {
    //     ctx.flow.leave();
    // }
);



class PoromotionTelegramBot{
    constructor(options){
        this.bot = new Telegraf(options);
        log("Bot Created",className)
        this.ctx=null;
    }

    test(){
        log("Entered Test")
    }


    Start(){
        log("Bot started",className)
        const bot = this.bot;


        bot.command('/start', ({from,reply}) => {
            //Add user in database, if not exists
            let user = new User();
            user.id = from.id;
            user.is_bot = from.is_bot;
            user.username = from.username;
            user.first_name = from.first_name;
            user.last_name = from.last_name;

            User.findOneAndUpdate({id: from.id}, user, { upsert: true }).then((err, doc)=>{
                if(err){
                    elog("Something wrong :|" + err,"Create User ");
                }else
                    log("User saved");
            });

            return reply(Strings.welcome(from.first_name),
                Markup.keyboard(MENU_WELCOME)
                    .oneTime()
                    .resize()
                    .extra()
            )
        })



        bot.hears(Strings.Back, ({reply}) => {
            return reply(Strings.HeDontWant,
                Markup.keyboard(MENU_WELCOME)
                    .oneTime()
                    .resize()
                    .extra()
            )
        })

        bot.hears("حله ❤️", ({reply}) => {
            return reply(Strings.FinishedFindingArticles,
                Markup.keyboard(MENU_WELCOME)
                    .oneTime()
                    .resize()
                    .extra()
            )
        });

        bot.hears([Strings.ShowRandomProduct,"دیگه چی؟ 😐"], (ctx) => {
            Product.aggregate([{$sample: { size:1 }}]).then((ok,no)=>{
                if (ok){
                    let product = ok[0];
                    Product.findById(product._id).then((finded, failed)=>{
                        ShowProductInfo(ctx, finded,(m) => m.keyboard([
                            m.callbackButton('حله ❤️','solved'),
                            m.callbackButton('دیگه چی؟ 😐',Strings.ShowRandomProduct)
                        ]).resize());


                        return ctx.reply(Strings.LetMeSeeWhatCanIFind)
                    });

                }
            });
        })


        bot.hears(Strings.AddProduct, ({from,ctx,reply}) => {
            const flow = new TelegrafFlow([AddProductFlow], {defaultScene: 'AddProductFlow'});
            bot.use(flow.middleware());
            return reply(Strings.ICanSearch,
                Markup.keyboard(MENU_CANCEL)
                    .oneTime()
                    .resize()
                    .extra()
            )
        })







        bot.use(Telegraf.session())
        bot.startPolling();
    }
}
module.exports = PoromotionTelegramBot;
