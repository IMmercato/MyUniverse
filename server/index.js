const express = require("express");
const app = express();
const cors = require("cors");
const corsOptions = {
    origin: ["http://localhost:5173"],
};
const yes = require("./data/yes.json");
const window = require("./data/window.json");

app.use(cors(corsOptions));

app.get("/api", (req, res) => {
    res.json({ names: ["lebronita", "Charse Lecrec", "Steph dududu Verstaphen"] });
});
app.get("/api/yes", (req, res) => {
    res.json(yes);
});
app.get("/api/window", (req, res) => {
    res.json(window);
});

app.listen(8080, () => {
    console.log("Server started on port 8080");
});