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
        [Strings.AboutMe],
    ],
    MENU_CANCEL = [
        [Strings.Back]
    ]

    ;


//=================[Flows]======================
//This functions will show the flows of the app
const AddProductFlow = new WizardScene('AddProductFlow',
    (ctx) => {
        ctx.reply("بزار ببینم واست چی پیدا میشه کاکو");
        Product.searchTitle(ctx.message.text).then((res, err)=> {
            if (err)
                elog(err);
            if (err || res.length === 0) {
                ctx.reply(" شت 😐 این کالا الان تخفیف سفت نخورده، ولی من مرتب میگردم اگه پیدا کردم جنگی میگمت 😐🤚🏻")
            } else {
                let product = res[0];
                console.log(product);
                const replyOptions = Markup.inlineKeyboard([
                    Markup.urlButton('❤مشاهده اطلاعات کامل در دیجیکالا❤️', product.url)
                ]).extra()
                replyOptions.caption = product.getInfo();
                replyOptions.keyboard =[
                    [Strings.AddProduct],
                ]
                ctx.replyWithPhoto(product.images[0], replyOptions)

                ;
                //ctx.flow.wizard.next()
            }
        });
    },
    (ctx) => {
        ctx.reply('Done')
        ctx.flow.leave()
    }
);



class PoromotionTelegramBot{
    constructor(options){
        this.bot = new Telegraf(options);
        log("Bot Created",className)
    }

    test(){
        log("Entered Test")
    }


    Start(){
        log("Bot started",className)
        // this.bot.keyboard([
        //     KEYBOARD.ADD_PRODUCT,
        //     KEYBOARD.SHOW_RANDOM_PRODUCT,
        //     KEYBOARD.SHOW_ABOUTUS
        // ]);

        // this.bot.command('start').invoke((ctx)=> {
        //     log("New user started",className)
        //     return ctx.sendMessage('سلام\n' +
        //         '\nکافیه به من بگی چی میخوای!' +
        //          '\nمن  هر روز برات توی تمام فروشگاه های معروف مثل دیجیکالا و بامیلو میگردم')
        // }).keyboard([
        //     KEYBOARD.ADD_PRODUCT,
        //     KEYBOARD.SHOW_RANDOM_PRODUCT,
        //     KEYBOARD.SHOW_ABOUTUS
        // ]);
        const bot = this.bot;

        bot.command('/start', ({from,reply}) => {
            //Add user in database, if not exists
            let user = new User();
            user.id = from.id;
            user.is_bot = from.is_bot;
            user.username = from.username;
            user.first_name = from.first_name;
            user.last_name = from.last_name;
            // user.save(function (err, user) {
            //     if (err) return console.error(err);
            //     log("Saved!")
            //     log(user)
            // });
            User.findOneAndUpdate({id: from.id}, user, { upsert: true }).then((err, doc)=>{
                if(err){
                    log("Something wrong ");
                }
                log("Done saving");
            });

            return reply(Strings.welcome(from.first_name),
                Markup.keyboard(MENU_WELCOME)
                    .oneTime()
                    .resize()
                    .extra()
            )
        })

        bot.hears(Strings.Back, ({reply}) => {
            return reply(Strings.Ok,
                Markup.keyboard(MENU_WELCOME)
                    .oneTime()
                    .resize()
                    .extra()
            )
        })


        bot.hears(Strings.AddProduct, ({from,ctx,reply}) => {
            const flow = new TelegrafFlow([AddProductFlow], {defaultScene: 'AddProductFlow'})
            bot.use(flow.middleware())
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
