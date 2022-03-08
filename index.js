const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;

const cors = require("cors");
const crawler = require("./crawler");
const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");
  // Pass to next layer of middleware
  next();
});
app.use(express.json());
app.get("/", (req, res) => {
  res.send("running");
});

const newLocal = "/api/user";
app.post(newLocal, cors(corsOptions), async (req, res) => {
  console.log(req.body);
  let message = {
    message: "",
  };
  await crawler(req.body.url)
    .then((data) => {
      message.message = data;
      res.json(message);
    })
    .catch((err) => {
      message.message = err;
      res.json(message);
    });
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}....`);
});
