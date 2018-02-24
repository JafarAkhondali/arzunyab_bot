/** Class contains all strings in application. */

class Strings {
    /**
     * Get the string for welcome.
     * @param {string} user_name name of the user
     * @return {string} String for welcome message.
     */
    static welcome(user_name){
        return `سلام ${user_name} جان
        چطوری؟؟
 دیجی آفبات هستم 🤖
کارم اینه که بهم یه اسم بدی، و من هر روز برات توی پیشنهاد های ویژه ی فروشگاه های معروف مثل دیجیکالا و بامیلو دنبال اون اسم میگردم
     اگه کالایی با اون اسم پیدا کردم خودم بهت پیام میدم 🤗   
     
    `;
    }


    /**
     * @return {string}
     */
    static get ICanSearch(){
        return `یه تیکه از اسم محصولی که دنبالشی رو بگو (انگلیسی یا فارسی فرقی نمیکنه)`;
    }

    /**
     * @return {string}
     */
    static get HeDontWant(){
        return `خب نخواه 😐 به کفشم 😐 خودت پیام دادی، من که زورت نکردم!`;
    }

    /**
     * @return {string}
     */
    static get Back(){
        return 'نمیخوام😐 🔙';
    }

    /**
     * @return {string}
     */
    static get AddProduct(){
        return '🔍 جستجو کالا جدید 🔎';
    }

    /**
     * @return {string}
     */
    static get ShowRandomProduct(){
        return '🎁 همینجوری یچیزی نشون بده 🎁';
    }

    /**
     * @return {string}
     */
    static get ShowMyProducts(){
        return '📦 دیدن کالاهای من 📦';
    }

    /**
     * @return {string}
     */
    static get AboutMe(){
        return 'من کیم؟ اینجا کجاس؟ کی منو نوشته؟ 😐';
    }

    /**
     * @return {string}
     */
    static get LetMeSeeWhatCanIFind(){
        return "بزار ببینم واست چی پیدا میشه کاکو";
    }


    /**
     * @return {string}
     */
    static get ProductNotAvailbleNow(){
        return " شت 😐 این کالا الان تخفیف سفت نخورده، ولی من مرتب میگردم اگه پیدا کردم جنگی میگمت 😐🤚🏻";
    }


    /**
     * @return {string}
     */
    static get FinishedFindingArticles(){
        return `ناموسا اوردت؟ 😐 
بچه جنوب ایطور بات مینویسه‌ 😐         
        `;
    }


    /**
     * @return {string}
     */
    static ViewProduct(seller) {
        return `❤مشاهده اطلاعات کامل در ${seller}❤️`
    }
}

module.exports = Strings; 