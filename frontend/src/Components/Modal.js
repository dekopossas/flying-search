import React from "react";

const Modal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Configurações Regionais</h2>
          <button onClick={onClose}>X</button>
        </div>
        <div className="modal-body">
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
        <div className="modal-footer">
          <button onClick={onClose}>Cancelar</button>
          <button onClick={onClose}>Salvar</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
