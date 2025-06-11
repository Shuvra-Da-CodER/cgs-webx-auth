const mongoose=require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userSchema = new mongoose.Schema({
    
    username:{
        type: String,
        required: true,
        unique: true,
        minlength: [6, 'Email must be at least 6 characters long']
    },
    password:{
        type:String,
        required: true,
        select: false, // Do not return password by default
        minlength: [6, 'Password must be at least 6 characters long']
    },
    description:{
        type:String,
        required: true
    }
})

userSchema.statics.hashPassword=async function(password){
    const salt=await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}
//IF YOU WANT ACCESS TO this , DONT USE ARROW FUNCTIONS BECAUSE ARROW FUNCTIONS DO NOT BIND 'this'
userSchema.methods.generateAuth=function(){
    const token= jwt.sign({_id: this._id}, process.env.JWT_SECRET, { expiresIn: '24h' });
    return token;
}

userSchema.methods.comparePassword=async function(password) {
    return await bcrypt.compare(password, this.password);
}

const User = mongoose.model('User', userSchema);
module.exports = User;