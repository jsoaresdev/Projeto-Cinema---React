import React, { useEffect, useState } from 'react';
import TextInput from '../../components/inputs/Input';
import Button from '../../components/buttons/Button';


const IngressosPage = () => {
  const [ingressos, setIngressos] = useState(() => {
    const dados = localStorage.getItem('ingressos');
    return dados ? JSON.parse(dados) : [];
  });

  const [sessoes, setSessoes] = useState([]);
  const [salas, setSalas] = useState([]);

  const [sessao, setSessao] = useState('');
  const [comprador, setComprador] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [editIndex, setEditIndex] = useState(null);

  // Carregar sessões e salas cadastradas
  useEffect(() => {
    const dadosSessoes = localStorage.getItem('sessoes');
    const dadosSalas = localStorage.getItem('salas');

    if (dadosSessoes) setSessoes(JSON.parse(dadosSessoes));
    if (dadosSalas) setSalas(JSON.parse(dadosSalas));
  }, []);

  // Salvar ingressos no localStorage sempre que mudar
  useEffect(() => {
    if (ingressos.length > 0) {
      localStorage.setItem('ingressos', JSON.stringify(ingressos));
    } else {
      localStorage.removeItem('ingressos');
    }
  }, [ingressos]);

  const limparFormulario = () => {
    setSessao('');
    setComprador('');
    setQuantidade('');
    setEditIndex(null);
  };

  const obterSalaDaSessao = (sessaoSelecionada) => {
    const salaNome = sessaoSelecionada.split(' - ')[1]; 
    return salas.find((s) => s.nome === salaNome);
  };

  const calcularIngressosVendidos = (sessaoSelecionada) => {
    return ingressos
      .filter((i, index) => {
        if (editIndex !== null && index === editIndex) return false; 
        return i.sessao === sessaoSelecionada;
      })
      .reduce((total, i) => total + parseInt(i.quantidade), 0);
  };

  const salvarIngresso = (e) => {
    e.preventDefault();

    const sala = obterSalaDaSessao(sessao);

    if (!sala) {
      alert('Erro: Sala não encontrada para esta sessão.');
      return;
    }

    const capacidade = parseInt(sala.assentos);
    const ingressosVendidos = calcularIngressosVendidos(sessao);
    const quantidadeSolicitada = parseInt(quantidade);

    if (ingressosVendidos + quantidadeSolicitada > capacidade) {
      alert(
        `Limite de assentos excedido!\nCapacidade da sala: ${capacidade}\nIngressos já vendidos: ${ingressosVendidos}`
      );
      return;
    }

    const ingresso = { sessao, comprador, quantidade: quantidadeSolicitada };

    if (editIndex !== null) {
      const novosIngressos = [...ingressos];
      novosIngressos[editIndex] = ingresso;
      setIngressos(novosIngressos);
    } else {
      setIngressos([...ingressos, ingresso]);
    }

    limparFormulario();
  };

  const editarIngresso = (index) => {
    const ingresso = ingressos[index];
    setSessao(ingresso.sessao);
    setComprador(ingresso.comprador);
    setQuantidade(ingresso.quantidade);
    setEditIndex(index);
  };

  const excluirIngresso = (index) => {
    if (window.confirm('Deseja realmente excluir este ingresso?')) {
      const novosIngressos = ingressos.filter((_, i) => i !== index);
      setIngressos(novosIngressos);
    }
  };

  return (
    <div className="container mt-4">
      <h2>🎫 Venda de ingressos</h2>

      <form onSubmit={salvarIngresso}>
        <div className="mb-3">
          <label className="form-label">Sessão</label>
          <select
            className="form-select"
            value={sessao}
            onChange={(e) => setSessao(e.target.value)}
            required
          >
            <option value="">Selecione uma sessão</option>
            {sessoes.map((s, index) => (
              <option
                key={index}
                value={`${s.filme} - ${s.sala} - ${s.horario.replace('T', ' ')}`}
              >
                {s.filme} - {s.sala} - {s.horario.replace('T', ' ')}
              </option>
            ))}
          </select>
        </div>

        <TextInput
          label="Nome do Comprador"
          value={comprador}
          onChange={(e) => setComprador(e.target.value)}
          placeholder="Digite o nome"
        />

        <TextInput
          label="Quantidade de Ingressos"
          value={quantidade}
          onChange={(e) => setQuantidade(e.target.value)}
          placeholder="Ex: 2"
        />

        <Button
          label={editIndex !== null ? 'Atualizar Ingresso' : 'Adicionar Ingresso'}
        />
      </form>

      <hr />

      <h4>Lista de Ingressos Vendidos</h4>
      {ingressos.length === 0 && <p>Nenhum ingresso cadastrado.</p>}

      {ingressos.length > 0 && (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Sessão</th>
              <th>Comprador</th>
              <th>Quantidade</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {ingressos.map((ingresso, index) => (
              <tr key={index}>
                <td>{ingresso.sessao}</td>
                <td>{ingresso.comprador}</td>
                <td>{ingresso.quantidade}</td>
                <td>
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => editarIngresso(index)}
                  >
                    <i className="bi bi-pencil"></i>
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => excluirIngresso(index)}
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

export default IngressosPage;