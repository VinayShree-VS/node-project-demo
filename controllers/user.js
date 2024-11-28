const {User} = require("../models/user");
const bcrypt = require('bcryptjs');

const handleGetAllUsers = async (req,res) =>{
    let users = await User.find({},"-roles -_tokens -__v -password -confPassword").lean(); // Exclude fields you don't want to send res;
    // let users = await User.User.aggregate([
    //     { $project: { roles: 0, _tokens: 0 } } //  Exclude fields you don't want to send res
    // ]).lean();
    
    return res.status(200).send({code:200,data:users}).json();
};

const handleCreateUser = async (req,res)=>{
    if(!req.body){
        return res.status(400).send({code:400,message:"Internal Server Error"});
    };
    
    try{
        const {password,confPassword} = req.body;
        if(password.toLowerCase() !== confPassword.toLowerCase()){
            return res.status(400).send({code:400,message:"Password or Confirm password not matched"});
        }else{
            const hashPassword = await bcrypt.hash(password, 10);
            const hashConfPassword = await bcrypt.hash(confPassword, 10);
            const profileImage = req.file?req.file.path:null;
            
            let user = await User.create({...req.body,password:hashPassword,confPassword:hashConfPassword,profileImage});
            let userData = user.toJSON();
            delete userData._tokens;
            delete userData.password;
            delete userData.confPassword;
            delete userData.roles;

            return res.status(200).send({code:200,message:"User Created",data:userData});
        };
    }catch (error) {
        if (error.name === "ValidationError") {
            // Handle missing required fields or other validation issues
            const fieldErrors = Object.keys(error.errors).map(key => ({field: key,message: error.errors[key].message}));
            return res.status(400).send({ code: 400,message: "Validation Error",errors: fieldErrors,});
        } else if (error.name === "TypeError") {
            // Handle TypeErrors specifically
            console.error("TypeError:", error.message);
            return res.status(400).send({ code: 400, message: "TypeError encountered. Please check your request format.", details: error.message});
        }else if (error.code === 11000) {
            // Handle duplicate key error
            const key = Object.keys(error.keyPattern)[0];
            const value = error.keyValue[key];
            return res.status(400).send({ code: 400, message: `Duplicate key error: ${key} with value "${value}" already exists.`, field: key, value: value});
        } else {
            // Handle other server errors
            return res.status(500).send({ code: 500, message: "Internal Server Error" });
        }
    }
};

const handleUploadProfileImageById = async (req,res)=>{

    try{
        let user = await User.findById(req.params.id)
        if(!user){
            return res.status(404).send({status:404,message:'user not found'});
        }else{
            let updatedUser = await User.findOneAndUpdate({_id:req.params.id},{profileImage:req.file.path},{new:true}).lean();
            let profileImage = `${process.env.DEV_BASE_URL}/${updatedUser.profileImage}`
            return res.status(200).json({code:200,message:'Profile image updated successfully',data:{profileImage}});
        };
    }catch (error) {
        if (error.name === "ValidationError") {
            // Handle missing required fields or other validation issues
            const fieldErrors = Object.keys(error.errors).map(key => ({field: key,message: error.errors[key].message}));
            return res.status(400).send({ code: 400,message: "Validation Error",errors: fieldErrors,});
        } else if (error.name === "TypeError") {
            // Handle TypeErrors specifically
            console.error("TypeError:", error.message);
            return res.status(400).send({ code: 400, message: "TypeError encountered. Please check your request format.", details: error.message});
        }else if (error.code === 11000) {
            // Handle duplicate key error
            const key = Object.keys(error.keyPattern)[0];
            const value = error.keyValue[key];
            return res.status(400).send({ code: 400, message: `Duplicate key error: ${key} with value "${value}" already exists.`, field: key, value: value});
        } else {
            // Handle other server errors
            return res.status(500).send({ code: 500, message: "Internal Server Error" });
        }
    }
};

const handleGetUserById = async (req,res)=>{
    let user = await User.findById(req.params.id)
    if(!user){
        return res.status(404).send({status:404,message:'user not found'});
    }else{
        return res.status(200).send({code:200,message:'Data get successfully',data:user}).json();
    };
};

const handleUpdateUserById = async (req,res)=>{
    let user = await User.findByIdAndUpdate(req.params.id,req.body)
    return res.status(200).send({code:200,message:'User Updated',}).json();
};

const handleDeleteUserById = async (req,res)=>{
    let user = await User.findByIdAndDelete(req.params.id,req.body)
    return res.status(200).send({code:200,message:'User Deleted'}).json();
};

const handleUserLogin = async (req,res)=>{
    const { email, password } = req.body;
    const user = await User.findOne({email});
 
    if(!user){
       return res.status(400).send({code:400,message:'Invalid email or password'})
    }else{
        try{
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(400).json({ message: 'Invalid email or password' });
            };
            const token = user.generateToken();
            const userData = {
                firstName:user.firstName,
                lastName:user.lastName,
                email:user.email,
                _token:token
            };
            // let previousToken = userIsExist._tokens[userIsExist._tokens.length-1].token;
            await User.findOneAndUpdate({ email },{ $push: { _tokens: { token } }},{ upsert: true, new: true });
            return res.status(200).send({code:200,message:"User Logged In",data:userData}); 
       
        }catch(error){
            if (error.code === 11000) {
                const key = Object.keys(error.keyPattern)[0];
                const value = error.keyValue[key];
                return res.status(400).send({
                    message: `Duplicate key error: ${key} with value "${value}" already exists.`,
                    field: key,
                    value: value,
                });
            }else{
                res.status(500).send({ message: 'Internal Server Error' });
            };
        }
    }
};

module.exports = {handleGetAllUsers,handleCreateUser,handleGetUserById,handleUpdateUserById,handleDeleteUserById,handleUserLogin,handleUploadProfileImageById};