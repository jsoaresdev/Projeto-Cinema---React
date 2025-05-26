import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">🎥 Cinema</Link>

        {/* Botão Hamburguer */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Itens do menu */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/filmes">Filmes</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/salas">Salas</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/sessoes">Sessões</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/ingressos">Ingressos</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
