const express = require("express");
const path = require("path");
const app = express();
const {logReqRes} = require("./middlewares/logReqRes");

const user = require("./routes/user");
const loginuser = require("./routes/auth");
const notes = require("./routes/notes");
const {auth} = require("./middlewares/auth");
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.set("view engine","ejs");
app.set("views",path.resolve("./views"));
app.use(express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// create log by midileware
app.use(logReqRes("log.txt"));
  
app.get("/", async (req,res)=>{
    const user = []
    return res.render("home",user);
});

app.use("/api/v1",user);
app.use("/api/v1/auth",loginuser);
app.use("/api/v1/",auth,notes);

module.exports = app;