require("dotenv").config();
const express = require("express");
const connectDB = require("./config/database");
const routes = require("./routes");

const app = express();

connectDB();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Oppenheim CRM API is running");
});

app.use("/api", routes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});