import { useState } from "react";

export default function Home() {
  const [originAirport, setOriginAirport] = useState("");
  const [destinyAirport, setDestinyAirport] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = () => {
    console.log("Form Submitted");
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

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
          <input
            type="text"
            placeholder="Aeroportos de Origem"
            value={originAirport}
            onChange={(e) => setOriginAirport(e.target.value)}
          />
          <input
            type="text"
            placeholder="Aeroportos de Destino"
            value={destinyAirport}
            onChange={(e) => setDestinyAirport(e.target.value)}
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
      </div>
    </div>
  );
}
