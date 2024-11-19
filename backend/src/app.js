const express = require("express");
const { errorMiddleware } = require("./middlewares/error");
const cors = require("cors");
const helmet = require("helmet");

const {
  // userRoute
} = require("./routes");

const app = express();

app.use(helmet());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cors());

// app.use("/user", userRoute);
app.use("/", (_req, res) => res.status(200).send("Rodando Aplicação na 3001"));

app.use(errorMiddleware);

module.exports = app;