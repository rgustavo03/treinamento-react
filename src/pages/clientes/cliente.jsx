import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

import Banco from '../banco/banco';

import Input from '../../componentes/input';
import Button from '../../componentes/button';
import Table from '../../componentes/table';
import Select from '../../componentes/select'
import InputMask from '../../componentes/inputMask';
import Header from '../../componentes/header';
import EmptyState from '../../componentes/emptyState';

import TableCliente from './table';
import { inicializar } from '../../service/cliente'
import React from 'react';
import Menu from '../../componentes/menu';
import { salvarTransacoesLocalStorage } from '../../service/transacoes';

export default function Cliente() {

  //let nome = '';
  const [listaClientes, setListaClientes] = useState([{}]);

  //FILTROS
  const [filtro, setFiltro] = useState('');
  const [filtroDocumento, setFiltroDocumento] = useState('');

  //FORM
  const [idCliente, setIdCliente] = useState('');
  const [nome, setNome] = useState('');


  useEffect(() => {
    setListaClientes(inicializar());
  }, []);

  useEffect(() => {
    localStorage.setItem('listaCliente', JSON.stringify(listaClientes));
  }, [listaClientes]);



  function deletar(id) {
    console.log('deletar: ', id);

    const novoArray = listaClientes.filter(c => c.id != id);
    setListaClientes(novoArray);
  }

  function editar(id) {
    console.log('editar: ', id);

    listaClientes.forEach(c => {
      if(c.id == id) {
        setIdCliente(c.id);
        setNome(c.nome);
      }
    });
  }

  function cancelar() {
    setIdCliente('');
    setNome('');
  }

  function salvar() {
    try {
      const dados = {
        id: idCliente ? idCliente : uuidv4(),
        nome,
        saldo: 1000
      };

      if (!nome) {
        throw new Error('preencha o campo nome');
      }

      setIdCliente('');
      setNome('');

      let erro = false;

      listaClientes.forEach(u => {
        if(u.nome == nome) {
          erro = true;
          alert('Nome já registrado');
        };
      });
      if(erro) return // Para a funcao aqui caso achar nome igual

      if (idCliente) { // se idCliente já existe, se trata de edição do usuario

        let novaLista = listaClientes.filter(c => c.id != idCliente);
        setListaClientes([...novaLista, dados]);

      } else { // cadastro novo usuário

        setListaClientes([...listaClientes, dados]);
        const transacaoInicial = {
          tipo: 'D',
          valor: 1000,
          data: new Date(),
          descricao: `Depósito incial realizado por ${dados.nome} na Agência #` + Math.floor(Math.random() * 100)
        };
        salvarTransacoesLocalStorage(dados.id, transacaoInicial);

      }
    }
    catch (error) {
      alert(error.message);
    }
  }

  

  return (
    <div>

      <Menu />

      <div className='bg-body-tertiary'>
        <div className='container'>

          <Header
            titulo="Cadastro de Clientes"
            subtitulo={`${listaClientes.length} registros`}
            icone="fa-solid fa-user-group"
            cor=""
          />

          {idCliente && <div className='alert alert-warning my-4'>
            Id Cliente selecionado: {idCliente}
          </div>}


          <div className='row'>

            <div className='col-lg-4'>
              <div className="my-3 p-3 bg-body rounded shadow-sm">
                <h6 className="border-bottom pb-2 mb-2">Dados Cliente</h6>

                <Input
                  Nome="Nome"
                  Id="nome"
                  placeholder="Informe seu nome"
                  value={nome}
                  onChange={e => setNome(e.target.value)}
                />
                
                <hr />

                <Button onClick={salvar} nome="Salvar" tipoBotao="" tamanho="" disabled="">
                  <i className="fa-solid fa-floppy-disk"></i>
                </Button>

                {idCliente && (
                  <Button onClick={cancelar} nome="Cancelar" tipoBotao="btn-danger" tamanho="" disabled="">
                    <i className="fa-solid fa-xmark"></i>
                  </Button>
                )}

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

                {listaClientes.length > 0 && 
                  <TableCliente 
                    lista={listaClientes} 
                    idCliente={idCliente}
                    editar={editar}
                    deletar={deletar}
                  />}

                {listaClientes.length == 0 && <EmptyState mensagem="Nenhum cliente localizado" icone="fa-solid fa-user-group" />}
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  )
}

