import mongoose, {Document, Schema} from 'mongoose';
// mongoose ko TypeScript me use karne ke liye hum Document aur Schema import karte hain
export interface Message extends Document {
    content : string;
    createdAt : Date;
}
// message ke liye ek interface banaya hai jo  Document se extend karta hai means mongoose me yeh ek document hoga
//niche hamne message schema bnaya h means we are creating schema and data type is message
export const MessageSchema : Schema<Message> = new Schema({ //here hum schema define kar rahe hain jisme humne usko schema type diya h jo messaege interface se match karta hai
    content: {
        type: String,  //javascript me string type define karne ke liye hum "String" use karte hain aur typescript me string ko "string" likhte hain
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
})

export interface User extends Document {
    username : string;
    email : string;
    password : string;
    messages : Message[]; //user ke messages ka array hoga jiska type Message h
    verifyCode : string;
    verifyCodeExpiry : Date;
    isVerified:boolean;
    isAcceptingMessages : boolean;

}
const UserSchema : Schema<User> = new Schema({
    username:{
        type: String,
        required: [true, "Username is required"],// required true h lekin agr koi nhi bharta h to error me ham ye msg bhej denge direct isiliye dono ko likh diya h 
        trim : true,
        unique: true
    },
    email:{
        type: String,
        required: [true, "Email is required"],
        unique: true,
        match: [/.+\@.+\..+/, 'Please use a valid email address'], // yha ham regex(regular expression) ki help se match krenge ki jo email likha gya h uska pattern email type hi h ya kuchh bhi likhke bhej rha h 
    },
    password:{
        type:String,
        required:[true,"Password is Required"],
    },
    verifyCode:{
        type:String,
        required:[true,"Verification Code is Required"],
    },
    verifyCodeExpiry:{
        type:Date,
        required:[true,"Verify Code Expiry is Required"],
    },
    isVerified:{
        type:Boolean,
        default:false,
    },
    isAcceptingMessages:{
        type:Boolean,
        default:true,
    },
    messages:[MessageSchema]
})


// upr ye jo ham interface bnaye h ye ek trh ka class ya structure h jisme hamne user ke properties define kiye hain aur niche hamne user schema bnaya h jisme hamne uske data types aur validation rules define kiye hain (analogous to class and object in OOPs concept)



//now export models
export const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>('User', UserSchema);

// first parenthesis me hum check kar rahe hain ki mongoose.models.User exist karta h ya nhi agr karta h to use as mongoose.Model<User> typecast karke use kar lenge otherwise new model create kar lenge with name 'User' and schema UserSchema