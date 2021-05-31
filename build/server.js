"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const user_1 = __importDefault(require("./models/user"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const app = express_1.default();
const JWT_SECRECT_TOKEN = "jfniknfihiofh2ihfi2h3fioh2fiojs9fhj9sdfhkjfoj3";
mongoose_1.default.connect("mongodb+srv://admin:3ynp6SfeLgeHPYSx@cluster0.e59j9.mongodb.net/messageroom?retryWrites=true&w=majority");
app.use(cors_1.default());
app.use(body_parser_1.default.json());
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
        const user = new user_1.default({ username, email, password });
        await user.save();
    }
    catch (error) {
        console.log("Error", error);
        res.json({ status: "error", error: "Same Email" });
    }
    res.json({ status: "ok" });
});
app.post("/api/login", async (req, res) => {
    const { username, password } = req.body;
    const user = await user_1.default.findOne({ username, password }).lean();
    console.log(user);
    // TODO: 1. Refresh tokens
    //2.STORING JWT IN MEMORY
    // Rightnow 1. JWT TOkens directly // 2. Localstorage
    if (!user) {
        return res.json({ status: "error", error: "user not found" });
    }
    const payload = jsonwebtoken_1.default.sign({ username }, JWT_SECRECT_TOKEN);
    return res.json({ status: "ok", data: payload });
});
app.listen(1337);
