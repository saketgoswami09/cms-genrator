const express = require("express");
require("dotenv").config();
const db = require("./db");
const router = require("./routes/v1");
const cors = require("cors");

const app = express();

const PORT = process.env.PORT;
db();

app.use(cors());
app.use(express.json());
app.use("/v1", router);

app.get("/", (req, res) => {
  res.send("welcome to the application");
});
// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});
app.listen(PORT, () => {
  console.log(`Server is started at port ${PORT}`);
});
