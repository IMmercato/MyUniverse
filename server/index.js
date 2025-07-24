const express = require("express");
const app = express();
const cors = require("cors");
const corsOptions = {
    origin: ["http://localhost:5173"],
};
const data = require("./data/yes.json")

app.use(cors(corsOptions));

app.get("/api", (req, res) => {
    res.json({ names: ["lebronita", "Charse Lecrec", "Steph dududu Verstaphen"] });
});

app.listen(8080, () => {
    console.log("Server started on port 8080");
});