const express = require('express');
const { resolve } = require('path');
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const UserModel = require("./schema");
const bcrypt = require("bcrypt");


const app = express();
const port = 3010;

app.use(express.static('static'));
app.use(express.json());
dotenv.config();

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send("Please provide email and password");
    }

    // Find user by email
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Compare password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send("Invalid credentials");
    }

    res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).send("Something went wrong");
  }
});


const MONGO_URL = process.env.MONGO_URL;
mongoose.connect(MONGO_URL,{
  useNewUrlParser:true,
  useUnifiedTopology:true,
}).then(()=>{
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
}).catch((err)=>{
  res.status(500).send("Something went wrong",err);
});