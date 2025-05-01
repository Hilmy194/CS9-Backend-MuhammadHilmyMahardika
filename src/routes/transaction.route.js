const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transaction.controller");

// POST /transaction/create
router.post("/create", transactionController.createTransaction);

// POST /transaction/pay/:id
router.post("/pay/:id", transactionController.payTransaction);

// GET /transaction
router.get("/", transactionController.getTransactions);

// DELETE /transaction/:id
router.delete("/:id", transactionController.deleteTransaction);

module.exports = router;
