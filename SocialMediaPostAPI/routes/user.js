const express = require('express');
const router = express.Router();
const userController = require('../controller/UserController');

//localhost:3000/api/user/login
router.post('/create', userController.createUser);
router.post('/login', userController.Login);

module.exports = router