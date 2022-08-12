const connectToMongo = require("./db");
var cors = require("cors");
require("dotenv").config();

const con = async () => {
  await connectToMongo();
};
con();
const express = require("express");
const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());

// Available routes
app.use("/", require("./routes/auth"));
app.use("/", require("./routes/notes"));

app.listen(port || 3000, () => {
  console.log(`Server listening on port http://localhost:${port}`);
});
