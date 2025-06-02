import React, { useEffect, useState } from 'react';
import TextInput from '../../components/inputs/Input';
import Button from '../../components/buttons/Button';
import Modal from '../../components/modals/Modal';

const SalaPage = () => {
  const [salas, setSalas] = useState(() => {
    const dadosSalvos = localStorage.getItem('salas');
    return dadosSalvos ? JSON.parse(dadosSalvos) : [];
  });

  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState('2D');
  const [capacidade, setCapacidade] = useState('');
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    localStorage.setItem('salas', JSON.stringify(salas));
  }, [salas]);

  const limparFormulario = () => {
    setNome('');
    setTipo('');
    setCapacidade('');
    setEditIndex(null);
  };

  const salvarSala = () => {
    const novaSala = { nome, tipo, capacidade };
    if (editIndex !== null) {
      const novasSalas = [...salas];
      novasSalas[editIndex] = novaSala;
      setSalas(novasSalas);
    } else {
      setSalas([...salas, novaSala]);
    }
    limparFormulario();
  };

  const editarSala = (index) => {
    const sala = salas[index];
    setNome(sala.nome);
    setTipo(sala.tipo);
    setCapacidade(sala.capacidade);
    setEditIndex(index);
  };

  const excluirSala = (index) => {
    const novasSalas = salas.filter((_, i) => i !== index);
    setSalas(novasSalas);
  };

  return (
    <div className="container mt-4">
      <h2>🎬 Gerenciar Salas</h2>

      <form onSubmit={(e) => e.preventDefault()}>
        <TextInput
          label="Nome da Sala:"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Digite o nome da sala"
        />

        <div className="mb-3">
          <label className="form-label">Tipo:</label>
          <select
            className="form-select"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
          >
            <option value="2D">2D</option>
            <option value="3D">3D</option>
            <option value="IMAX">XD</option>
          </select>
        </div>

        <TextInput
          label="Capacidade:"
          type="number"
          value={capacidade}
          onChange={(e) => setCapacidade(e.target.value)}
          placeholder="Número de assentos"
        />

        <button
          className="btn btn-success"
          data-bs-toggle="modal"
          data-bs-target="#modalGlobal"
          onClick={() => {}}
        >
          {editIndex !== null ? 'Atualizar Sala' : 'Adicionar Sala'}
        </button>
      </form>

      <Modal
        id="modalGlobal"
        titulo={editIndex !== null ? "Confirmar Atualização" : "Confirmar Adição"}
        mensagem={`Deseja realmente ${editIndex !== null ? "atualizar" : "adicionar"} a sala "${nome}"?`}
        onConfirm={salvarSala}
        textoBotao={editIndex !== null ? "Atualizar" : "Adicionar"}
      />

      <hr />
      <h4>Salas Cadastradas</h4>
      {salas.length === 0 && <p>Nenhuma sala cadastrada.</p>}
      {salas.length > 0 && (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Tipo</th>
              <th>Capacidade</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {salas.map((sala, index) => (
              <tr key={index}>
                <td>{sala.nome}</td>
                <td>{sala.tipo}</td>
                <td>{sala.capacidade}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => editarSala(index)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    data-bs-toggle="modal"
                    data-bs-target={`#confirmDelete-${index}`}
                  >
                    Excluir
                  </button>
                  <Modal
                    id={`confirmDelete-${index}`}
                    titulo="Confirmar Exclusão"
                    mensagem={`Deseja realmente excluir a sala "${sala.nome}"?`}
                    onConfirm={() => excluirSala(index)}
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

export default SalaPage;
