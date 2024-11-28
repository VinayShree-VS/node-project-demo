
const express = require("express");
const Router = express.Router();
const {handleUserLogin} = require("../controllers/user");

Router.post("/login-user",handleUserLogin)


module.exports = Router;