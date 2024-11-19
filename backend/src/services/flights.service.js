const axios = require("axios");

function buildUrl(baseUrl, params) {
  const queryString = Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null) // Filtra valores nulos ou indefinidos
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`) // Cria pares chave=valor
    .join("&"); // Junta os pares com '&'
  return `${baseUrl}${queryString}`;
}

const getFlights = async (infos) => {
  console.log(infos);

  const BASEURL = "https://seats.aero/partnerapi/search?";

  const AUTH_KEY = "pro_2mCPKxHTWPw3uWWOLYRv3hBRaJA";

  const options = {
    method: "GET",
    url: buildUrl(BASEURL, infos),
    headers: {
      accept: "application/json",
      "Partner-Authorization": AUTH_KEY,
    },
  };

  console.log(options.url);

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getFlights,
};
