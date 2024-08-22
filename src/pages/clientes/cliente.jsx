import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

import Input from '../../componentes/input';
import Button from '../../componentes/button';
import Table from '../../componentes/table';
import Select from '../../componentes/select'
import InputMask from '../../componentes/inputMask';
import Header from '../../componentes/header';
import EmptyState from '../../componentes/emptyState';

import { salvarCliente, inicializar } from '../../service/cliente'

function Cliente() {

  const tiposCliente = [
    { label: 'Pessoa Física', value: 'PF' },
    { label: 'Pessoa Jurídica', value: 'PJ' }
  ];

  //let nome = '';
  const [listaClientes, setListaClientes] = useState([]);
  const [listaClientesFiltrada, setListaClientesFiltrada] = useState([]);

  //FILTROS
  const [filtro, setFiltro] = useState('');
  const [filtroDocumento, setFiltroDocumento] = useState('');

  //FORM
  const [idCliente, setIdCliente] = useState('');
  const [nome, setNome] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [tipoCliente, setTipoCliente] = useState('')
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmacaoSenha, setConfirmacaoSenha] = useState('');


  useEffect(() => {
    const listaStorage = inicializar();
    setListaClientes(listaStorage);
    setListaClientesFiltrada(listaStorage);
  }, [])

  useEffect(() => {
    let listaFiltrada = listaClientes;

    if (filtro) {
      listaFiltrada = listaFiltrada.filter(x =>
        x.nome.toUpperCase().includes(filtro.toUpperCase()) ||
        x.email.toUpperCase().includes(filtro.toUpperCase()));
    }

    if (filtroDocumento) {
      listaFiltrada = listaFiltrada.filter(x =>
        x.cpf.toUpperCase().includes(filtroDocumento.toUpperCase()));
    }
    setListaClientesFiltrada(listaFiltrada);
  }, [filtro, listaClientes, filtroDocumento]);

  useEffect(() => {
    localStorage.setItem('listaCliente', JSON.stringify(listaClientes));
  }, [listaClientes]);

  useEffect(() => {
    setCpf('');
  }, [tipoCliente]);

  function deletar(id) {
    console.log('deletar: ', id);

    const novoArray = listaClientes.filter(c => c.id != id);
    setListaClientes(novoArray);
  }

  function editar(id) {
    console.log('editar: ', id);

    const cliente = listaClientes.find(c => c.id == id);

    setIdCliente(cliente.id);
    setNome(cliente.nome);
    setDataNascimento(cliente.dataNascimento);
    setCpf(cliente.cpf);
    setEmail(cliente.email);
    setTipoCliente(cliente.tipoCliente);
    setSenha(cliente.senha);
    setConfirmacaoSenha(cliente.confirmacaoSenha);
  }

  function cancelar() {
    setNome('');
    setDataNascimento('');
    setCpf('');
    setEmail('');
    setIdCliente('');
    setSenha('');
    setConfirmacaoSenha('');
    setTipoCliente('');
  }

  function salvar() {
    try {
      const dados = {
        id: idCliente ? idCliente : uuidv4(),
        nome,
        dataNascimento,
        cpf,
        email,
        tipoCliente,
        senha,
        confirmacaoSenha
      };
      
      salvarCliente(dados);

      setTipoCliente('');
      setNome('');
      setDataNascimento('');
      setCpf('');
      setEmail('');
      setIdCliente('');
      setSenha('');
      setConfirmacaoSenha('');


      if (idCliente) {
        let novaLista = listaClientes.filter(c => c.id != idCliente);

        setListaClientes([...novaLista, dados]);
      } else {
        setListaClientes([...listaClientes, dados]);
      }
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <div className='bg-body-tertiary'>
      <div className='container'>

        <Header
          titulo="Cadastro de Clientes"
          subtitulo={`${listaClientes.length} registros`}
          icone="fa-solid fa-user-group" />

        {idCliente && <div className='alert alert-warning my-4'>
          Id Cliente selecionado: {idCliente}
        </div>}


        <div className='row'>

          <div className='col-lg-4'>
            <div className="my-3 p-3 bg-body rounded shadow-sm">
              <h6 className="border-bottom pb-2 mb-2">Dados Cliente</h6>

              <Select
                Nome="Tipo Cliente"
                Id="tipo-cliente"
                Opcoes={tiposCliente}
                value={tipoCliente}
                onChange={e => setTipoCliente(e.target.value)} />

              {tipoCliente && <>
                <Input
                  Nome={tipoCliente == "PF" ? "Nome" : "Razão Social"}
                  Id="nome"
                  placeholder={tipoCliente == "PF" ? "Informe seu nome" : "Informe o nome da empresa"}
                  value={nome}
                  onChange={e => setNome(e.target.value)} />

                {tipoCliente == "PF" && <Input
                  Nome="Data de Nascimento"
                  Id="data-nascimento"
                  type="date"
                  value={dataNascimento}
                  onChange={e => setDataNascimento(e.target.value)} />}



                {tipoCliente == "PF" ? <InputMask
                  Nome="CPF"
                  Id="cpf"
                  placeholder="___.___.___-__"
                  mascara="999.999.999-99"
                  value={cpf}
                  onChange={e => setCpf(e.target.value)} /> :
                  <InputMask
                    Nome="CNPJ"
                    Id="cnpj"
                    placeholder="__.___.___/____-__"
                    mascara="99.999.999/9999-99"
                    value={cpf}
                    onChange={e => setCpf(e.target.value)} />}

                <Input
                  Nome="Email"
                  Id="email"
                  type="email"
                  placeholder="exemplo@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)} />

                <Input
                  Nome="Senha"
                  Id="senha"
                  type="password"
                  placeholder="digite sua senha"
                  value={senha}
                  onChange={e => setSenha(e.target.value)} />

                <Input
                  Nome="Confirmacao Senha"
                  Id="confirmacao-senha"
                  type="password"
                  placeholder="digite a confirmação de senha"
                  value={confirmacaoSenha}
                  onChange={e => setConfirmacaoSenha(e.target.value)} />

                {senha &&
                  (senha == confirmacaoSenha ?
                    <div className='text-success'>Senha igual</div> :
                    <div className='text-danger'>Senha diferente</div>)}

              </>}
              <hr />

              <Button onClick={salvar} nome="Salvar">
                <i className="fa-solid fa-floppy-disk"></i>
              </Button>

              {idCliente && <Button onClick={cancelar} nome="Cancelar" tipoBotao="btn-danger">
                <i className="fa-solid fa-xmark"></i>
              </Button>}

            </div>
          </div>

          <div className='col-lg-8'>
            <div className="my-3 p-3 bg-body rounded shadow-sm">
              <div className='row'>
                <div className='col-7'>
                  <Input
                    Nome="Filtro (Nome, Email)"
                    Id="filtro"
                    placeholder="Digite o nome do cliente"
                    value={filtro}
                    onChange={e => setFiltro(e.target.value)} />

                </div>
                <div className='col-5'>
                  <Input
                    Nome="Filtro Documento"
                    Id="filtro-documento"
                    placeholder="Digite o documento do cliente"
                    value={filtroDocumento}
                    onChange={e => setFiltroDocumento(e.target.value)} />

                </div>
              </div>

              {listaClientesFiltrada.length > 0 && <Table>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Data Nascimento</th>
                    <th>Cpf</th>
                    <th>Email</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {listaClientesFiltrada.map(c => {
                    return (
                      <tr key={c.id}>
                        <td>{c.nome}</td>
                        <td>{c.dataNascimento}</td>
                        <td>{c.cpf}</td>
                        <td>{c.email}</td>
                        <td>
                          <Button
                            nome="Editar"
                            tipoBotao="btn-warning"
                            tamanho="btn-sm"
                            onClick={() => editar(c.id)}
                            disabled={idCliente ? true : false}>
                            <i className="fa-solid fa-pencil"></i>
                          </Button>

                          <Button
                            nome="Deletar"
                            tipoBotao="btn-danger"
                            tamanho="btn-sm"
                            onClick={() => deletar(c.id)}
                            disabled={idCliente ? true : false}>
                            <i className="fa-regular fa-trash-can"></i>
                          </Button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </Table>}

              {listaClientesFiltrada.length == 0 && <EmptyState mensagem="Nenhum cliente localizado" icone="fa-solid fa-user-group" />}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cliente
