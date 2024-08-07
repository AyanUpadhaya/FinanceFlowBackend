const mongoose = require("mongoose");
const { getCurrentUnixTimestamp, timekoto } = require("../utils/utils");
const transactionSchema = mongoose.Schema(
  {
    trxName: {
      type: String,
      required: true,
    },
    trxType: {
      type: String,
      default: "INCOME",
    },
    trxAmount: {
      type: Number,
      default: 0,
    },
    trxTag: {
      type: String,
      required: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    timestamp: {
      type: String,
      default: timekoto("s"),
    },
  },
  { timestamps: true }
);

const Transaction = mongoose.model("transaction", transactionSchema);

module.exports = Transaction
