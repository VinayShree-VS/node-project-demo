const mongoose = require("mongoose");

const NoteSchema = new mongoose.Schema({
    title:{
        type:String,
        required:[true,"Title is required"]
    },
    description:{
        type:String,
        required:[true,"Description is required"]
    },
    isActive:{
        type:Boolean,
        required:true,
        default:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:[true, "UserId is required"]
    }
},{timestamps:true,versionKey: false});

const Note = mongoose.model("Note",NoteSchema);

module.exports = Note;