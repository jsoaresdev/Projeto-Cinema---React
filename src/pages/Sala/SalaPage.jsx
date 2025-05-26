import React, { useEffect, useState } from 'react';
import TextInput from '../../components/inputs/Input';
import Button from '../../components/buttons/Button';

const SalaPage = () => {
  const [salas, setSalas] = useState(() => {
    const dadosSalvos = localStorage.getItem('salas');
    return dadosSalvos ? JSON.parse(dadosSalvos) : [];
  });

  const [nome, setNome] = useState('');
  const [assentos, setAssentos] = useState('');
  const [editIndex, setEditIndex] = useState(null);

  // Salvar no localStorage sempre que salas mudar
  useEffect(() => {
    if (salas.length > 0) {
      localStorage.setItem('salas', JSON.stringify(salas));
    } else {
      localStorage.removeItem('salas');
    }
  }, [salas]);

  const limparFormulario = () => {
    setNome('');
    setAssentos('');
    setEditIndex(null);
  };

  const salvarSala = (e) => {
    e.preventDefault();

    const sala = { nome, assentos };

    if (editIndex !== null) {
      const novasSalas = [...salas];
      novasSalas[editIndex] = sala;
      setSalas(novasSalas);
    } else {
      setSalas([...salas, sala]);
    }

    limparFormulario();
  };

  const editarSala = (index) => {
    const sala = salas[index];
    setNome(sala.nome);
    setAssentos(sala.assentos);
    setEditIndex(index);
  };

  const excluirSala = (index) => {
    if (window.confirm('Deseja realmente excluir essa sala?')) {
      const novasSalas = salas.filter((_, i) => i !== index);
      setSalas(novasSalas);
    }
  };

  return (
    <div className="container mt-4">
      <h2>🏢 Gerenciar Salas</h2>

      <form onSubmit={salvarSala}>
        <TextInput
          label="Nome da Sala"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Digite o nome da sala"
        />
        <TextInput
          label="Quantidade de Assentos"
          value={assentos}
          onChange={(e) => setAssentos(e.target.value)}
          placeholder="Ex: 100"
        />

        <Button
          label={editIndex !== null ? 'Atualizar Sala' : 'Adicionar Sala'}
        />
      </form>

      <hr />

      <h4>Lista de Salas</h4>
      {salas.length === 0 && <p>Nenhuma sala cadastrada.</p>}

      {salas.length > 0 && (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Assentos</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {salas.map((sala, index) => (
              <tr key={index}>
                <td>{sala.nome}</td>
                <td>{sala.assentos}</td>
                <td>
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => editarSala(index)}
                  >
                    <i className="bi bi-pencil"></i>
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => excluirSala(index)}
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

export default SalaPage;
