const express = require("express");

const router = express.Router();

router.get("/test", (_req, res) => {
  res.status(200).json({ message: "teste" });
});

module.exports = router;
