import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello");
});

app.post("/api/register", (req, res) => {
  console.log(req.body);

  res.json({ status: "ok" });
});

app.listen(1337);
