const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const userRoutes = require('./routes/userRoutes')
const transactionsRoutes = require("./routes/transactionsRoutes")
const app = express();
require("dotenv").config();
app.use(cors())
app.use(express.json());
app.use(userRoutes);
app.use(transactionsRoutes);
const port = process.env.PORT || 8000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("DB connected");
  })
  .catch((error) => {
    console.log(error.message);
  });

app.get("/",(req,res)=>{
    return res.send("Finance tracker server running")
})

app.listen(port,()=>console.log(`Server is running on port: ${port}`))