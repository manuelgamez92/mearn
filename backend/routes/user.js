const express = require('express');
const User = require("../models/user");
const bcrypt = require("bcrypt");
const checkAuth = require("../middleware/check-auth");
const jwt = require("jsonwebtoken");
const router = express.Router();
const extractFile = require("../middleware/file");


const UserController = require('../controllers/user');

router.post("/signup",UserController.createUser);

router.post("/login", UserController.userLogin);

router.get("/getUsers", UserController.getUsers);

router.post("/getUser", UserController.getUser);

router.put("/updateUser",extractFile,UserController.updateUser);

router.put("/forgotPassword", UserController.forgotPassword);

router.put("/resetPassword", UserController.resetPassword);

router.delete("/delete/:id", UserController.deleteUser);


module.exports = router;