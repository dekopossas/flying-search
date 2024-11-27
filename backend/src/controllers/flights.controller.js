const { StatusCodes } = require("http-status-codes");
const flightService = require("../services/flights.service");

const getFlights = async (req, res, next) => {
  try {
    const flights = await flightService.getFlights(req.query);

    return res.status(StatusCodes.OK).json(flights);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFlights,
};
