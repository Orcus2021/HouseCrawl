const express = require("express");
const app = express();
const port = 4000;
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

app.listen(port, () => {
  console.log(`Listening on port ${port}....`);
});
