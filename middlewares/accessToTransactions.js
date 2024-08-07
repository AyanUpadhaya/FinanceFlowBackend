require("dotenv").config();

const accessToTransactions = (req, res, next) => {

  if (process.env.NODE_ENV == "dev") {
    next();
  } else {
    return res.status(403).json({ message: "Access Denied" });
  }
};

module.exports = accessToTransactions;
