import React, { useEffect, useState } from "react";
import { getPerguntas } from "../../service/perguntas";

import "../../css/jogo.css";

export default function TreinamentoMilhao({treinar, setTreinar, categorias, setCategorias}) {

  const formatoPergunta = { // como se fosse fazer tipagem
    titulo: '',
    alternativas: [{alt: '', valor: ''},{alt: '', valor: ''}, {alt: '', valor: ''}, {alt: '', valor: ''}],
    resposta: '',
    nivel: ''
  }

  //--------------

  useEffect(() => {

    if(treinar) iniciar();

  }, [treinar]);


  const [jogar, setJogar] = useState(false); // toggle button

  const [listaFacil, setListaFacil] = useState([{}]); // perguntas nivel facil
  const [listaMedio, setListaMedio] = useState([{}]); // lista perguntas nivel medio
  const [listaDificil, setListaDificil] = useState([{}]); // lista perguntas nivek dificil

  const [perguntaAtual, setPerguntaAtual] = useState(formatoPergunta); // objeto pergunta

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

  const [cartas, setCartas] = useState(1);
  const [universitarios, setUniversitarios] = useState(1);
  const [placas, setPlacas] = useState(1);

  const [msgAjuda, setMsgAjuda] = useState('');


  //--------------


  function pegarPerguntas() {

    let lista = getPerguntas();
    const novaLista = []; // recebera perguntas aleatoriamente

    const perguntasFaceis = [];
    const perguntasMedianas = [];
    const perguntasDificeis = [];

    //******* WHILE -- Embaralhar perguntas, permanecer as que forem das categorias selecionadas
    while(lista.length > 0) {
      const perg = lista[Math.floor(Math.random() * lista.length)]; // posicao aleatoria // (lista.length - 1) ?

      novaLista.push(perg); // adiociona pergunta aleatoria em novaLista

      const listaAlterada = []; // essa aqui substituirá a lista com seus dados que recebera no forEach abaixo

      lista.forEach(p => { // Eliminar itens da lista

        if(p.titulo == perg.titulo) return // elimina pergunta já adicionada (diminuir lista até sobrar nada)
        if(!(categorias.includes(p.categoria))) return // elimina pergunta caso categoria não esta incluida
        listaAlterada.push(p); // recebe uma nova pergunta com as condicoes acima

      });

      lista = listaAlterada; // lista agora e uma lista sem o elemento que foi adicionado
    }
    //*******

    novaLista.forEach(p => { // separa as peguntas por nivel e coloca em cada lista, separa pergunta extra
      // Separar perguntas por nível
      if(p.nivel == 'facil') perguntasFaceis.push(p);
      if(p.nivel == 'medio') perguntasMedianas.push(p);
      if(p.nivel == 'dificil') perguntasDificeis.push(p);
    });

    setListaFacil(perguntasFaceis);
    setListaMedio(perguntasMedianas);
    setListaDificil(perguntasDificeis);

    setPerguntaAtual(perguntasFaceis[0]); // definir primeira pergunta (não gerar erro no array.map de alternativas)

    if(perguntasFaceis.length < 13 || perguntasMedianas.length < 7 || perguntasDificeis.length < 5) {
      alert('Registre mais perguntas');
      return false
    }
    return true
  }


  //--------------


  function iniciar() {

    if(categorias.length < 4) {
      alert("Selecione pelo menos três categorias");
      encerrar();
      return
    }

    const perguntas = pegarPerguntas(); // Pegar perguntas e embaralhar (primeira pergunta definida la mesmo)

    if(!perguntas) return

    console.log('Jogo começou');
    setJogar(true);

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
  }, [nivel, rodada, rodadaNivel]);


  useEffect(() => {
    if(nivel == 'facil') setPerguntaAtual(listaFacil[(rodadaNivel + pulos)]);

    if(nivel == 'medio') setPerguntaAtual(listaMedio[(rodadaNivel + pulos)]);

    if(nivel == 'dificil') {
      if(rodadaNivel == 2) { // rodadaNivel conta para proxima, mas aparecerá mensagem e parará o jogo
        alert('Fim do jogo');
        encerrar();
      }
      else {
        setPerguntaAtual(listaDificil[(rodadaNivel + pulos)]); // continua para proxima pergunta dificil
      }
    }
  }, [rodadaNivel, pulos, nivel]);


  //--------------


  /**
   * @param {string} tentativa
   */
  function verificarResposta(tentativa) {

    if(tentativa != perguntaAtual.resposta) {
      alert('Errou');
    } else {
      alert('Acertou');
    }

    setRodada((rodada + 1));
    setRodadaNivel((rodadaNivel + 1));
    setEtapa((etapa + 1));

    setMsgAjuda(''); // Limpar msg de ajuda
    setAjuda(true);
    corAlternativas([]);

  }


  //--------------


  function usarCarta() {

    // verifica se carta já vai usada nessa rodada
    if(!ajuda) {
      alert('Você pode usar carta na próxima rodada.');
      return // para a funcao usarCarta()
    }

    if(cartas == 0) {
      alert('Você está sem cartas. Pode comprar');
      return
    }

    setCartas(cartas - 1); // Diminuir cartas disponíveis

    setAjuda(false); // para não poder usar a carta mais de uma vez na mesma pergunta

    const cartasInfo = [
      {c: 'rei', v: 0},
      {c: 'as', v: 1},
      {c: '2', v: 2},
      {c: '3', v: 3}
    ];

    const el = cartasInfo[Math.floor(Math.random() * cartasInfo.length)]; // posicao aleatoria

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
      return
    }

    setAjuda(false); // para não poder usar a carta mais de uma vez na mesma pergunta

    if(tipo == 'universitarios') {
      if(universitarios == 0) return
      setUniversitarios(universitarios - 1);
    }
    if(tipo == 'placas') {
      if(placas == 0) return
      setPlacas(placas - 1);
    }

    let porcentagem = 100; // valor será tirado daqui e distribuido para as opcoes abaixo
    let a = 0;
    let b = 0;
    let c = 0;
    let d = 0;

    for(let i = 1; i <= 4; i++) {
      if(i == 4) d = porcentagem; // pegando a porcentagem restante;

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

    if((3 - pulos - 1) == 0) alert('Esse foi seu último pulo!');


    setAjuda(true); // Ajudas estarem disponíveis para próxima pergunta
    corAlternativas([]); // Todas as alternativas ficarem estilo padrão
    setMsgAjuda(''); // Limpar msg de ajuda
  }


  //--------------


  function comprarAjuda(tipo) {

    if(tipo == 'cartas') setCartas(cartas + 1);

    if(tipo == 'universitarios') setUniversitarios(universitarios + 1);

    if(tipo == 'placas') setPlacas(placas + 1);

    alert('Ajuda restaurada');

  }


  //--------------


  function parar() { // Encerrar o jogo, resetando os dados do jogo
    alert('Você decidiu parar o jogo');

    encerrar();
  }


  //--------------


  function encerrar() { // Encerrar o jogo, resetando os dados do jogo
    setJogar(false);
    setTreinar(false);
    setCategorias([""]);
    setPerguntaAtual(formatoPergunta);
    setRodada(0);
    setRodadaNivel(0);
    setNivel('facil');
    setPulos(0);
    setEtapa(1);
  }





  return (
    <>
      {jogar && (
        <>
          <div className="cima">
            <div className="pergunta">{etapa}. {perguntaAtual.titulo}</div>
            <button className="parar" onClick={() => parar()}>Parar</button>
          </div>

          <div className="meio">
            <div className="alternativas">
              {perguntaAtual.alternativas.map(item => { // botao que verifica resposta (rodada normal)
                return <button id={item.alt} className="alt-button" key={item.alt} onClick={() => verificarResposta(item.alt)}>{`(${item.alt})`} {item.valor}</button>
              })}
            </div>

            <div className="ajudas">
              <div className="ajudas-cima">

                {cartas > 0 ? (
                  <button className="cartas" onClick={() => usarCarta()}>Cartas</button>
                ) : (
                  <button className="comprar-cartas" onClick={() => comprarAjuda('cartas')}>
                    <p className="comprar-ajuda-texto">Restaurar cartas</p>
                  </button>
                )}

                {universitarios > 0 ? (
                  <button className="universitarios" onClick={() => convidados('universitarios')}>Universitários</button>
                ) : (
                  <button className="comprar-universitarios" onClick={() => comprarAjuda('universitarios')}>
                    <p className="comprar-ajuda-texto">Restaurar universitarios</p>
                  </button>
                )}

                {placas > 0 ? (
                  <button className="placas" onClick={() => convidados('placas')}>Placas</button>
                ) : (
                  <button className="comprar-placas" onClick={() => comprarAjuda('placas')}>
                    <p className="comprar-ajuda-texto">Restaurar placas</p>
                  </button>
                )}

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
            {infoEtapa[(etapa - 1)] && (
              <>
                <i>Errar: {(infoEtapa[(etapa - 1)].errar).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</i>
                <i>Parar: {(infoEtapa[(etapa - 1)].parar).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</i>
                <i>Acertar: {(infoEtapa[(etapa - 1)].acertar).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</i>
              </>
            )}
          </div>
        </>
      )}
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

/*
{
  idUsuario: '',
  nome: '',
  etapa: 5,
  prêmio: 1000000
}
*/
