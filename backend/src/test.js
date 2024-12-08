const express = require("express");
const router = express.Router();

// Endpoint de teste
router.get("/test", (_req, res) => {
  res.status(200).json({ message: "teste" });
});

module.exports = router;
