import React from "react";
import { Link } from "react-router-dom";

export default function Menu() {
    //
    return (
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">

          <Link to="/" className="navbar-brand" >Home</Link>
          {/*
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          */}
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link to="/clientes" className="nav-link active" aria-current="page" >Clientes</Link>
              </li>
              <li className="nav-item">
                <Link to="/banco" className="nav-link active" aria-current="page" >Banco</Link>
              </li>
              <li className="nav-item">
                <Link to="/perguntas" className="nav-link active" aria-current="page" >Perguntas</Link>
              </li>
              <li className="nav-item">
                <Link to="/jogo" className="nav-link active" aria-current="page" >Show do Milhão</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    )
}