import mongoose ,{Document,mongo,Schema} from 'mongoose'

export interface Message extends Document {
    content:string
    createdAt:Date
}

export interface User extends Document {
    username:string,
    email:string
    password:string
    verifyCode:string
    verifyCodeExpiry:Date
    isVerified:boolean
    isAcceptingMessage:boolean
    messages:Array<Message>
}

const MessageSchema:Schema<Message> = new Schema({
    createdAt:{
        type:Date,
        required:true,
        default:Date.now
        
    },
    content:{
        type:String,
        required:true
        
    }
})
const UserSchema = new Schema<User>({
    username:{
        type:String,
        required:[true,"Username is required"],
        unique:true,
        trim:true,
    },
    verifyCode:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        match:[/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,"Please use a valid email address"],
    },
    password:{
        type:String,
        required:true
    },
    verifyCodeExpiry:{
        type:Date,
        required:true
    },
    isVerified:{
        type:Boolean,
        required:true,
        default:false

    },
    isAcceptingMessage:{
        type:Boolean,
        required:true,
        default:true
    },
    messages:[MessageSchema]  // we passed MessageSchema(not Message) because type accpets a Schema like {type:new Schema({})}

    

})

const UserModel =(mongoose.models?.User as mongoose.Model<User>) || mongoose.model<User>('User', UserSchema);

export default UserModel;