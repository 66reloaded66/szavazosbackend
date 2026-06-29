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
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
  } catch {
    return {};
  }
}

// mentés
function saveVotes(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// POST /vote
app.post("/vote", (req, res) => {
  const votes = loadVotes();

  const incoming = req.body; 
  // { "képzés": 1, ... }

  for (const key in incoming) {
    if (!votes[key]) {
      votes[key] = 1;
    } else {
      votes[key] += 1;
    }
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
