const mongoose=require('mongoose')

const  userSchema=new mongoose.Schema({
    googleId:{type:String,default:null},
    email:{type:String,required: true,unique:true},
    password:{type:String,default:null},
    displayName: { type: String, required: true },
    photo:{type:String},
    userType:{
        type:String,
        enum:['farmer','customer'],
        required:true,

    },
    farmDetails:{
        type:{
            farmName:{type:String,default:null},
            state:{type:String,default:null},
            district:{type:String,default:null},
           crops:[{type:String}] 
        },
        default:null,
    },
    createdAt:{type:Date,default:Date.now}
})


module.exports=mongoose.model('User',userSchema)