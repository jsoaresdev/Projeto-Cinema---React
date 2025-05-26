import React, { useEffect, useState } from 'react';
import TextInput from '../../components/inputs/Input';
import Button from '../../components/buttons/Button';


const SessaoPage = () => {
  const [sessoes, setSessoes] = useState(() => {
    const dados = localStorage.getItem('sessoes');
    return dados ? JSON.parse(dados) : [];
  });

  const [filmes, setFilmes] = useState([]);
  const [salas, setSalas] = useState([]);

  const [filme, setFilme] = useState('');
  const [sala, setSala] = useState('');
  const [horario, setHorario] = useState('');
  const [editIndex, setEditIndex] = useState(null);

  // Carregar filmes e salas existentes
  useEffect(() => {
    const dadosFilmes = localStorage.getItem('filmes');
    const dadosSalas = localStorage.getItem('salas');

    if (dadosFilmes) setFilmes(JSON.parse(dadosFilmes));
    if (dadosSalas) setSalas(JSON.parse(dadosSalas));
  }, []);

  // Salvar no localStorage quando sessoes mudar
  useEffect(() => {
    if (sessoes.length > 0) {
      localStorage.setItem('sessoes', JSON.stringify(sessoes));
    } else {
      localStorage.removeItem('sessoes');
    }
  }, [sessoes]);

  const limparFormulario = () => {
    setFilme('');
    setSala('');
    setHorario('');
    setEditIndex(null);
  };

  const salvarSessao = (e) => {
    e.preventDefault();

    const sessao = { filme, sala, horario };

    if (editIndex !== null) {
      const novasSessoes = [...sessoes];
      novasSessoes[editIndex] = sessao;
      setSessoes(novasSessoes);
    } else {
      setSessoes([...sessoes, sessao]);
    }

    limparFormulario();
  };

  const editarSessao = (index) => {
    const sessao = sessoes[index];
    setFilme(sessao.filme);
    setSala(sessao.sala);
    setHorario(sessao.horario);
    setEditIndex(index);
  };

  const excluirSessao = (index) => {
    if (window.confirm('Deseja realmente excluir essa sessão?')) {
      const novasSessoes = sessoes.filter((_, i) => i !== index);
      setSessoes(novasSessoes);
    }
  };

  return (
    <div className="container mt-4">
      <h2>🕑 Gerenciar Sessões</h2>

      <form onSubmit={salvarSessao}>
        <div className="mb-3">
          <label className="form-label">Filme</label>
          <select
            className="form-select"
            value={filme}
            onChange={(e) => setFilme(e.target.value)}
            required
          >
            <option value="">Selecione um filme</option>
            {filmes.map((f, index) => (
              <option key={index} value={f.nome}>
                {f.nome}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Sala</label>
          <select
            className="form-select"
            value={sala}
            onChange={(e) => setSala(e.target.value)}
            required
          >
            <option value="">Selecione uma sala</option>
            {salas.map((s, index) => (
              <option key={index} value={s.nome}>
                {s.nome}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Horário da Sessão</label>
          <input
            type="datetime-local"
            className="form-control"
            value={horario}
            onChange={(e) => setHorario(e.target.value)}
            required
          />
        </div>

        <Button
          label={editIndex !== null ? 'Atualizar Sessão' : 'Adicionar Sessão'}
        />
      </form>

      <hr />

      <h4>Lista de Sessões</h4>
      {sessoes.length === 0 && <p>Nenhuma sessão cadastrada.</p>}

      {sessoes.length > 0 && (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Filme</th>
              <th>Sala</th>
              <th>Horário</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {sessoes.map((sessao, index) => (
              <tr key={index}>
                <td>{sessao.filme}</td>
                <td>{sessao.sala}</td>
                <td>{sessao.horario.replace('T', ' ')}</td>
                <td>
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => editarSessao(index)}
                  >
                    <i className="bi bi-pencil"></i>
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => excluirSessao(index)}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SessaoPage;