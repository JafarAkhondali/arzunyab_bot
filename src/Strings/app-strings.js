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


    static get Cancel(){
        return `اکی 😊`;
    }
    
    static get Back(){
        return 'بیخیال 🔙';
    }
    
    static get AddProduct(){
        return '🔍 جستجو کالا جدید 🔎';
    }
    
    static get ShowRandomProduct(){
        return '🎁 همینجوری یچیزی نشون بده 🎁';
    }
    
    static get ShowMyProducts(){
        return '📦 دیدن کالاهای من 📦';
    }
    
    static get AboutMe(){
        return 'کی منو نوشته؟ کُدم کو؟ 😐';
    }
    
}

module.exports = Strings; 