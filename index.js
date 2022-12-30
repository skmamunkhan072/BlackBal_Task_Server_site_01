const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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

// verify jwt token  middleware function
function verifyJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send("unauthorized access");
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN, function (err, decoded) {
    if (err) {
      return res.status(403).send({ message: "forbidden access" });
    }
    req.decoded = decoded;
    next();
  });
}

async function run() {
  try {
    //Collection create
    const AllTaskCollection = client
      .db("BlackBal_Task_Database")
      .collection("All_Task");

    // Jwt token crate function
    app.get("/jwt", async (req, res) => {
      const email = req.query.email;
      const token = jwt.sign({ email }, process.env.ACCESS_TOKEN, {
        expiresIn: "7h",
      });
      res.send({ accessToken: token });
    });

    // Task add database function
    app.post("/add-task", async (req, res) => {
      const data = req.body;
      const result = await AllTaskCollection.insertOne(data);
      res.send(result);
    });

    // user all task find
    app.get("/my-task", verifyJWT, async (req, res) => {
      const email = req.decoded.email;
      const query = { userEmail: email, complete: false };
      const result = await AllTaskCollection.find(query).toArray();
      res.send(result);
    });

    // complete Task add
    app.put("/task-complete-no-complete", async (req, res) => {
      const query = req.body;
      const { id, complete } = query;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          complete,
        },
      };

      const result = await AllTaskCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });

    // complete task
    app.get("/complete-task", verifyJWT, async (req, res) => {
      const email = req.decoded.email;
      const query = { userEmail: email, complete: true };
      const result = await AllTaskCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/task-edit/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await AllTaskCollection.findOne(query);
      res.send(result);
    });
    app.put("/task-edit", async (req, res) => {
      const data = req.body;
      const { id, taskMessage, taskTitle, uploadImgLink } = data;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          taskMessage,
          taskTitle,
          uploadImgLink,
        },
      };

      const result = await AllTaskCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });

    app.delete("/task-delete/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const result = await AllTaskCollection.deleteOne(filter);
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
