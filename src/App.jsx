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

  //react => reativo (ESTADO)

  function inicializar() {
    setNome('Joao')
  }

  function salvar() {

    //falsy values

    //tipadas true false
    //false: false, '', null, undefined, 

    if(!nome) {
      alert('preencha o campo nome');
      return;
    }

    if(!dataNascimento) {
      alert('preencha o campo data nascimento');
      return;
    }

    if(!cpf) {
      alert('preencha o campo cpf');
      return;
    }

    if(!email) {
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
