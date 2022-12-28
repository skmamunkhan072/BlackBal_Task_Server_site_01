const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
require("dotenv").config();

app.use(cors());
app.use(express.json());

const uri = process.env.DATABASE_URL;
console.log(uri);

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

app.get("/", (req, res) => {
  res.send("my task server is running");
});
app.listen(port, () => {
  console.log("My Task server is running");
});
