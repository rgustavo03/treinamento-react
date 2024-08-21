import { useState } from 'react';
import Input from './componentes/input';
import Button from './componentes/button';
import Table from './componentes/table';
import { v4 as uuidv4 } from 'uuid';

function App() {

  //let nome = '';
  const [listaClientes, setListaClientes] = useState([])

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
    setNome('Joao')
  }

  function salvar() {

    //falsy values

    //tipadas true false
    //false: false, '', null, undefined, 

    if (!nome) {
      alert('preencha o campo nome');
      return;
    }

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
      id: uuidv4(),
      nome,
      dataNascimento,
      cpf,
      email
    };

    setNome('');
    setDataNascimento('');
    setCpf('');
    setEmail('');

    console.log('listaClientes =>', listaClientes)

    setListaClientes([...listaClientes, dados]);
  }


  console.log('RENDERIZOU OS COMPONENTES');
  console.log('listaClientes =>', listaClientes)

  return (
    <>
      <h1>Cadastro de Cliente</h1>
      <Button onClick={inicializar} nome="Incializar" />

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

      <Button onClick={salvar} nome="Salvar">
        <i className="fa-solid fa-floppy-disk"></i>
      </Button>


      <Table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Data Nascimento</th>
            <th>Cpf</th>
            <th>Email</th>
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
              </tr>
            )
          })}
        </tbody>
      </Table>

    </>
  )
}

export default App
