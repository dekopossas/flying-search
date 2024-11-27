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

  allFilteredFlights = [];

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
    const responseSeats = await axios.request(optionsSeats); // REQUISIÇÃO SEATSAERO

    const responseSky = await axios.request(optionsSky); // REQUISIÇÃO SKYSCANNER

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
        // console.log(data);

        return {
          flightInfo: flightInfo,
          responseTrip: data,
        }; // Return the Serp API response
      })
    );

    // console.log(seatsWithFlyNumber);

    const flightNumbersFromSeats = seatsWithFlyNumber.flatMap((trip) =>
      trip.responseTrip.data[0].AvailabilitySegments.map(
        (segment) => segment.FlightNumber
      )
    );

    console.log(flightNumbersFromSeats);

    // console.log("responseSky", responseSky.data.data);

    const filteredSky = responseSky.data.data.itineraries.filter((item) => {
      const legs = item.legs || [];
      return legs.some((leg) => {
        const marketing = leg.carriers?.marketing || [];
        return marketing.some((carrier) =>
          flightNumbersFromSeats.includes(
            `${carrier.alternateId}${leg.segments?.[0]?.flightNumber}`
          )
        );
      });
    });

    // console.log(filteredSecondArray);

    return filteredSky; // Return all Serp API responses
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getFlights,
};
