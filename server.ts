import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import User from "./models/user";
import jwt from "jsonwebtoken";
import setupWebSocketServer from "./webstocket";
import "dotenv/config";

const app = express();

const JWT_SECRECT_TOKEN = "jfniknfihiofh2ihfi2h3fioh2fiojs9fhj9sdfhkjfoj3";

mongoose.connect(
  "mongodb+srv://admin:3ynp6SfeLgeHPYSx@cluster0.e59j9.mongodb.net/messageroom?retryWrites=true&w=majority"
);

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello");
});

app.post("/api/register", async (req, res) => {
  console.log(req.body);

  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.json({ status: "error", error: "Invalid email/password" });
  }

  // TODO: Hashing the pw

  try {
    const user = new User({ username, email, password });
    await user.save();
  } catch (error) {
    console.log("Error", error);
    res.json({ status: "error", error: "Same Email" });
  }

  res.json({ status: "ok" });
});

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username, password }).lean();

  console.log(user);

  // TODO: 1. Refresh tokens
  //2.STORING JWT IN MEMORY

  // Rightnow 1. JWT TOkens directly // 2. Localstorage
  if (!user) {
    return res.json({ status: "error", error: "user not found" });
  }

  const payload = jwt.sign({ username }, JWT_SECRECT_TOKEN);

  return res.json({ status: "ok", data: payload });
});

app.listen(1337);
setupWebSocketServer();
