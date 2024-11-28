const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    firstName: { 
        type: String, 
        required: [true, "First name is required"] 
    },
    lastName: { 
        type: String, 
        required: [true, "Last name is required"] 
    },
    email: { 
        type: String, 
        required: [true, "Email is required"], unique: true 
    },
    password: { 
        type: String, 
        required: [true, "Password is required"]
    },
    confPassword: { 
        type: String, 
        required: [true, "Confirm password is required"] 
    },
    jobTitle:{
        type:String,
        required: [true, "Job Title is required"]
    },
    gender:{
        type:String,
        required: [true, "Gender is required"]
    },
    roles: {
        type: [String],
        default: ["Admin"]
    },
    _tokens:[
        {
            token: { type: String, required: true },
            createdAt: { type: Date, default: Date.now }
        },
    ],
    profileImage: {
        type: String,
        required: false,
        default: null
    }

},{timestamps:true,versionKey: false});

const userLoginSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    _tokens:[
        {
            token: { type: String, required: true },
            createdAt: { type: Date, default: Date.now }
        },
    ],
},{timestamps:true});

userSchema.methods.generateToken = function() {
    const user = this; 
    const jti = `${user._id}-${Date.now()}`;
    const payload = { userId: user._id,email: user.email,roles:user.roles,jti};
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY , {
        expiresIn: '1h',
    });
    return token;
};

const User = mongoose.model('user',userSchema);
const LoginUser = mongoose.model('loginUser',userLoginSchema);


module.exports = {User,LoginUser};