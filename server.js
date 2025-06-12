const express = require("express");
const app = express();
const corsConfig = require("./config/corsConfig");
const cors = require("cors");
const path = require("path");
const { logger } = require("./middleware/logEvents");
const mongoose = require("mongoose");
const connectDB = require("./config/dbCon");
const errorHandler = require("./middleware/errorHandler");
const verifyJWT = require("./middleware/verifyJWT");
const cookieParser = require("cookie-parser");
const PORT = process.env.PORT || 3500;

//connect to mongoDB
connectDB();

app.use(logger);
app.use(cors(corsConfig));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "/public")));

app.use("/", require("./routes/root"));
app.use("/register", require("./routes/api/register"));
app.use("/logout", require("./routes/api/logout"));
app.use("/auth", require("./routes/api/auth"));
app.use("/refresh", require("./routes/api/refreshToken"));

app.use(verifyJWT);
app.use("/employees", require("./routes/api/employees"));

app.all("/^.*$/", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"), (err) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error loading 404 page");
      }
    });
  } else if (req.accepts("json")) {
    res.json({ error: "404 Not found" });
  } else {
    res.type("txt").send("404 not found");
  }
});

app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log("connected to mongoDB");
  app.listen(PORT, () => console.log(`server running on port ${PORT}`));
});
