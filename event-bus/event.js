const { default: axios } = require("axios");
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
app.use(bodyParser.json());

const events = [];
app.post("/events", (req, res) => {
  const event = req.body;

  events.push(event);

  axios.post("http://posts-clusterip-srv:4000/events", event).catch((e) => {
    console.log(e.message);
  });

  //comments service
  axios.post("http://comments-srv:4001/events", event).catch((e) => {
    console.log(e.message);
  });

  //query service

  axios.post("http://query-srv:4002/events", event).catch((e) => {
    console.log(e.message);
  });

  //mderation service

  axios.post("http://moderation-srv:4003/events", event).catch((e) => {
    console.log(`Moderation Server : ${e.message}`);
  });

  res.send({ status: "OK" });
});

app.get("/events", (req, res) => {
  res.send(events);
});

app.listen(4005, () => {
  console.log("listening on 4005");
});
