const mongoose = require("mongoose");

const connectToMongo = () => {
  mongoose.connect(process.env.MONGO_URI, (err) => {
    if (err) return console.log("Error while connecting to DB");
    console.log("DB is connected successfully");
  });
};

module.exports = connectToMongo;
