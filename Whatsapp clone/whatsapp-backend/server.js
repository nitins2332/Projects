// importing
import express from "express";
import mongoose from "mongoose";
import Messages from "./dbMessage.js";
import Pusher from "pusher";
import dbMessage from "./dbMessage.js";
import cors from "cors";

// app config
const app = express();
const port = process.env.PORT || 4000;

const pusher = new Pusher({
  appId: "1438458",
  key: "173b41f57833c737c9be",
  secret: "4678f6fbf9b8e1db2c0e",
  cluster: "eu",
  useTLS: true,
});

//middleware
app.use(express.json());
app.use(cors());

// DB config

const connection_url =
  "mongodb+srv://nitins:YrxakXO6IkD83RQ5@cluster0.bcfbk.mongodb.net/whatsappdb?retryWrites=true&w=majority";

mongoose.connect(connection_url);

const db = mongoose.connection;
db.once("open", () => {
  console.log("DB connected");

  const msgCollection = db.collection("messagecontents");
  const changeStream = msgCollection.watch();

  changeStream.on("change", (change) => {
    console.log("a change occured", change);

    if (change.operationType === "insert") {
      const messageDetails = change.fullDocument;
      pusher.trigger("messages", "inserted", {
        name: messageDetails.name,
        message: messageDetails.message,
        timestamp: messageDetails.timestamp,
        recieved: messageDetails.recieved,
      });
    } else {
      console.log("Error triggering Pusher");
    }
  });
});

// api routes
app.get("/", (req, res) => {
  res.status(200).send("Hello World");
});

app.get("/messages/sync", (req, res) => {
  Messages.find((err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});

app.post("/messages/new", (req, res) => {
  const dbMessage = req.body;

  Messages.create(dbMessage, (err, data) => {
    if (err) {
      res.status(500).send(err.Messages);
    } else {
      res.status(201).send(data);
    }
  });
});

// listen
app.listen(port, () => {
  console.log(`Listen on ${port}`);
});
