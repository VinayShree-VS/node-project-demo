const mongoose = require("mongoose");

 const connectDB = (DB_URL) =>{
    mongoose.connect(DB_URL).then(()=>{
            console.log("DB connection successful 👍");
    }).catch((err)=>{
            console.log(err);
    });;
}

module.exports = connectDB;