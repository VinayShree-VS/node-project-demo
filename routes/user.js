const express = require("express");
const Router = express.Router();
const {upload} = require('../config/uploadFiles');

const {handleGetAllUsers,handleCreateUser,handleGetUserById,handleUpdateUserById,handleDeleteUserById,handleUploadProfileImageById} = require("../controllers/user");
const {auth,hasRole} = require("../middlewares/auth");

Router.route("/ragister-user").get(auth,hasRole(["Admin"]),handleGetAllUsers).post(upload.single('profileImage'),handleCreateUser);
Router.route("/ragister-user/:id").get(auth,hasRole(["Admin"]),handleGetUserById).patch(auth,handleUpdateUserById).delete(auth,handleDeleteUserById);
Router.route("/upload-profile-image/:id").put(auth,upload.single('profileImage'),handleUploadProfileImageById);

module.exports = Router;