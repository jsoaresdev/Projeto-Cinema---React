import React, { useEffect, useState } from 'react';
import TextInput from '../../components/inputs/Input';
import Button from '../../components/buttons/Button';
import Modal from '../../components/modals/Modal';

const FilmePage = () => {
  const [filmes, setFilmes] = useState(() => {
    const dadosSalvos = localStorage.getItem('filmes');
    return dadosSalvos ? JSON.parse(dadosSalvos) : [];
  });

  const [nome, setNome] = useState('');
  const [genero, setGenero] = useState('');
  const [duracao, setDuracao] = useState('');
  const [imagem, setImagem] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [deleteIndex, setDeleteIndex] = useState(null);

  useEffect(() => {
    if (filmes.length > 0) {
      localStorage.setItem('filmes', JSON.stringify(filmes));
    } else {
      localStorage.removeItem('filmes');
    }
  }, [filmes]);

  const limparFormulario = () => {
    setNome('');
    setGenero('');
    setDuracao('');
    setImagem('');
    setEditIndex(null);
  };

  const salvarFilme = () => {
    const filme = { nome, genero, duracao, imagem };

    if (editIndex !== null) {
      const novosFilmes = [...filmes];
      novosFilmes[editIndex] = filme;
      setFilmes(novosFilmes);
    } else {
      setFilmes([...filmes, filme]);
    }

    limparFormulario();
  };

  const editarFilme = (index) => {
    const filme = filmes[index];
    setNome(filme.nome);
    setGenero(filme.genero);
    setDuracao(filme.duracao);
    setImagem(filme.imagem);
    setEditIndex(index);
  };

  const excluirFilme = (index) => {
    const novosFilmes = filmes.filter((_, i) => i !== index);
    setFilmes(novosFilmes);
    setDeleteIndex(null);
  };

  return (
    <div className="container mt-4">
      <h2>🎥 Gerenciar Filmes</h2>

      <form onSubmit={(e) => e.preventDefault()}>
        <TextInput
          label="Nome: "
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Digite o nome do filme"
        />
        <div className="mb-3">
          <label className="form-label">Gênero:</label>
          <select
            className="form-select"
            value={genero}
            onChange={(e) => setGenero(e.target.value)}
            required
          >
            <option value="">Selecione o gênero</option>
            <option>Ação</option>
            <option>Aventura</option>
            <option>Comédia</option>
            <option>Drama</option>
            <option>Ficção Científica</option>
            <option>Fantasia</option>
            <option>Terror</option>
            <option>Suspense</option>
            <option>Romance</option>
            <option>Musical</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Duração (minutos):</label>
          <input
            type="number"
            className="form-control"
            value={duracao}
            onChange={(e) => setDuracao(e.target.value)}
            placeholder="Ex: 120"
            min={1}
            required
          />
        </div>
        <TextInput
          label="URL da Imagem: "
          value={imagem}
          onChange={(e) => setImagem(e.target.value)}
          placeholder="Cole a URL da imagem do filme"
        />

        <button
          type="button"
          className="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#confirmSave"
        >
          {editIndex !== null ? 'Atualizar Filme' : 'Adicionar Filme'}
        </button>
      </form>

      <Modal
        id="confirmSave"
        titulo={editIndex !== null ? "Confirmar Atualização" : "Confirmar Adição"}
        mensagem={`Deseja realmente ${editIndex !== null ? "atualizar" : "adicionar"} o filme "${nome}"?`}
        onConfirm={salvarFilme}
        textoBotao={editIndex !== null ? "Atualizar" : "Adicionar"}
      />

      <hr />

      <h4>Lista de Filmes</h4>
      {filmes.length === 0 && <p>Nenhum filme cadastrado.</p>}

      {filmes.length > 0 && (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Imagem</th>
              <th>Nome</th>
              <th>Gênero</th>
              <th>Duração</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filmes.map((filme, index) => (
              <tr key={index}>
                <td>
                  {filme.imagem ? (
                    <img
                      src={filme.imagem}
                      alt={filme.nome}
                      width="80"
                      height="120"
                      style={{ objectFit: 'cover' }}
                    />
                  ) : (
                    'Sem imagem'
                  )}
                </td>
                <td>{filme.nome}</td>
                <td>{filme.genero}</td>
                <td>{filme.duracao}</td>
                <td>
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => editarFilme(index)}
                  >
                    <i className="bi bi-pencil"></i>
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    data-bs-toggle="modal"
                    data-bs-target={`#confirmDelete-${index}`}
                    onClick={() => setDeleteIndex(index)}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                  <Modal
                    id={`confirmDelete-${index}`}
                    titulo="Confirmar Exclusão"
                    mensagem={`Deseja realmente excluir o filme "${filme.nome}"?`}
                    onConfirm={() => excluirFilme(index)}
                    textoBotao="Excluir"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default FilmePage;
