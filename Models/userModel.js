const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isVendor:{
        type:Boolean, 
        default:false
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    seenNotifation:{
        type:Array,
        default:[]
    },
    unseenNotification:{
        type:Array,
        default:[]
    }
}, { timestamps: true });

const  users =mongoose.model('users',userSchema)

module.exports =users;
