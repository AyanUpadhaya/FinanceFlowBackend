const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyToken = (req, res, next) => {
  // Extract the token from the Authorization header
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(403).json({
        message: "No token provided!",
      });
    }else{
      jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
          return res.status(401).send({
            message: "Invalid token.",
          });
        }

        // Set the entire user object in the request
        req.user = decoded;

        next();
      });
    }
};

module.exports = verifyToken;
