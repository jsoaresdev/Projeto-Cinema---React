import React, { useEffect, useState } from 'react';
import TextInput from '../../components/inputs/Input';
import Button from '../../components/buttons/Button';
import Modal from '../../components/modals/Modal';

const IngressosPage = () => {
  const [ingressos, setIngressos] = useState(() => {
    const dados = localStorage.getItem('ingressos');
    return dados ? JSON.parse(dados) : [];
  });

  const [sessoes, setSessoes] = useState([]);
  const [salas, setSalas] = useState([]);

  const [sessao, setSessao] = useState('');
  const [comprador, setComprador] = useState('');
  const [cpf, setCpf] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [pagamento, setPagamento] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [deleteIndex, setDeleteIndex] = useState(null);

  useEffect(() => {
    const dadosSessoes = localStorage.getItem('sessoes');
    const dadosSalas = localStorage.getItem('salas');

    if (dadosSessoes) setSessoes(JSON.parse(dadosSessoes));
    if (dadosSalas) setSalas(JSON.parse(dadosSalas));
  }, []);

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
    setCpf('');
    setQuantidade('');
    setPagamento('');
    setEditIndex(null);
  };

  const validarCPF = (cpf) => {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
    let soma = 0;
    for (let i = 0; i < 9; i++) soma += parseInt(cpf.charAt(i)) * (10 - i);
    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(9))) return false;
    soma = 0;
    for (let i = 0; i < 10; i++) soma += parseInt(cpf.charAt(i)) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    return resto === parseInt(cpf.charAt(10));
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

  const salvarIngresso = () => {
    const sala = obterSalaDaSessao(sessao);
    if (!sala) {
      alert('Erro: Sala não encontrada para esta sessão.');
      return;
    }

    if (!validarCPF(cpf)) {
      alert('CPF inválido!');
      return;
    }

    if (!pagamento) {
      alert('Selecione uma forma de pagamento.');
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

    const ingresso = { sessao, comprador, cpf, quantidade: quantidadeSolicitada, pagamento };

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
    setCpf(ingresso.cpf);
    setQuantidade(ingresso.quantidade);
    setPagamento(ingresso.pagamento);
    setEditIndex(index);
  };

  const excluirIngresso = (index) => {
    const novosIngressos = ingressos.filter((_, i) => i !== index);
    setIngressos(novosIngressos);
    setDeleteIndex(null);
  };

  return (
    <div className="container mt-4">
      <h2>🎫 Venda de ingressos</h2>

      <form onSubmit={(e) => e.preventDefault()}>
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
          label="CPF do Comprador"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
          placeholder="Digite o CPF (somente números)"
        />

        <TextInput
          label="Quantidade de Ingressos"
          value={quantidade}
          onChange={(e) => setQuantidade(e.target.value)}
          placeholder="Ex: 2"
        />

        <div className="mb-3">
          <label className="form-label">Forma de Pagamento</label>
          <select
            className="form-select"
            value={pagamento}
            onChange={(e) => setPagamento(e.target.value)}
            required
          >
            <option value="">Selecione uma opção</option>
            <option value="dinheiro">Dinheiro</option>
            <option value="credito">Cartão de Crédito</option>
            <option value="debito">Cartão de Débito</option>
          </select>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#modalSalvar"
        >
          {editIndex !== null ? 'Atualizar Ingresso' : 'Adicionar Ingresso'}
        </button>
      </form>

      <Modal
        id="modalSalvar"
        titulo={editIndex !== null ? 'Confirmar Atualização' : 'Confirmar Adição'}
        mensagem={`Deseja realmente ${editIndex !== null ? 'atualizar' : 'adicionar'} este ingresso?`}
        onConfirm={salvarIngresso}
        textoBotao={editIndex !== null ? 'Atualizar' : 'Adicionar'}
      />

      <hr />

      <h4>Lista de Ingressos Vendidos</h4>
      {ingressos.length === 0 && <p>Nenhum ingresso cadastrado.</p>}

      {ingressos.length > 0 && (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Sessão</th>
              <th>Comprador</th>
              <th>CPF</th>
              <th>Qtd</th>
              <th>Pagamento</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {ingressos.map((ingresso, index) => (
              <tr key={index}>
                <td>{ingresso.sessao}</td>
                <td>{ingresso.comprador}</td>
                <td>{ingresso.cpf}</td>
                <td>{ingresso.quantidade}</td>
                <td>{ingresso.pagamento}</td>
                <td>
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => editarIngresso(index)}
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
                    mensagem={`Deseja realmente excluir o ingresso para "${ingresso.sessao}"?`}
                    onConfirm={() => excluirIngresso(index)}
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

export default IngressosPage;
