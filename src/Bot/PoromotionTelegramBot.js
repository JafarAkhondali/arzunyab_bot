const BotBrother = require('telegraf'); // An stateful library for working with Telegram api



/**
 * Logic of Telegram bot t
 * @class Product
 * */

//Currently ES6 lacks in const Variables for classes, So i'll just put them outside
const
    KEYBOARD = {
        "ADD_PRODUCT": [{'\xF0\x9F\x94\x8D	  جستجو کالا جدید': {go: 'add_product'}}],
        "SHOW_ALL_PRODUCTS": [{'📦 دیدن کالاها 📦': {go: 'show_all_products'}}],
        "SHOW_RANDOM_PRODUCT": [{'🎁 همینجوری یچیزی نشون بده 🎁': {go: 'show_random_product'}}],
        "SHOW_ABOUTUS": [{'من کیم؟اینجا کجاس؟ کی منو نوشته؟ 😐': {go: 'show_aboutus'}}],
        "HOME": [{'خانه': {go: 'home'}}],
        "BACK": [{'بیخیال': {go: '$back'}}]
    },
    className = "PromotionTelegramBot"
    ;


class PoromotionTelegramBot{
    constructor(options){
        this.bot = BotBrother(options);
    }

    Start(){
        // this.bot.keyboard([
        //     KEYBOARD.ADD_PRODUCT,
        //     KEYBOARD.SHOW_RANDOM_PRODUCT,
        //     KEYBOARD.SHOW_ABOUTUS
        // ]);
        
        this.bot.command('start').invoke((ctx)=> {
            log("New user started",className)
            return ctx.sendMessage('سلام\n' +
                '\nکافیه به من بگی چی میخوای!' +
                 '\nمن  هر روز برات توی تمام فروشگاه های معروف مثل دیجیکالا و بامیلو میگردم')
        }).keyboard([
            KEYBOARD.ADD_PRODUCT,
            KEYBOARD.SHOW_RANDOM_PRODUCT,
            KEYBOARD.SHOW_ABOUTUS
        ]);

        this.bot.command('add_product').invoke((ctx) =>{
            log("Add Product",className);
            return ctx.sendMessage('دنبال کالا جدید میگردی؟ کافیه فقط بخشی از اسمش رو اینجا وارد کنی!\n انگلیسی یا فارسی هم مهم نیست :hugging:')
        }).keyboard([
            KEYBOARD.BACK
        ]);

        // bot.command('page1').invoke(function (ctx) {
        //     bot.keyboard([
        //         [{'بیخیال': {go: 'add_product'}}],
        //         [{':two: مشاهده محصولات': {go: 'page2'}}],
        //         [{':three: نمایش کالا تصادفی': {go: 'page3'}}]
        //     ])
        //     return ctx.sendMessage('This is page 2')
        // })
        // bot.command('page2').keyboard([
        //     KEYBOARD.HOME,
        //     [{':two: مشاهده محصولات': {go: 'page2'}}],
        //     [{':three: نمایش کالا تصادفی': {go: 'page3'}}]
        // ])


    }
}
module.exports = PoromotionTelegramBot;
