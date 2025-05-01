const controller = require("../controllers/user.controller");
const express = require("express");
const router = express.Router();

// POST /user/register
router.post("/register", controller.registerUser);

// POST /user/login
router.post("/login", controller.loginUser);

// GET /user/:email
router.get("/:email", controller.getUserByEmail);

// PUT /user
router.put("/", controller.updateUser);

// DELETE /user/:id
router.delete("/:id", controller.deleteUser);

// POST /user/topUp 
router.post("/topUp", controller.topUpUser);

module.exports = router;
