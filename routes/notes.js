const express = require("express");
const Router = express.Router();
const {handleCreateNote,handleGetNoteById,handleGetAllNote,handleUpdateNote,handleDeleteNote} = require("../controllers/notes");

Router.post("/create-note",handleCreateNote);
Router.get("/get-single-note/:id",handleGetNoteById);
Router.get("/get-all-note",handleGetAllNote);
Router.put("/update-note/:id",handleUpdateNote);
Router.delete("/delete-note/:id",handleDeleteNote);

module.exports = Router;