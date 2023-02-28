const mongoose = require("mongoose");
const { mongoURI } = require("../config");

mongoose.set("strictQuery", true);
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
module.exports = db;
