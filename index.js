const express = require("express");

const app = express();
const PORT = process.env.PORT || 8080;
const cors = require("cors");
const crawler = require("./crawler");
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "https://crawl-e3835.web.app",
    "https://crawl-e3835.firebaseapp.com",
  ],
  methods: "POST,GET",
  preflightContinue: false,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Running");
});

const newLocal = "/api/user";
app.post(newLocal, async (req, res) => {
  crawler(req.body.url)
    .then((data) => {
      console.log(data);
    })
    .catch((err) => {
      console.log(err);
    });

  res.json({ message: "Running" });
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}....`);
});
