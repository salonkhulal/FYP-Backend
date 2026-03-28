import mongoose from 'mongoose';
import validator from 'validator';
const { Schema, model, models } = mongoose;


const tempUserSchema=new Schema({
    email:{
        type:String,
        required:false,
        unique:true,
        validate:[validator.isEmail,'This should be an valid email']
    },
    userName:{
        type:String,
        required:false,
        unique:false
    },
    password:{
        type:String,
        required:false
    },
    confirmCode:{
        type:String,
        required:false
    },
    codeDueTime:{
        type:Date,
        required:false
    }
},{timestamps:true});

const TempUser=models?.TempUser||model("TempUser",tempUserSchema);
export default TempUser;