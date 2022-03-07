const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;

const cors = require("cors");
const crawler = require("./crawler");

app.use(cors());
app.use(express.json());

app.post("/api/user", async (req, res) => {
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
