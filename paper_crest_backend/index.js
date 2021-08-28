require("dotenv").config();
const express = require("express");

const cors = require("cors");

const app = express();
const bcrypt = require("bcryptjs");

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

//Define routes
app.use("/api/auth", require("./userAuth"));
