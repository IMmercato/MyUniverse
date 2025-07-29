const express = require("express");
const path = require("path");
const cors = require("cors");
const yes = require("./data/yes.json");
const windowData = require("./data/window.json");

const app = express();

app.get("/api", (req, res) => {
  res.json({ names: ["lebronita", "Charse Lecrec", "Steph dududu Verstaphen"] });
});

app.get("/api/yes", (req, res) => {
  res.json(yes);
});

app.get("/api/window", (req, res) => {
  res.json(windowData);
});

app.use(express.static(path.join(__dirname, "../client/dist")));

app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});