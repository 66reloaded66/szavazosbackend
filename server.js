const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const DB_FILE = "./votes.json";

// betöltés

function loadVotes() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, "{}");
  }
  return JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
}
// mentés
function saveVotes(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// POST vote

app.post("/vote", (req, res) => {
  const votes = loadVotes();
  const selected = req.body.votes;

  if (!Array.isArray(selected)) {
    return res.status(400).json({ error: "Invalid format" });
  }

  for (const name of selected) {
    if (!votes[name]) votes[name] = 0;
    votes[name] += 1;
  }

  saveVotes(votes);

  res.json({
    success: true,
    updated: votes
  });
});

// GET /results
app.get("/results", (req, res) => {
  const votes = loadVotes();
  res.json(votes);
});

// health check
app.get("/", (req, res) => {
  res.send("Képzés szavazó backend fut 🚀");
});

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
