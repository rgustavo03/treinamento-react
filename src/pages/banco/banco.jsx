import React from "react";
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { bancoService } from '../../service/bancoService';

import Input from '../../componentes/input';
import Button from '../../componentes/button';
import Select from '../../componentes/select'
import Header from '../../componentes/header';
import EmptyState from '../../componentes/emptyState';

import Table from './table';
import Menu from '../../componentes/menu';
import { getTransacoes, salvarTransacoesLocalStorage } from "../../service/transacoes";


export default function Banco() {

  const [listaUsuarios, setListaUsuarios] = useState(bancoService());

  useEffect(() => {
    setListaUsuarios(bancoService());
  }, []);

  //----------------------

  const [usuario, setUsuario] = useState();

  const [usuarioDestino, setUsuarioDestino] = useState();

  //----------------------

  function escolherUsuario(e) {
    listaUsuarios.forEach(u => {
      if(u.id == e) setUsuario(u)
    });
  }

  function escolherDestino(e) {
    listaUsuarios.forEach(u => {
      if(u.id == e) setUsuarioDestino(u)
    });
  }

  //----------------------

  const tiposTransacao = [
    { label: 'Saque', value: 'S' },
    { label: 'Depósito', value: 'D' },
    { label: 'Transferência', value: 'T' }
  ];

  const [transacoes, setTransacoes] = useState([]);
  const [tipoTransacao, setTipoTransacao] = useState('');
  const [valor, setValor] = useState('');

  useEffect(() => { // buscar transacoes do usuario no localStorage
    if(!usuario) return
    const transacoesUsuario = getTransacoes(usuario.id); // funcao que retorna transacoes (transacoes.js)
    setTransacoes(transacoesUsuario);
  }, [usuario]);

  //----------------------

  function Transacionar(tipo, valorTransacao, descricaoTransacao) {

    const valorInformado = parseFloat(valorTransacao);

    if (!valorInformado) {
      alert('Preencha o valor');
      return;
    }
    if (!valorInformado) {
      alert('Preencha com um valor válido');
      return;
    }
    if (valorInformado <= 0) {
      alert('Preencha com um valor maior que zero');
      return;
    }

    const novaLista = [];
    let erro = true;

    listaUsuarios.forEach(u => {
      if(u.id == usuario.id) {
        if(tipo == 'S'){
          // funcao faz saque e retorna booleano (saque deu certo ou errado)
          let saque = Sacar(usuario, parseInt(valorTransacao));

          if(saque) erro = false; // Deu certo
          else erro = true; // Deu errado
        } 

        if(tipo == 'D') {
          Depositar(usuario, parseInt(valorTransacao));
          erro = false;
        }

        if(tipo == 'T') {
          let saque = Sacar(usuario, parseInt(valorTransacao));

          if(saque) {
            Depositar(usuarioDestino, parseInt(valorTransacao));
            erro = false
          } else {
            erro = true;
          }
        }
      }
      novaLista.push(u);
    });

    if(erro) return // caso der erro, funcao para aqui

    // Salvar no LocalStorage
    localStorage.setItem('listaCliente', JSON.stringify(novaLista));
    
    setTipoTransacao('');
    setValor('');

    const dados = {
      tipo: tipo,
      valor: valorInformado,
      data: new Date(),
      descricao: descricaoTransacao
    };

    salvarTransacoesLocalStorage(usuario.id, dados);
    setTransacoes([...transacoes, dados]);
  }

  //-----------------

  function Sacar(conta, valor) {
    if((conta.saldo - valor) < 0) {
      alert('Saldo insuficiente');
      return false;
    }
    else {
      conta.saldo = conta.saldo - valor; // Saque sendo efetuado
      return true;
    }
  }

  //-----------------

  function Depositar(conta, valor) {
    conta.saldo = conta.saldo + valor;
  }

  //-----------------

  function MovimentarConta() {
    if(!usuario) {
      alert('Selecione um usuario');
      return
    }
    if(tipoTransacao == 'T' && !usuarioDestino) {
      alert('Selecione um usuario para receber a transferência');
      return
    }

    let descricao = ``;

    if(tipoTransacao == 'T') {
      descricao = `${usuario.nome} transferiu para ${usuarioDestino.nome} na Agência #` + Math.floor(Math.random() * 100);
    } else {
      descricao = (tipoTransacao == 'D' ? 'Depósito ' : 'Saque ') + `realizado por ${usuario.nome} na Agência #` + Math.floor(Math.random() * 100);
    }

    Transacionar(tipoTransacao, valor, descricao);
  }

  //-----------------

  function Cancelar() {
    setTipoTransacao('');
    setValor('');
  }



  return (
    <div>

      <Menu />

      <div className='bg-body-tertiary'>
        <div className='container'>

          <Header
            titulo="DC Bank"
            subtitulo={`${transacoes.length} registros`}
            icone="fa-solid fa-landmark"
          />


          <div className='row'>

            <div className='col-lg-4'>
              <div className="my-3 p-3 bg-body rounded shadow-sm">
                <h6 className="border-bottom pb-2 mb-2">Usuário</h6>
                <div className="mb-3">
                  <label htmlFor="usuario" className="form-label">
                    Selecione o usuário
                  </label>
                  <select
                    id="usuario"
                    className="form-select"
                    aria-label="Default select example"
                    onChange={e => escolherUsuario(e.target.value)}
                  >
                    <option value='' >Selecione um item</option>
                    {listaUsuarios.map(u => {
                      //
                      return <option value={u.id} key={u.id}>{u.nome}</option>
                    })}
                  </select>
                </div>
                <div className="mb-3">
                  {usuario? `Saldo: R$ ${usuario.saldo.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}` : ''}
                </div>
              </div>
            </div>


            {tipoTransacao && (tipoTransacao == 'T' && (<>
              <div className='col-lg-4'>
                <div className="my-3 p-3 bg-body rounded shadow-sm">
                  <h6 className="border-bottom pb-2 mb-2">Destino</h6>
                  <div className="mb-3">
                    <label htmlFor="usuario" className="form-label">
                      Destino da transferência
                    </label>
                    <select
                      id="usuario"
                      className="form-select"
                      aria-label="Default select example"
                      onChange={e => escolherDestino(e.target.value)}
                    >
                      <option value=''>Selecione um item</option>
                      {listaUsuarios.map(u => {
                        //
                        return (
                          <>
                            {u == usuario? ('') : (
                              <option value={u.id} key={u.id}>{u.nome}</option>
                            )}
                          </>
                        )
                      })}
                    </select>
                  </div>
                </div>
              </div>
            </>))}


            <div className='col-lg-4'>
              <div className="my-3 p-3 bg-body rounded shadow-sm">
                <h6 className="border-bottom pb-2 mb-2">Dados da Transação</h6>

                <Select
                  Nome="Tipo Transação"
                  Id="tipo-transacao"
                  Opcoes={tiposTransacao}
                  value={tipoTransacao}
                  onChange={e => setTipoTransacao(e.target.value)}
                />

                {tipoTransacao && <>
                  <Input
                    Nome={tipoTransacao == "S" ? "Valor Saque" : "Valor Depósito"}
                    Id="valor"
                    placeholder={"R$ 0,00"}
                    value={valor}
                    onChange={e => setValor(e.target.value)}
                  />

                  <Button
                    onClick={MovimentarConta}
                    nome="Movimentar Conta"
                    tipoBotao={tipoTransacao == 'D' ? 'btn-success' : 'btn-danger'}>
                    {tipoTransacao == 'D' ? <i className="fa-solid fa-check"></i> :
                      <i className="fa-solid fa-money-bills"></i>}
                  </Button>

                  <Button onClick={Cancelar} nome="Cancelar" tipoBotao="btn-outline-danger">
                    <i className="fa-solid fa-xmark"></i>
                  </Button>
                </>}

              </div>
            </div>


            <div className='col-lg-8'>
              <div className="my-3 p-3 bg-body rounded shadow-sm">
                {transacoes.length > 0 && <>
                  <Table lista={transacoes} />
                </>}

                {transacoes.length == 0 && <EmptyState mensagem="Nenhuma transação realizada" icone="fa-solid fa-money-bill-transfer" />}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
