const express = require("express");
const {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  getTransactionsByUserId,
  calculateUserBalance,
  bulkUploadTransactions,
} = require("../controllers/transactionsControllers");

const verifyToken = require("../middlewares/verifyToken");
const accessToTransactions = require("../middlewares/accessToTransactions");

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const router = express.Router();

// Create a new transaction ***
router.post("/transaction", createTransaction);

// Get all transactions
router.get("/transactions", accessToTransactions, getTransactions);

// Get a single transaction by ID
router.get("/transaction/:id", getTransactionById);

// Get all transactions by user ID ***
router.get("/transactions/:userId", verifyToken, getTransactionsByUserId);

// Calculate user balance
router.get("/transactions/:userId/balance", calculateUserBalance);

// Update a transaction ***
router.put("/transaction/:id", updateTransaction);

// Delete a transaction ***
router.delete("/transaction/:id", deleteTransaction);

// Bulk upload route ***
router.post(
  "/transactions/bulk-upload",
  upload.single("file"),
  bulkUploadTransactions
);
module.exports = router;
