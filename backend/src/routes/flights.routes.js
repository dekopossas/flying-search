const express = require("express");
const flightsController = require("../controllers/flights.controller");

const routers = express.Router();

routers.get("/", flightsController.getFlights);

module.exports = routers;
