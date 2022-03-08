const express = require("express");

const app = express();
const PORT = process.env.PORT || 8080;
const cors = require("cors");
const crawler = require("./crawler");
const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Content-Type",
  preflightContinue: false,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("running");
});

const newLocal = "/api/user";
app.post(newLocal, async (req, res) => {
  let message = {
    message: "",
  };

  crawler(req.body.url)
    .then((data) => {
      message.message = data;
      res.json(message);
    })
    .catch((err) => {
      message.message = err;
      res.json(message);
    });
  message.message = "keep going";
  res.json(message);
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}....`);
});
