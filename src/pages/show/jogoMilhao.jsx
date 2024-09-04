import React, { useEffect, useState } from "react";
import Menu from "../../componentes/menu";
import { getPerguntas } from "../../service/perguntas";
import { inicializar } from "../../service/cliente";
import { salvarTransacoesLocalStorage } from "../../service/transacoes";
import Button from "../../componentes/button";

import styled from "styled-components";

import "../../css/jogo.css";

export default function ShowDoMilhao() {

  const [listaUsuarios, setListaUsuarios] = useState(inicializar()); // pega usuarios de localStorage

  const [idUsuario, setIdUsuario] = useState(''); // id do usuario para jogar

  const [perguntasStorage, setPerguntasStorage] = useState(getPerguntas()); // pega perguntas de localStorage

  //--------------

  const [jogar, setJogar] = useState(false); // toggle button

  const [listaFacil, setListaFacil] = useState([{}]); // perguntas nivel facil
  const [listaMedio, setListaMedio] = useState([{}]); // lista perguntas nivel medio
  const [listaDificil, setListaDificil] = useState([{}]); // lista perguntas nivek dificil

  const [perguntaAtual, setPerguntaAtual] = useState({}); // objeto pergunta

  const [rodada, setRodada] = useState(0); // rodadas em geral ( com pulos )
  const [rodadaNivel, setRodadaNivel] = useState(0); // a rodada que conta para avançar os niveis

  const [nivel, setNivel] = useState('facil');

  const [pulos, setPulos] = useState(0);

  const [etapa, setEtapa] = useState(1); // A que decide os valores em caso de (erro / parar)

  const infoEtapa = [
    {etapa: 1, acertar: 1000, parar: 0, errar: 0},
    {etapa: 2, acertar: 2000, parar: 1000, errar: 500},
    {etapa: 3, acertar: 3000, parar: 2000, errar: 1000},
    {etapa: 4, acertar: 4000, parar: 3000, errar: 1500},
    {etapa: 5, acertar: 5000, parar: 4000, errar: 2000},
    {etapa: 6, acertar: 10000, parar: 5000, errar: 2500},
    {etapa: 7, acertar: 20000, parar: 10000, errar: 5000},
    {etapa: 8, acertar: 30000, parar: 20000, errar: 10000},
    {etapa: 9, acertar: 40000, parar: 30000, errar: 15000},
    {etapa: 10, acertar: 50000, parar: 40000, errar: 20000},
    {etapa: 11, acertar: 100000, parar: 50000, errar: 25000},
    {etapa: 12, acertar: 200000, parar: 100000, errar: 50000},
    {etapa: 13, acertar: 300000, parar: 200000, errar: 100000},
    {etapa: 14, acertar: 400000, parar: 300000, errar: 150000},
    {etapa: 15, acertar: 500000, parar: 400000, errar: 200000},
    {etapa: 16, acertar: 1000000, parar: 500000, errar: 0}
  ];

  const [ajuda, setAjuda] = useState(true);

  const [msgAjuda, setMsgAjuda] = useState('');

  //--------------

  useEffect(() => {

    let lista = perguntasStorage;
    const novaLista = []; // recebera perguntas aleatoriamente

    const perguntasFaceis = [];
    const perguntasMedianas = [];
    const perguntasDificeis = [];

    while(lista.length > 0) {
      const perg = lista[Math.floor(Math.random() * lista.length)]; // posicao aleatoria // (lista.length - 1) ?
      novaLista.push(perg); // adiociona pergunta aleatoria em novaLista

      // Eliminar itens da lista
      const listaAlterada = []; // essa aqui substituirá a lista com seus dados que recebera no forEach abaixo
      lista.forEach(e => {
        if(e.titulo == perg.titulo) return
        listaAlterada.push(e); // recebe as perguntas (menos a que foi adicionada em novaLista)
      });
      lista = listaAlterada; // lista agora e uma lista sem o elemento que foi adicionado
    }

    novaLista.forEach(p => { // separa as peguntas por nivel e coloca em cada lista pelo respectivo nivel
      if(p.nivel == 'facil') perguntasFaceis.push(p);
      if(p.nivel == 'medio') perguntasMedianas.push(p);
      if(p.nivel == 'dificil') perguntasDificeis.push(p);
    });

    setListaFacil(perguntasFaceis);
    setListaMedio(perguntasMedianas);
    setListaDificil(perguntasDificeis);

  }, [perguntasStorage]);

  //--------------

  function iniciar() {

    if(perguntasStorage.length < 16) {
      alert('Registre mais perguntas');
      return
    }

    console.log('Jogo começou');
    setRodada(0);
    setJogar(true);

    setPerguntaAtual(listaFacil[0]); // primeira pergunta

  }

  //--------------

  useEffect(() => {
    if((rodadaNivel) == 10 && nivel == 'facil') {
      setNivel('medio');
      setRodadaNivel(0);
    }
    if((rodadaNivel) == 4 && nivel == 'medio') {
      setNivel('dificil');
      setRodadaNivel(0);
    }
  }, [rodada]);


  useEffect(() => {
    if(nivel == 'facil') setPerguntaAtual(listaFacil[(rodadaNivel + pulos)]);

    if(nivel == 'medio') setPerguntaAtual(listaMedio[(rodadaNivel + pulos)]);

    if(nivel == 'dificil') {
      if(rodadaNivel == 2) { // rodadaNivel conta para proxima, mas aparecerá mensagem e parará o jogo
        alert('Você venceu o show do Milhão');
        darPremio('milhao');
      }
      else {
        setPerguntaAtual(listaDificil[(rodadaNivel + pulos)]); // continua para proxima pergunta dificil
      }
    }
  }, [rodadaNivel, pulos]);

  //--------------

  function verificarResposta(tentativa) {

    // Caso errar a resposta
    if(tentativa != perguntaAtual.resposta) {
      alert('Perdeu');
      darPremio('errar');
      return
    }

    // Caso acertar a resposta
    setRodada((rodada + 1));
    setRodadaNivel((rodadaNivel + 1));
    setEtapa((etapa + 1)); // Etapa que conta o valor que o usuario vai receber dependendo de sua ação
    setAjuda(true);
    corAlternativas([]);
    setMsgAjuda(''); // Limpar msg de ajuda

  }

  //--------------

  function usarCarta() {

    // verifica se carta já vai usada nessa rodada
    if(!ajuda) {
      alert('Você pode usar carta na próxima rodada.');
      return // para a funcao usarCarta()
    }

    setAjuda(false); // para não poder usar a carta mais de uma vez na mesma pergunta

    const cartas = [
      {c: 'rei', v: 0},
      {c: 'as', v: 1},
      {c: '2', v: 2},
      {c: '3', v: 3}
    ];

    const el = cartas[Math.floor(Math.random() * cartas.length)]; // posicao aleatoria

    const nomeCarta = el.c;
    const qtdErradas = el.v; // qtd alternativas erradas

    if(nomeCarta == 'rei') {
      alert('Rei. Nenhuma carta para você!');
      return
    }

    const lista = [];

    for(let i = 0; i <= qtdErradas; i++) {
      const alternativa = perguntaAtual.alternativas[i].alt;
      if(alternativa != perguntaAtual.resposta) lista.push(alternativa);
    }

    corAlternativas(lista);

    // setMsgAjuda();
    alert(`${nomeCarta}. Carta(s) errada(s): ${lista}`);
  }

  function corAlternativas(lista) {
    // lista vazia significa para voltar ao estilo padrão das alternativas
    if(lista.length == 0) {
      perguntaAtual.alternativas.map(alt => {
        document.getElementById(alt.alt).style.backgroundColor = "white";
        document.getElementById(alt.alt).style.borderColor = "#00b436";
      });
      return
    }

    // Caso lista tenha elementos, mudar estilo destes: para ficar vermelhos e indicar que são as erradas
    lista.forEach(alt => {
      document.getElementById(alt).style.backgroundColor = "#f04848";
      document.getElementById(alt).style.borderColor = "#b80000";
    });
  }

  //--------------

  function convidados(tipo) {
    if(!ajuda) {
      alert('Você pode pedir ajuda na próxima rodada.');
      return // para a funcao usarCarta()
    }

    setAjuda(false); // para não poder usar a carta mais de uma vez na mesma pergunta

    let porcentagem = 100; // valor será tirado daqui e distribuido para as opcoes abaixo
    let a = 0;
    let b = 0;
    let c = 0;
    let d = 0;

    for(let i = 1; i <= 4; i++) {
      if(i == 4) {
        d = porcentagem; // pegando a porcentagem restante;
      }

      const porcentagemAleatoria = Math.floor(Math.random() * porcentagem); // Numero aleatorio (min: 0, max: porcentagem restante)
      porcentagem = porcentagem - porcentagemAleatoria; // subtrai de porcentagem o numero aleatorio obtido acima

      if(i == 1) a = porcentagemAleatoria;
      if(i == 2) b = porcentagemAleatoria;
      if(i == 3) c = porcentagemAleatoria;
    }

    const msg = `${a}% indicam (a), ${b}% indicam (b), ${c}% indicam (c) e ${d}% indicam (d).`;

    if(tipo == 'universitarios') setMsgAjuda(`Universitários: ${msg}`);
    if(tipo == 'placas') setMsgAjuda(`Placas: ${msg}`);
  }

  //--------------

  function pular() {
    if(pulos == 3) return

    setPulos((pulos + 1));

    if((3 - pulos - 1) == 0) {
      alert('Esse foi seu último pulo!');
      return
    }

    setAjuda(true); // Para garantir que carta estará disponível na próxima rodada. Mudar regra?
    corAlternativas([]); // Todas as alternativas ficarem estilo padrão
    setMsgAjuda(''); // Limpar msg de ajuda
  }

  //--------------

  function parar() { // Encerrar o jogo, resetando os dados do jogo
    alert('Você decidiu parar o jogo');
    darPremio('parar');
  }

  //--------------

  function darPremio(motivo) {
    if(motivo == 'milhao') {
      console.log('milhao');
      console.log('Você ganhou o prêmio final');
      depositar(1000000);
    }

    if(motivo == 'errar') {
      const et = infoEtapa.find(e => e.etapa == etapa);
      console.log('Você ganhou ' + et.errar);
      depositar(et.errar);
    }

    if(motivo == 'parar') {
      const et = infoEtapa.find(e => e.etapa == etapa);
      console.log('Você ganhou ' + et.parar);
      depositar(et.parar);
    }

    encerrar();
  }

  //--------------

  function encerrar() { // Encerrar o jogo, resetando os dados do jogo
    setJogar(false);
    setIdUsuario('');
    setPerguntaAtual({});
    setRodada(0);
    setRodadaNivel(0);
    setNivel('facil');
    setPulos(0);
    setEtapa(1);
  }

  //--------------

  function depositar(valor) { // listaUsuarios, setListaUsuarios
    
    const novaLista = [];

    listaUsuarios.forEach(u => {
      if(u.id == idUsuario) {
        u.saldo = u.saldo + valor;
      }
      novaLista.push(u);
    });

    setListaUsuarios(novaLista);
    localStorage.setItem('listaCliente', JSON.stringify(novaLista));

    const valorFormatado = parseFloat(valor).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });

    // Salvar transação
    const transacao = {
      tipo: 'D',
      valor: valor,
      data: new Date(),
      descricao: `Ganhou ${valorFormatado} no jogo do Milhao`
    };
    salvarTransacoesLocalStorage(idUsuario, transacao);
  }



  return (
    <>
      <Menu />

      <div className='col-lg-4'>
        <div className="my-3 p-3 bg-body rounded shadow-sm">
            <h6 className="border-bottom pb-2 mb-2">Show do Milhão</h6>

            {!jogar && // opções para selecionar se jogo não setiver sendo jogado (false)
              <select className="form-select" onChange={(e) => setIdUsuario(e.target.value)}>
                <option key="-" value="">Selecione o usuário</option>
                {listaUsuarios.map(u => {
                  return <option key={u.id} value={u.id}>{u.nome}</option>
                })}
              </select>
            }

            <br />

            {!jogar && (
              <Button onClick={iniciar} nome="" tipoBotao="" tamanho="" disabled={(idUsuario != '')? '' : 'true'}>
                Iniciar jogo
              </Button>
            )}

        </div>
      </div>


      <div className="area-jogo">
        {jogar? (

          <div className='interface'>

            <div className="cima">
              <div className="pergunta">{perguntaAtual.titulo}</div>
              <button className="parar" onClick={() => parar()}>Parar</button>
            </div>

            <div className="meio">
              <div className="alternativas">
                {perguntaAtual.alternativas.map(item => {
                  //
                  return (
                    <button id={item.alt} className="alt-button" key={item.alt} onClick={() => verificarResposta(item.alt)}>{`(${item.alt})`} {item.valor}</button>
                  )
                })}
              </div>
              <div className="ajudas">
                <div className="ajudas-cima">
                  <button className="cartas" onClick={() => usarCarta()}>Cartas</button>
                  <button className="universitarios" onClick={() => convidados('universitarios')}>Universitários</button>
                  <button className="placas" onClick={() => convidados('placas')}>Placas</button>
                </div>
                <div className="pulos">
                  {pulos == 0? <button className="pular-btn" onClick={() => pular()}>Pular</button> : <button className="pular-btn" disabled>Pular</button>}
                  {pulos <= 1? <button className="pular-btn" onClick={() => pular()}>Pular</button> : <button className="pular-btn" disabled>Pular</button>}
                  {pulos <= 2? <button className="pular-btn" onClick={() => pular()}>Pular</button> : <button className="pular-btn" disabled>Pular</button>}
                </div>
              </div>
            </div>

            <div className="msg">{msgAjuda}</div>

            <div className="baixo">
              <i>Errar: {infoEtapa[(etapa - 1)].errar.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</i>
              <i>Parar: {infoEtapa[(etapa - 1)].parar.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</i>
              <i>Acertar: {infoEtapa[(etapa - 1)].acertar.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</i>
            </div>

          </div>

        ) : (
          <>{(idUsuario != '') && <div>Clique em Iniciar jogo : {')'}</div>}</>
        )}
      </div>

      <br />
    </>
  )
}


/*
{
  titulo: '',
  alternativas: [{alt: '', valor: ''},{alt: '', valor: ''}, {alt: '', valor: ''}, {alt: '', valor: ''}],
  resposta: '',
  nivel: ''
}
*/