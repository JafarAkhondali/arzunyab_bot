const Telegraf = require('telegraf'); // An stateful library for working with Telegram api
const { Extra, Markup } = require('telegraf');
const Strings = require('../Strings/app-strings');

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
    ]
    ;


class PoromotionTelegramBot{
    constructor(options){
        this.bot = new Telegraf(options);
        log("Bot Created",className)
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
            return reply(Strings.welcome(from.first_name),
                Markup.keyboard(MENU_WELCOME)
                    .oneTime()
                    .resize()
                    .extra()
            )
        })

        bot.hears(Strings.Back, (ctx) => {
            return reply(Strings.Cancel,
                Markup.keyboard(MENU_WELCOME)
                    .oneTime()
                    .resize()
                    .extra()
            )
        })


        bot.hears(Strings.AddProduct, ({from,ctx}) => {
            return reply(Strings.Back,
                Markup.keyboard(MENU_WELCOME)
                    .oneTime()
                    .resize()
                    .extra()
            )
        })


        bot.startPolling();
    }
}
module.exports = PoromotionTelegramBot;
