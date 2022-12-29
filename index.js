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

async function run() {
  try {
    // all collection
    const userAddTaskDatabase = client
      .db("BlackBal_Task_Database")
      .collection("All_User_Task");

    app.get("/", (req, res) => {
      res.send("BlackBale task server is running");
    });
  } finally {
  }
}
run().catch(console.log);

app.listen(port, () => {
  console.log(`BlackBale Task server is running ${port}`);
});
