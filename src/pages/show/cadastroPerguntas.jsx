import React, { useState } from "react";
import Menu from "../../componentes/menu";
import { getPerguntas, salvarPergunta } from "../../service/perguntas";

import Input from "../../componentes/input";
import Button from '../../componentes/button';

import "../../css/cadastroperguntas.css"


export default function CadastroPerguntas() {

  const formatoPergunta = {
    titulo: '',
    alternativas: [{alt: '', valor: ''},{alt: '', valor: ''}, {alt: '', valor: ''}, {alt: '', valor: ''}],
    resposta: '',
    nivel: ''
  }

  const [listaPerguntas, setListaPerguntas] = useState(getPerguntas() || [formatoPergunta]);

  const [titulo, setTitulo] = useState('');
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [c, setC] = useState('');
  const [d, setD] = useState('');
  const [resposta, setResposta] = useState('');
  const [nivel, setNivel] = useState('');
  const [categoria, setCategoria] = useState('');

  //----------

  function salvar() {

    if(titulo == '' || a == '' || b == '' || c == '' || d == '' || resposta == '' || nivel == '') {
      alert('Preencha todos os campos');
      return
    }

    const pergunta = {
      titulo: titulo,
      alternativas: [{alt: 'a', valor: a}, {alt: 'b', valor: b}, {alt: 'c', valor: c}, {alt: 'd', valor: d}],
      resposta: resposta,
      nivel: nivel,
      categoria: categoria
    };

    salvarPergunta(pergunta);

    setListaPerguntas(getPerguntas());

  }



  return (
    <>
      <Menu />

      <div className='col-lg-4'>
        <div className="my-3 p-3 bg-body rounded shadow-sm">
            <h6 className="border-bottom pb-2 mb-2">Cadastro de perguntas do show do milhão</h6>
            <form>
              <Input Nome="Enunciado" Id="titulo" placeholder="Enunciado da pergunta.." onChange={(e) => setTitulo(e.target.value)} />
      
              <Input Nome="Alternativa (a)" Id="a" placeholder="(a)" onChange={(e) => setA(e.target.value)} />
      
              <Input Nome="Alternativa (b)" Id="b" placeholder="(b)" onChange={(e) => setB(e.target.value)} />
      
              <Input Nome="Alternativa (c)" Id="c" placeholder="(c)" onChange={(e) => setC(e.target.value)} />
      
              <Input Nome="Alternativa (d)" Id="d" placeholder="(d)" onChange={(e) => setD(e.target.value)} />

              <br />
      
              <select name="resposta" className="form-select" onChange={(e) => setResposta(e.target.value)}>
                <option value="">Selecione a alternativa correta</option>
                <option value="a">{'a)'}</option>
                <option value="b">{'b)'}</option>
                <option value="c">{'c)'}</option>
                <option value="d">{'d)'}</option>
              </select>

              <br />
      
              <select name="nivel" className="form-select" onChange={(e) => setNivel(e.target.value)}>
                <option value="">Selecione o nível da pergunta</option>
                <option value="facil">Fácil</option>
                <option value="medio">Médio</option>
                <option value="dificil">Difícil</option>
              </select>

              <br />

              <select name="categoria" className="form-select" onChange={(e) => setCategoria(e.target.value)}>
                <option value="">Selecione a categoria</option>
                <option value="geral">Geral</option>
                <option value="matematica">Matemática</option>
                <option value="geografia">Geografia</option>
                <option value="ciencias">Ciências</option>
                <option value="historia">História</option>
              </select>

              <br />
      
            </form>

            <Button onClick={salvar} nome="Salvar" tipoBotao="" tamanho="" disabled="">
              <i className="fa-solid fa-floppy-disk"></i>
            </Button>
        </div>
      </div>


      <div className="lista-perguntas">
        {listaPerguntas.map(p => {
          //
          return (
            <p>{p.titulo} | {p.nivel}</p>
          )
        })}
      </div>

    </>
  )
}
