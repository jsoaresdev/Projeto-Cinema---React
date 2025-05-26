import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import FilmePage from '../pages/Filme/FilmePage';
import SalaPage from '../pages/Sala/SalaPage';
import SessaoPage from '../pages/Sessao/SessaoPage';
import IngressosPage from '../pages/Ingressos/IngressosPage';
import HomePage from '../pages/Home/HomePage';
import Navbar from '../components/menu/Navbar';



const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/filmes" element={<FilmePage />} />
        <Route path="/salas" element={<SalaPage />} />
        <Route path="/sessoes" element={<SessaoPage />} />
        <Route path="/ingressos" element={<IngressosPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
