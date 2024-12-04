import { useState } from "react";
import { getRequest } from "../Services/requests";
import AutoComplete from "../Components/AutoComplete";

export default function Home() {
  const [originAirport, setOriginAirport] = useState("");
  const [destinyAirport, setDestinyAirport] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showNoFilled, setShowNoFilled] = useState(false);
  const [noSearchFound, setNoSearchFound] = useState(false);
  const [flights, setFlights] = useState([]);

  const [filters, setFilters] = useState({
    Date: "",
    Source: "",
    OriginAirport: "",
    DestinationAirport: "",
    YAvailable: "",
    WAvailable: "",
    JAvailable: "",
    FAvailable: "",
  });

  const handleSubmit = async () => {
    const hasError = handleErrors();
    if (hasError) {
      return;
    }

    const params = {
      origin_airport: originAirport !== "" ? originAirport : null,
      destination_airport: destinyAirport !== "" ? destinyAirport : null,
      start_date: startDate !== "" ? startDate : null,
      end_date: endDate !== "" ? endDate : null,
      take: 5, // aqui que limita o numero de passagens por pesquisa
    };
    console.log(params);
    const result = await getRequest("/flights", params);
    console.log(result);
    if (result.length <= 0) {
      setNoSearchFound(true);
    } else {
      setNoSearchFound(false);
    }
    setFlights(result);
    setShowNoFilled(false);
  };

  const handleErrors = () => {
    if (!originAirport || !destinyAirport || !startDate || !endDate) {
      setShowNoFilled(true);
      return true;
    } else {
      setShowNoFilled(false);
      return false;
    }
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleFilterChange = (column, value) => {
    setFilters((prev) => ({ ...prev, [column]: value }));
  };

  const filteredFlights = flights.filter((flight) => {
    return (
      (!filters.Date || flight.Date.includes(filters.Date)) &&
      (!filters.Source ||
        flight.Source.toLowerCase().includes(filters.Source.toLowerCase())) &&
      (!filters.OriginAirport ||
        flight.Route.OriginAirport.toLowerCase().includes(
          filters.OriginAirport.toLowerCase()
        )) &&
      (!filters.DestinationAirport ||
        flight.Route.DestinationAirport.toLowerCase().includes(
          filters.DestinationAirport.toLowerCase()
        )) &&
      (!filters.YAvailable ||
        (filters.YAvailable === "true"
          ? flight.YAvailable
          : !flight.YAvailable)) &&
      (!filters.WAvailable ||
        (filters.WAvailable === "true"
          ? flight.WAvailable
          : !flight.WAvailable)) &&
      (!filters.JAvailable ||
        (filters.JAvailable === "true"
          ? flight.JAvailable
          : !flight.JAvailable)) &&
      (!filters.FAvailable ||
        (filters.FAvailable === "true"
          ? flight.FAvailable
          : !flight.FAvailable))
    );
  });

  return (
    <div className="container">
      {/* Fixed Header with the Button */}
      <div className="header">
        <button className="header-button" onClick={openModal}>
          Configurações Regionais
        </button>
      </div>

      {/* Modal that is controlled by showModal state */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={closeModal}>
              &times;
            </span>
            <h2>Configurações Regionais</h2>
            <div className="input-group">
              <label>Idioma</label>
              <select>
                <option>Português (Brasil)</option>
                <option>English</option>
              </select>
            </div>
            <div className="input-group">
              <label>País/Região</label>
              <select>
                <option>Brasil</option>
                <option>United States</option>
              </select>
            </div>
            <div className="input-group">
              <label>Moeda</label>
              <select>
                <option>BRL - R$</option>
                <option>USD - $</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Main Form */}
      <div className="form-container">
        <div className="input-group">
          <AutoComplete
            placeholder="Aeroportos de Origem"
            value={originAirport}
            onChange={setOriginAirport}
          />
          <AutoComplete
            placeholder="Aeroportos de Destino"
            value={destinyAirport}
            onChange={setDestinyAirport}
          />
        </div>
        <div className="input-group">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <div className="button-group">
          <button onClick={handleSubmit}>Procurar</button>
        </div>
        {showNoFilled && (
          <div>
            <h1>Origem, Destino, Data ínicio e Data fim são obrigatórios.</h1>
          </div>
        )}
        {noSearchFound && (
          <div>
            <h1>Nenhum vôo encontrado.</h1>
          </div>
        )}
      </div>
      {flights.length > 0 && (
        <table className="mui-table">
          <thead>
            <tr>
              <th>
                Data
                <input
                  type="text"
                  placeholder="Filter Date"
                  value={filters.Date}
                  onChange={(e) => handleFilterChange("Date", e.target.value)}
                />
              </th>
              <th>
                Programa
                <input
                  type="text"
                  placeholder="Filter Program"
                  value={filters.Source}
                  onChange={(e) => handleFilterChange("Source", e.target.value)}
                />
              </th>
              <th>
                Partida
                <input
                  type="text"
                  placeholder="Filter Origin"
                  value={filters.OriginAirport}
                  onChange={(e) =>
                    handleFilterChange("OriginAirport", e.target.value)
                  }
                />
              </th>
              <th>
                Chegada
                <input
                  type="text"
                  placeholder="Filter Destination"
                  value={filters.DestinationAirport}
                  onChange={(e) =>
                    handleFilterChange("DestinationAirport", e.target.value)
                  }
                />
              </th>
              <th>Assentos Disponíveis</th>
              <th>Econômica</th>
              <th>Premium</th>
              <th>Executiva</th>
              <th>Primeira Classe</th>
              <th>Preço</th>
            </tr>
          </thead>
          <tbody>
            {filteredFlights.map((flight, index) => (
              <tr key={index}>
                <td>{flight.Date}</td>
                <td>{flight.Source.toUpperCase()}</td>
                <td>{flight.Route.OriginAirport}</td>
                <td>{flight.Route.DestinationAirport}</td>
                <td>{flight.JRemainingSeats}</td>
                <td>
                  {flight.YAvailable
                    ? flight.YDirectMileageCost !== 0
                      ? `${flight.YDirectMileageCost} pts`
                      : `${flight.YMileageCost} pts`
                    : "-"}
                </td>
                <td>
                  {flight.WAvailable
                    ? flight.WDirectMileageCost !== 0
                      ? `${flight.WDirectMileageCost} pts`
                      : `${flight.WMileageCost} pts`
                    : "-"}
                </td>
                <td>
                  {flight.JAvailable
                    ? flight.JDirectMileageCost !== 0
                      ? `${flight.JDirectMileageCost} pts`
                      : `${flight.JMileageCost} pts`
                    : "-"}
                </td>
                <td>
                  {flight.FAvailable
                    ? flight.FDirectMileageCost !== 0
                      ? `${flight.FDirectMileageCost} pts`
                      : `${flight.FMileageCost} pts`
                    : "-"}
                </td>
                <td>{flight.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
