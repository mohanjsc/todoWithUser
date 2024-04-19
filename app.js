const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { config } = require('dotenv');
const path = require('path')
const jwt = require('jsonwebtoken')


// Routes
const register = require('./routes/register.routes');
const login = require('./routes/login.routes');
const task = require('./routes/task.routes');

config();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: true },
}));
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

// Set EJS as view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Connect to MongoDB
mongoose.connect(process.env.DATABASE)
const db = mongoose.connection;
db.on("error", error => console.error(error));
db.once("open", () => console.log("Connected With Mongo :)"));


const verifyToken = (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
      console.error({ message: 'Token not provided' });
      return res.redirect('/login');
  }

  jwt.verify(token, process.env.SECRET, (err, decoded) => {
      if (err) {
          return res.redirect('/login');
      }
      req.user = decoded;
      next();
  });
}
app.use("/", register);
app.use("/", login);
app.use("/", verifyToken, task);

app.listen(9011, () => console.log("Server has started on Port: 9011"));


/* 
chap 13, api, crud express.application
w3 schools on mongodb, 
chapter 5 cookies, session, security

chapter 17 devops, basics, dna

*/
