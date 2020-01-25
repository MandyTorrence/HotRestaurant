// Dependencies
// =============================================================
const express = require("express");
const path = require("path");

// Sets up the Express App
// =============================================================
const app = express();
const PORT = 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Hot Restaurant Table (DATA)
// =============================================================
const tables = [];
const waitlist = [];

// Routes
// =============================================================

// Basic route that sends the user first to the AJAX Page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/tables", (req, res) => {
  res.sendFile(path.join(__dirname, "tables.html"));
});

app.get("/reserve", (req, res) => {
  res.sendFile(path.join(__dirname, "reserve.html"));
});

// Creating the json api
app.get("/api/tables", (req, res) => {
  return res.json(tables);
});

app.get("/api/waitlist", (req, res) => {
  return res.json(waitlist);
});

// Displays the tables reserved
app.post("/api/tables/", (req, res) => {
  console.log(req.body)

  if (tables.length < 5) {
    tables.push(req.body);
    console.log(tables)
    return res.json(false);
  } else {
    waitlist.push(req.body);
    console.log(waitlist)
    return res.json(true);
  }
});

//Displays the waitlisted tables
app.get("/api/waitlist/:waitlisted", (req, res) => {
  const chosen = req.params.waitlisted;

  console.log(chosen);
  if (tables.length >= 5) {
    for (let i = 4; i < waitlist.length; i++) {
      if (chosen === waitlist[i].routeName) {
        return res.json(waitlist[i]);
      }
    }
    return res.json(false);
  }
});

// Create New Characters - takes in JSON input
app.post("/api/tables", (req, res) => {
  // req.body hosts is equal to the JSON post sent from the user
  // This works because of our body parsing middleware
  const newTable = req.body;

  // Using a RegEx Pattern to remove spaces from newTable
  // You can read more about RegEx Patterns later https://www.regexbuddy.com/regex.html
  newTable.routeName = newTable.name.replace(/\s+/g, "").toLowerCase();

  console.log(newTable);

  tables.push(newTable);

  res.json(newTable);
});


// Starts the server to begin listening
// =============================================================
app.listen(PORT, () => {
  console.log("App listening on PORT " + PORT);
});
