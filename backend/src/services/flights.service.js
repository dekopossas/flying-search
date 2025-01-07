const axios = require("axios");

const buildUrl = (baseUrl, params) => {
  const queryString = Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null) // Filter out null or undefined values
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`) // Create key=value pairs
    .join("&"); // Join pairs with '&'
  return `${baseUrl}${queryString}`;
};

const getFlights = async (infos) => {
  const BASEURLSEATS = "https://seats.aero/partnerapi/search?";
  const BASEURLSKY =
    "https://sky-scanner3.p.rapidapi.com/flights/search-one-way";

  const AUTH_KEY_SEATS = "pro_2mCPKxHTWPw3uWWOLYRv3hBRaJA";
  const AUTH_KEY_SKY = "89fe80f980msh00720371c7df746p1b99dfjsn30cfb9fc99e5";

  const optionsSeats = {
    method: "GET",
    url: buildUrl(BASEURLSEATS, infos),
    headers: {
      accept: "application/json",
      "Partner-Authorization": AUTH_KEY_SEATS,
    },
  };

  const optionsSky = {
    method: "GET",
    url: BASEURLSKY,
    params: {
      fromEntityId: infos.origin_airport,
      toEntityId: infos.destination_airport,
      departDate: infos.start_date,
      market: "BR",
      locale: "pt-BR",
      currency: "BRL",
    },
    headers: {
      "x-rapidapi-key": AUTH_KEY_SKY,
      "x-rapidapi-host": "sky-scanner3.p.rapidapi.com",
    },
  };

  try {
    // Fetch data from SEATS and SKY APIs
    const [responseSeats, responseSky] = await Promise.all([
      axios.request(optionsSeats),
      axios.request(optionsSky),
    ]);
    // console.log(responseSky.data.data.itineraries);

    // Fetch trip details from SEATS for each flight
    const seatsWithFlyNumber = await Promise.all(
      responseSeats.data.data.map(async (flightInfo) => {
        const optionsTrip = {
          method: "GET",
          url: `https://seats.aero/partnerapi/trips/${flightInfo.ID}`,
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
            "Partner-Authorization": AUTH_KEY_SEATS,
          },
        };
        const { data } = await axios.request(optionsTrip);

        return {
          flightInfo,
          responseTrip: data,
        };
      })
    );

    // Extract flight numbers from SEATS data
    const flightNumbersFromSeats = seatsWithFlyNumber.flatMap((trip) =>
      trip.responseTrip.data[0].AvailabilitySegments.map(
        (segment) => segment.FlightNumber
      )
    );

    // Match flights from SKY data with SEATS flight numbers
    const flightsWithPrices = [];
    if (responseSky.data?.data?.itineraries?.length) {
      responseSky.data.data.itineraries.forEach((item) => {
        const price = item.price.formatted || "N/A";
        item.legs.forEach((leg) => {
          const marketingCarriers = leg.carriers?.marketing || [];
          leg.segments.forEach((segment) => {
            marketingCarriers.forEach((carrier) => {
              const flightNumber = `${carrier.alternateId}${segment.flightNumber}`;
              if (flightNumbersFromSeats.includes(flightNumber)) {
                flightsWithPrices.push({ flightNumber, price });
              }
            });
          });
        });
      });
    }

    // Map prices and flight numbers to each flightInfo
    const result = seatsWithFlyNumber.map((seat) => {
      const flightNumbers = seat.responseTrip.data[0].AvailabilitySegments.map(
        (segment) => segment.FlightNumber
      );
      const matchedDetails = flightNumbers.map((flightNumber) => {
        const matchedFlight = flightsWithPrices.find(
          (flight) => flight.flightNumber === flightNumber
        );
        return {
          flightNumber,
          price: matchedFlight ? matchedFlight.price : "N/A",
        };
      });

      // Use the first matched details or default values
      const { flightNumber, price } = matchedDetails.find(
        (detail) => detail.price !== "N/A"
      ) || {
        flightNumber: "Unknown",
        price: "N/A",
      };

      return {
        ...seat.flightInfo,
        flightNumber,
        price,
      };
    });

    return result; // Return final result
  } catch (error) {
    console.error("Error in getFlights:", error.message, error.response?.data);
    throw error;
  }
};

module.exports = {
  getFlights,
};
