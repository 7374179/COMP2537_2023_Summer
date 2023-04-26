const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const app = express();

mongoose.connect("mongodb: //localhost:27017/sessions", {
  
})

app.use(
  session({
  secret: 'key that will sign cookie',
  resave: false, 
  saveUninitialized: false
}));

app.get("/", (req, res) => {
  console.log(req.session);
  res.send*("Heelo Sessions Tut");
});

app.listen(5000, console.log("Server Running on http://localhost:5000"));


// const port = process.env.PORT || 3020;

// var numPageHits = 0;

// app.get('/', (req,res) => {
//     numPageHits++;
//     res.send('You hve visited this page' + numPageHits + ' times!')
// });

// app.listen(port, () => {
//     console.log("Node application listening on port"+port);
// })

