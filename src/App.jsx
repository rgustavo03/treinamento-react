import { useState } from 'react';
import Input from './componentes/input';
import Button from './componentes/button';
import Table from './componentes/table';
import { v4 as uuidv4 } from 'uuid';

function App() {

  //let nome = '';
  const [listaClientes, setListaClientes] = useState([])

  const [idCliente, setIdCliente] = useState('');
  const [nome, setNome] = useState('');
  const [dataNascimento, setDataNascimento] = useState('')
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');

  /* 
    - Nome
    - Data de Nascimento
    - CPF
    - Email
  */

  //map (mapeamento) -> moficação (um novo array com a mesma quantidade de objetos), 
  //filter -> filtrar (array de acordo com o filtro), 
  //find -> filtrar (retorna um objeto)
  //reduce -> reduzir (apenas um valor)
  //sort -> ordenação



  const usuarios = [
    { id: 1, nome: 'joao', idade: 18, pontos: 600 },
    { id: 2, nome: 'antonio', idade: 10, pontos: 500 },
    { id: 3, nome: 'pedro', idade: 15, pontos: 300 },
    { id: 4, nome: 'lucas', idade: 20, pontos: 150 },
    { id: 5, nome: 'maria', idade: 5, pontos: 100 },
  ];

  const rankingUsuarios = usuarios.sort((a, b) => b.pontos - a.pontos);
  console.log('rankingUsuarios =>', rankingUsuarios);

  const rankingUsuariosAdultos = usuarios
    .filter(u => u.idade >= 18)
    .sort((a, b) => b.pontos - a.pontos)
    .map(u => {
      return {
        nome: u.nome,
        pontos: u.pontos,
        recompensa: u.pontos * 2.5
      }
    });



  //pop -> remove o ultimo item do array
  //push -> adiciona um item ao final do array
  //shift -> remove o primeiro item do array
  //unshift -> adiciona um item no inicio do array

  console.log('rankingUsuariosAdultos =>', rankingUsuariosAdultos);

  const usuariosAdultos = usuarios.filter(usuario => usuario.idade >= 18);
  console.log('usuariosAdultos =>', usuariosAdultos);

  const usuario3 = usuarios.find(usuario => usuario.id == 3);
  console.log('usuario3 =>', usuario3);
  //const, let

  const nomeEquipe = usuarios.reduce((valorAnterior, elementoAtual) => valorAnterior + ', ' + elementoAtual.nome, '');

  console.log('nomeEquipe', nomeEquipe);

  // let pontuacaoTotal = usuarios
  //   .reduce(function (valorAnterior, elementoAtual) {
  //     console.log('valorAnterior: ', valorAnterior)
  //     console.log('elementoAtual: ', elementoAtual)
  //     return valorAnterior + elementoAtual.pontos
  //   }, 0);

  let pontuacaoTotal = usuarios.reduce((valorAnterior, elementoAtual) => valorAnterior + elementoAtual.pontos, 0);

  // let pontuacaoTotal = 0;

  // for (let index = 0; index < usuarios.length; index++) {
  //   pontuacaoTotal += usuarios[index].pontos;
  // }

  console.log('pontuacaoTotal => ', pontuacaoTotal);

  //react => reativo (ESTADO)

  function inicializar() {
    //setNome('Joao')

    const clientesDefault = [];

    for (let index = 0; index < 10; index++) {
      clientesDefault.push({
        id: uuidv4(),
        cpf: ''.padStart(11, index.toString()),
        nome: `cliente ${index}`, //template string,
        email: 'cliente' + index.toString() + '@email.com',
        dataNascimento: '1900-01-' + index.toString().padStart(2, '0')
      })
    }

    setListaClientes(clientesDefault);
  }

  function deletar(id) {
    console.log('deletar: ', id);

    const novoArray = listaClientes.filter(c => c.id != id);
    setListaClientes(novoArray);

    // const novoArray = [];
    // listaClientes.forEach(element => {
    //   if(element.id == id)
    //     return;

    //   novoArray.push(element);
    // });

    // setListaClientes(novoArray);
  }

  function editar(id) {
    console.log('editar: ', id);

    const cliente = listaClientes.find(c => c.id == id);

    setIdCliente(cliente.id);
    setNome(cliente.nome);
    setDataNascimento(cliente.dataNascimento);
    setCpf(cliente.cpf);
    setEmail(cliente.email);
  }

  function cancelar() {
    setNome('');
    setDataNascimento('');
    setCpf('');
    setEmail('');
    setIdCliente('');
  }

  function salvar() {

    //falsy values

    //tipadas true false
    //false: false, '', null, undefined, 

    if (!nome) {
      alert('preencha o campo nome');
      return;
    }

    const usuarioComMesmoNome = listaClientes.filter(c => c.nome == nome && c.id != idCliente);

    if (usuarioComMesmoNome.length > 0) {
      alert('já existe outro cliente com o mesmo nome');
      return;
    }

    // for (let index = 0; index < listaClientes.length; index++) {
    //   const element = listaClientes[index];

    //   if(element.nome == nome) {
    //     alert('já existe outro cliente com o mesmo nome');
    //     return;
    //   }
    // }

    if (!dataNascimento) {
      alert('preencha o campo data nascimento');
      return;
    }

    if (!cpf) {
      alert('preencha o campo cpf');
      return;
    }

    if (!email) {
      alert('preencha o campo email');
      return;
    }

    const dados = {
      id: idCliente ? idCliente : uuidv4(),
      nome,
      dataNascimento,
      cpf,
      email
    };

    setNome('');
    setDataNascimento('');
    setCpf('');
    setEmail('');
    setIdCliente('');

    console.log('listaClientes =>', listaClientes)

    if (idCliente) {
      //remover da lista o cliente que estou editando
      let novaLista = listaClientes.filter(c => c.id != idCliente);

      setListaClientes([...novaLista, dados]);
    } else {
      setListaClientes([...listaClientes, dados]);
    }
  }


  console.log('RENDERIZOU OS COMPONENTES');
  console.log('listaClientes =>', listaClientes)

  return (
    <div className='bg-body-tertiary'>
      <div className='container'>

        <div className="d-flex align-items-center p-3 my-3 text-white bg-primary rounded shadow-sm">

          <i class="fa-solid fa-user-group me-3 fa-2xl"></i>
          <div className="lh-1">
            <h1 className="h6 mb-0 text-white lh-1">Cadastro de Clientes</h1>
            <small>{listaClientes.length} registros</small>
          </div>
        </div>

        {listaClientes.length == 0 && <Button
          onClick={inicializar}
          nome="Incializar"
          disabled={listaClientes.length > 0} />}

        {idCliente && <div className='alert alert-warning my-4'>
          Id Cliente selecionado: {idCliente}
        </div>}


        <div className='row'>

          <div className='col-lg-5'>
            <div class="my-3 p-3 bg-body rounded shadow-sm">
              <h6 class="border-bottom pb-2 mb-2">Dados Cliente</h6>

              <Input
                Nome="Nome"
                Id="nome"
                placeholder="Informe seu nome"
                value={nome}
                onChange={e => setNome(e.target.value)} />

              <Input
                Nome="Data de Nascimento"
                Id="data-nascimento"
                type="date"
                value={dataNascimento}
                onChange={e => setDataNascimento(e.target.value)} />

              <Input
                Nome="CPF"
                Id="cpf"
                placeholder="___.___.___-__"
                value={cpf}
                onChange={e => setCpf(e.target.value)} />

              <Input
                Nome="Email"
                Id="email"
                type="email"
                placeholder="exemplo@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)} />


              <hr />

              <Button onClick={salvar} nome="Salvar">
                <i className="fa-solid fa-floppy-disk"></i>
              </Button>

              {idCliente && <Button onClick={cancelar} nome="Cancelar" tipoBotao="btn-danger">
                <i className="fa-solid fa-xmark"></i>
              </Button>}

            </div>
          </div>

          <div className='col-lg-7'>
            <div class="my-3 p-3 bg-body rounded shadow-sm" 
            // style={{maxHeight: '400px', overflowX: 'hidden', overflowY: 'scroll'}}
            >
              <Table>
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
                  {listaClientes.map(c => {
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
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
