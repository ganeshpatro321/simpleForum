const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const morgan = require('morgan');
const cors = require("cors");

const config = require('./config');

mongoose.connect(config.mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.connection.on('connected', () => console.log('Connected to MongoDB'));

// const PORT = 3000;
const app = express();
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))
app.use(bodyParser.json());
app.use(cors());

app.use('/api/auth', require("./controllers/Auth"));
app.use('/api/post', require("./controllers/Post"));


app.get("*", (req, res) => {
    res.send("NodeJS server for the Forum App");
  });

app.listen(config.PORT, () => {
    console.log(`Server is listening on port: ${config.PORT}`);
  });