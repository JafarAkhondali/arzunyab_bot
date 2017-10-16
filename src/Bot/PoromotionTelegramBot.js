const Telegraf = require('telegraf') // An stateful library for working with Telegram api
const { Extra, Markup, Router,memorySession } = require('telegraf')
const Strings = require('../Strings/app-strings')
const TelegrafFlow = require('telegraf-flow')
const { WizardScene } = TelegrafFlow

/**
 * Logic of Telegram bot for interactive communication with user and controller commands
 * @class Product
 * */

//Currently ES6 lacks in const Variables for classes, So i'll just put them outside
const
    KEYBOARD = {
        "HOME": 'خانه',
    },
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
        ctx.reply('Step 1')
        ctx.flow.wizard.next()
    },
    (ctx) => {
        if (ctx.message && ctx.message.text !== 'ok') {
            return ctx.replyWithMarkdown('Send `ok`')
        }
        ctx.reply('Step 2 ')
        ctx.flow.wizard.next()
    },
    (ctx) => {
        ctx.reply('Step 3')
        ctx.flow.wizard.next()
    },
    (ctx) => {
        ctx.reply('Step 4')
        ctx.flow.wizard.next()
    },
    (ctx) => {
        ctx.reply('Done')
        ctx.flow.leave()
    }
)



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
        //
        // this.bot.command('add_product').invoke((ctx) =>{
        //     log("Add Product",className);
        //     return ctx.sendMessage('دنبال کالا جدید میگردی؟ کافیه فقط بخشی از اسمش رو اینجا وارد کنی!\n انگلیسی یا فارسی هم مهم نیست :hugging:')
        // }).keyboard([
        //     KEYBOARD.BACK
        // ]);
        const bot = this.bot;

        bot.command('/start', ({from,reply}) => {
            //TODO: Add user in database here, if not exists
            log(from,className);
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
            return reply("یه تیکه از اسم کالات رو بگو  😊",
                Markup.keyboard(MENU_CANCEL)
                    .oneTime()
                    .resize()
                    .extra()
            )
        })


        bot.use(Telegraf.memorySession())
        bot.startPolling();
    }
}
module.exports = PoromotionTelegramBot;
