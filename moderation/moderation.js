const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
let handleEventModeration = async (type, data) => {
  if (type == "CommentCreated") {
    const status = data.content.includes("fuck") ? "rejected" : "approved";
    await axios.post("http://event-bus-srv:4005/events", {
      type: "CommentModerated",
      data: {
        id: data.id,
        postId: data.postId,
        status,
        content: data.content,
      },
    });
  }
};
app.post("/events", async (req, res) => {
  const { type, data } = req.body;
  handleEventModeration(type, data);

  res.send({});
});

app.listen(4003, async () => {
  console.log("Moderation Service listening on 4003");
  try {
    const res = await axios.get("http://event-bus-srv:4005/events");
    for (let event of res.data) {
      console.log("Processing eventModeration: ", event.type);
      handleEventModeration(event.type, event.data);
    }
  } catch (error) {
    console.log(error.message);
  }
});
