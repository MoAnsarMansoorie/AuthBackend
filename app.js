require("./config/database").connect();
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("./model/user");
var cookieParser = require('cookie-parser')
const app = express();

app.use(express()); //discuss this
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.get("/", (req, res) => {
  res.send("Hello world!");
});

app.post("/signup", async (req, res) => {
  try {
    // collect all information
    const { firstName, lastName, email, password } = req.body;

    // check for all mandatory field
    if (!(firstName && lastName && email && password)) {
      res.status(400).send("All fields are required!");
    }

    // check email is in correct format -  Assignment

    // check user is already exist
    const existingUser = await User.findOne(email);
    if (existingUser) {
      res.status(400).send("User already exist, Please LogIn!");
    }

    // encrypt the password
    const myEncryptPassword = await bcrypt.hash(password, 10)

    // create a new entry in database
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: myEncryptPassword
    })

    // create a token and send it to user
    const token = await jwt.sign(
      {id: user._id, email},
      "124356",
      {expiresIn: "2h"}
    )

    user.token = token
    user.password = undefined  //  don't wnat to send password

    res.status(201).json(user)

  } catch (err) {
    console.log(err);
    console.log("Error is in route");
  }
});

// logIn
app.post("/login", async (req, res) => {
  try {
    // collect information from frontend
    const {email, password} = req.body

    // validate of login
    if(!(email && password)) {
      res.status(401).send("All fields are required!")
    }

    // check user in database
    const user = await User.findOne({email})
    
    // if user not exist
    if(!user){
      res.status(400).send("User is not exist!")
    }

    // match  the password
    if(user && (await bcrypt.compare(password, user.password))){
      const token = jwt.sign({id : user._id}, "124356", {expiresIn: "2h"})

      user.password = undefined
      user.token = token

      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true
      }

      res.status(200).cookie("token", token, options).json({
        success: true,
        token,
        user
      })

    }

    res.sendStatus(400).send("email or password is incorrect!")

    
  } catch (err) {
    console.log(err);
    console.log("Error in login");
  }
})

app.get("/dashboard", (req, res) => {
  
})

module.exports = app;
