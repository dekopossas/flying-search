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
  const AUTH_KEY_SKY = "22575f39e6msh4fdde34f759eb49p1724d1jsn893a17b6ec97";

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
    const responseSeats = await axios.request(optionsSeats); // SEATSAERO request
    const responseSky = await axios.request(optionsSky);

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
          flightInfo: flightInfo,
          responseTrip: data,
        };
      })
    );

    const flightNumbersFromSeats = seatsWithFlyNumber.flatMap((trip) =>
      trip.responseTrip.data[0].AvailabilitySegments.map(
        (segment) => segment.FlightNumber
      )
    );

    console.log(responseSky.data);

    const flightsWithPrices = responseSky.data.data.itineraries
      .filter((item) => {
        const legs = item.legs || [];
        return legs.some((leg) => {
          const marketingCarriers = leg.carriers?.marketing || [];
          return leg.segments.some((segment) => {
            return marketingCarriers.some((carrier) => {
              return flightNumbersFromSeats.includes(
                `${carrier.alternateId}${segment.flightNumber}`
              );
            });
          });
        });
      })
      .flatMap((item) => {
        const price = item.price.formatted;
        return item.legs.flatMap((leg) => {
          const marketingCarriers = leg.carriers?.marketing || [];
          return leg.segments.flatMap((segment) => {
            return marketingCarriers
              .filter((carrier) =>
                flightNumbersFromSeats.includes(
                  `${carrier.alternateId}${segment.flightNumber}`
                )
              )
              .map((carrier) => ({
                flightNumber: `${carrier.alternateId}${segment.flightNumber}`,
                price,
              }));
          });
        });
      });

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

    return result; // Return flightInfo with associated prices and flight numbers
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getFlights,
};
