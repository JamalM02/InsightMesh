const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(express.json());

app.get("/status", (req, res) => {
  res.send("ok");
});

// Serve the Docusaurus static build
app.use("/docs", express.static("build"));

// Redirect root to /docs/
app.get("/", (req, res) => {
  res.redirect("/docs/");
});

const PORT = process.env.PORT || 6000;
app.listen(PORT, () => {
  console.log(`Docs server running on port ${PORT}`);
});
