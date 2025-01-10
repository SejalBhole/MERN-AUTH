//this file stores all user data so that first we need to create schema

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    verifyOtp :{
        type: String,
        default: ''
    },
    verifyOtpExpireAt :{
        type: Number,
        default: 0
    },
    isAccountVerified :{
        type: Boolean,
        default: false
    },
    resetOtp :{
        type: String,
        default: ''
    },
    resetOtpExpireAt :{
        type: Number,
        default: 0
    },
    //add any other fields you want to store for the user here
})

const userModel = mongoose.models.user || mongoose.model('user', userSchema);   //will create a new model named user with the help of userSchema if not present

export default userModel;