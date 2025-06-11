const userModel=require('./user.model');
const userService=require('./user.service');
const {validationResult}=require('express-validator');

module.exports.registerUser= async (req,res,next)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }
    const {username,password,description}=req.body;

    const existingUser=await userModel.findOne({username});
    if(existingUser){
        return res.status(400).json({message:'User already exists'})
    }
    
    const hashedPassword= await userModel.hashPassword(password)
    const user=await userService.createUser({
        username,
        password: hashedPassword,
        description
    });
    const token=user.generateAuth();
    
    return res.status(200).json({message:'User created'})
}

module.exports.loginUser=async (req,res,next)=>{
    const errors=validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const {username,password}=req.body;
    const user= await userModel.findOne({username}).select('+password')
    if(!user){
        return res.status(401).json({message:'Invalid email or password'})
    }
    const isMatch=await user.comparePassword(password);
    if (!isMatch){
        return res.status(401).json({message: 'Invalid email or password'});
    }
    const token = user.generateAuth();
    res.cookie('token', token);
    res.status(200).json({token,user});

}

module.exports.getProfile=async(req,res,next)=>{
    const { username, description } = req.user;
    return res.status(200).json({ username:username, description:description });
}

module.exports.updateProfile=async (req,res,next)=>{
    const {description}=req.body;
    const user=req.user;
    if(!description || description.length < 6){
        return res.status(400).json({message: 'Description must be at least 6 characters long'});
    }
    user.description=description;
    await user.save();
    return res.status(200).json({message: 'Profile updated successfully'});
}