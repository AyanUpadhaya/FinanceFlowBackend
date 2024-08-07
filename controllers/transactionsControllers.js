const Transaction = require("../models/Transaction");
const csv = require("csv-parser");
const fs = require("fs");

// Create a new transaction
const createTransaction = async (req, res) => {
  try {
    const { trxName, trxType, trxAmount, trxTag, user } = req.body;
    const newTransaction = new Transaction({
      trxName,
      trxType,
      trxAmount,
      trxTag,
      user,
    });
    await newTransaction.save();
    res.status(201).json(newTransaction);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// Get all transactions
const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find().populate("user");
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};



const getTransactionsByUserId = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    const startOfYear = new Date(currentYear, 0, 1); // January 1st, current year
    const endOfYear = new Date(currentYear + 1, 0, 1); // January 1st, next year

    const transactions = await Transaction.find({
      user: req.params.userId,
      createdAt: { $gte: startOfYear, $lt: endOfYear },
    });

    res.status(200).json(transactions.length > 0 ? transactions : []);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// Get a single transaction by ID
const getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id).populate(
      "user"
    );
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// Update a transaction
const updateTransaction = async (req, res) => {
  try {
    const { trxName, trxType, trxAmount, trxTag, user } = req.body;
    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      { trxName, trxType, trxAmount, trxTag, user },
      { new: true }
    );
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// Delete a transaction
const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndDelete(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// Calculate user balance
const calculateUserBalance = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.params.userId });

    const totalIncome = transactions
      .filter((trx) => trx.trxType === "INCOME")
      .reduce((sum, trx) => sum + trx.trxAmount, 0);

    const totalExpense = transactions
      .filter((trx) => trx.trxType === "EXPENSE")
      .reduce((sum, trx) => sum + trx.trxAmount, 0);

    const currentBalance = totalIncome - totalExpense;

    res.status(200).json({
      current_balance: currentBalance,
      total_income: totalIncome,
      total_expense: totalExpense,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

//bulkUpload Transactions

const bulkUploadTransactions = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(404).json({ message: "No file uploaded" });
      0;
    }
    const transactions = [];
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on("data", (row) => {
        const { trxName, trxType, trxAmount, trxTag, user } = row;
        transactions.push({
          trxName,
          trxType,
          trxAmount: parseInt(trxAmount),
          trxTag,
          user,
        });
      })
      .on("end", async () => {
        try {
          await Transaction.insertMany(transactions);
          res
            .status(201)
            .json({ message: "Transactions uploaded successfully" });
        } catch (error) {
          res.status(500).json({ message: "Server Error", error });
        } finally {
          fs.unlinkSync(req.file.path); // Delete the file after processing
        }
      });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};
module.exports = {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  getTransactionsByUserId,
  calculateUserBalance,
  bulkUploadTransactions,
};
