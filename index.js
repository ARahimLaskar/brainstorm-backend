const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
require("dotenv").config();

const { connection } = require("./ConfigDataBase/db.js");
const userRoutes = require("./Routes/userRoutes.js");

const app = express();
app.use(express.json());
app.use(cors());
// app.use(
//   cors({
//     origin: "*",
//   })
// );

// app.use("/", (req, res) => {
//   res.send("welcome");
// });

app.use("/user", userRoutes);

const PORT = 8080;

app.listen(PORT, async () => {
  try {
    await connection;
    console.log("db connected");
  } catch (error) {
    console.log("error connecting db " + error);
  }
  console.log("server running at port " + PORT);
});
