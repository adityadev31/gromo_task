require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const dbConnection = require("./src/db/dbconn");
const PORT = process.env.PORT;
const DBURL = process.env.DBURL;

app.use(express.json());
app.use(cors());

// db connection
dbConnection(DBURL);

const userRoutes = require("./src/routes/user");

app.get("/", (req, res) => res.json({success: true, msg: `Server running on PORT: ${PORT}`}));

app.use("/user", userRoutes);

app.listen(PORT, () => console.log(`Server running on PORT: ${PORT}`));