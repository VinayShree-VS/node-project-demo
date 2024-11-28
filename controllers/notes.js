const Note = require("../models/notes");

const handleCreateNote = async (req, res) => {
    const { title, description } = req.body;

    if (!title || !description) {
        return res.status(400).json({ code: 400, message: "Invalid request. Please verify your payload and try again."});
    };

    if (!req.user || !req.user.userId) {
        return res.status(400).json({ code: 400,message: "User authentication error. Please log in and try again.",});
    };

    try {
        const note = await Note.create({ userId: req.user.userId, title: title, description: description});
        const { userId,__v, ...filteredNote } = note.toObject();
        res.status(201).json({code: 201,message: "Success! Your note has been created",data: filteredNote});
    } catch (error) {
        if (error.name === "ValidationError") {
            const fieldErrors = Object.keys(error.errors).map((key) => ({field: key,message: error.errors[key].message}));
            return res.status(400).json({code: 400,message: "Validation Error",errors: fieldErrors});
        };
        if (error.code === 11000) {
            const key = Object.keys(error.keyPattern)[0];
            const value = error.keyValue[key];
            return res.status(400).json({code: 400,message: `Duplicate key error: ${key} with value "${value}" already exists.`,field: key,value: value});
        };
        return res.status(500).json({ code: 500,message: "Internal Server Error",error: error.message});
    };
};

const handleGetNoteById = async (req,res) =>{
    if(!req.params.id){
        return res.status(400).json({code:400,message:"id is required in params"});
    };

    try{
        const note = await Note.findOne({_id:req.params.id,userId:req.user.userId,isActive:true},"-userId -__v").lean();
        if(!note){
            res.status(404).json({code:404,message:"Oops. note not found"});
        }else{
            res.status(404).json({code:404,message:"Success!",data:note});
        };
    }catch(error){
        return res.status(500).json({code:500,message:"Internal server error"});
    };
};

const handleGetAllNote = async (req,res) =>{
    try{
        const note = await Note.find({userId:req.user.userId,isActive:true},"-userId -__v").lean();
        res.status(200).json({code:200,message:"Success!",data:note});
    }catch(error){
        return res.status(500).json({code:500,message:"Internal server error"});
    };
};

const handleUpdateNote = async (req,res) =>{
    if(!req.params.id){
        return res.status(400).json({code:400,message:"id is required in params"});
    };

    try{
        const note = await Note.findByIdAndUpdate({_id:req.params.id,userId:req.user.userId,isActive:true},{...req.body},{new:true,projection: "-userId -__v"}).lean();
        if(!note){
            res.status(404).json({code:404,message:"Oops. note not found"});
        }else{
            res.status(404).json({code:404,message:"Success! note has been updated",data:note});
        };
    }catch(error){
        return res.status(500).json({code:500,message:"Internal server error"});
    };
};

const handleDeleteNote = async (req,res) =>{
    if(!req.params.id){
        return res.status(400).json({code:400,message:"id is required in params"});
    }

    try{
        const note = await Note.findByIdAndUpdate({_id:req.params.id,userId:req.user.userId,isActive:true},{isActive:false},{ new: true, projection: "-userId -__v" }).lean();
        if(!note){
            res.status(404).json({code:404,message:"Oops. note note found"});
        }else{
            res.status(404).json({code:404,message:"Success! note has been deleted"});
        };
    }catch(error){
        return res.status(500).json({code:500,message:"Internal server error"});
    };
};

module.exports = {handleCreateNote,handleGetNoteById,handleGetAllNote,handleUpdateNote,handleDeleteNote};