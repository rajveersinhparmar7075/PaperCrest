require("dotenv").config();
const connectDB = require("./config/db");
const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());

connectDB();
app.use(
  express.json({
    extended: false,
  })
);

// swagger configuration

//Define routes
app.use("/api/auth", require("./userAuth"));
app.get("/", (req, res) => {
  res.send([
    {
      status: "Server running",
    },
  ]);
});
// server port
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
