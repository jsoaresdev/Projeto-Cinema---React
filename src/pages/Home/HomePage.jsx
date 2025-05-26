import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const [filmes, setFilmes] = useState([]);
  const [sessoes, setSessoes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const dadosFilmes = localStorage.getItem('filmes');
    const dadosSessoes = localStorage.getItem('sessoes');

    if (dadosFilmes) {
      setFilmes(JSON.parse(dadosFilmes));
    }

    if (dadosSessoes) {
      setSessoes(JSON.parse(dadosSessoes));
    }
  }, []);

  const filmesComSessoes = filmes.filter((filme) =>
    sessoes.some((sessao) => sessao.filme === filme.nome)
  );

  const buscarSessoesDoFilme = (nomeFilme) => {
    return sessoes.filter((sessao) => sessao.filme === nomeFilme);
  };

  const irParaIngressos = (filme) => {
    navigate(`/ingressos?filme=${encodeURIComponent(filme)}`);
  };

  return (
    <div className="container mt-4">
      <h2>🎬 Filmes em Cartaz</h2>
      <div className="row">
        {filmesComSessoes.length === 0 && (
          <p>Nenhum filme disponível em sessões cadastradas.</p>
        )}

        {filmesComSessoes.map((filme, index) => (
          <div className="col-md-3 mb-4" key={index}>
            <div className="card h-100">
              {filme.imagem ? (
                <img
                  src={filme.imagem}
                  className="card-img-top"
                  alt={filme.nome}
                  style={{ height: '450px', objectFit: 'cover' }}
                />
              ) : (
                <div
                  className="d-flex align-items-center justify-content-center bg-secondary text-white"
                  style={{ height: '450px' }}
                >
                  Sem Imagem
                </div>
              )}
              <div className="card-body">
                <h5 className="card-title">{filme.nome}</h5>
                <p className="card-text">
                  <strong>Gênero:</strong> {filme.genero}<br />
                  <strong>Duração:</strong> {filme.duracao} min
                </p>

                <p><strong>Sessões Disponíveis:</strong></p>
                {buscarSessoesDoFilme(filme.nome).map((sessao, i) => (
                  <div key={i}>
                    <p>
                      <strong>Sala:</strong> {sessao.sala}<br />
                      <strong>Horário:</strong> {sessao.horario.replace('T', ' ')}
                    </p>
                  </div>
                ))}

                <button
                  className="btn btn-primary w-100"
                  onClick={() => irParaIngressos(filme.nome)}
                >
                  Comprar Ingressos
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
