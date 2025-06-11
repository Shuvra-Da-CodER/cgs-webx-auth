const userModel=require('./user.model')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')

module.exports.authUser=async (req,res,next)=>{
    //jwt token is either found in the cookie or in the header
    const token= req.cookies.token || req.headers.authorization?.split(' ')[1];
    //Authorization: Bearer eyJhbGciOi...
    //split(' ')[1] splits the string into ['Bearer', 'eyJhbGciOi...'] and extracts the token part.

    if(!token){
        return res.status(401).json({message: 'Unauthorized'});
    }

    try{
        //decode the token
        const decoded =jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded token:", decoded);
        //find the user by id
        const user =await userModel.findById(decoded._id);
        console.log(user)
        req.user=user;
        return next();

    } catch(err){
        return res.status(401).json({message: 'Unauthorized'});
    }
}