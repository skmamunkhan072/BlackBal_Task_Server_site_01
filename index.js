const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();

const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

// // mongodb url

const uri = process.env.MONGODB_URL;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    //Collection create
    const AllTaskCollection = client
      .db("BlackBal_Task_Database")
      .collection("All_Task");

    app.post("/add-task", async (req, res) => {
      const query = req.body;
      const result = await AllTaskCollection.insertOne(query);
      res.send(result);
    });
  } finally {
  }
}

run().catch(console.log);

app.get("/", async (req, res) => {
  res.send("BlackBal Task  server  is running");
});

app.listen(port, () =>
  console.log(`BlackBal Task  server  is running on ${port}`)
);
