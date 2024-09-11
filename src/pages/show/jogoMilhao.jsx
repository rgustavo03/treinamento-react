import React, { useEffect, useState } from "react";
import Menu from "../../componentes/menu";
import { getPerguntas } from "../../service/perguntas";
import { inicializar } from "../../service/cliente";
import { salvarTransacoesLocalStorage } from "../../service/transacoes";
import Button from "../../componentes/button";

import "../../css/jogo.css";
import { ComprarAjuda } from "../../service/compraAjuda";
import { getRanking, salvarPontuacaoRanking } from "../../service/ranking";
import LinhaPontuacao from "./linhaPontuacao";
import { Link } from "react-router-dom";
import TreinamentoMilhao from "./treinamento";

export default function ShowDoMilhao() {

  const formatoPergunta = { // como se fosse fazer tipagem
    titulo: '',
    alternativas: [{alt: '', valor: ''},{alt: '', valor: ''}, {alt: '', valor: ''}, {alt: '', valor: ''}],
    resposta: '',
    nivel: ''
  }

  const [listaUsuarios, setListaUsuarios] = useState(inicializar()); // pega usuarios de localStorage

  const [idUsuario, setIdUsuario] = useState(''); // id do usuario para jogar

  const [pontuacoes, setPontuacoes] = useState(getRanking());

  //--------------

  const [jogar, setJogar] = useState(false); // toggle button
  const [treinar, setTreinar] = useState(false); // toggle button

  const [listaFacil, setListaFacil] = useState([{}]); // perguntas nivel facil
  const [listaMedio, setListaMedio] = useState([{}]); // lista perguntas nivel medio
  const [listaDificil, setListaDificil] = useState([{}]); // lista perguntas nivek dificil

  const infoCategorias = ["geral", "geografia", "matematica", "ciencias", "historia"];

  const [categorias, setCategorias] = useState([""]);

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

  const [perguntaExtra, setPerguntaExtra] = useState(formatoPergunta); // objeto pergunta extra
  const [etapaExtra, setEtapaExtra] = useState(0); // quanto pergunta extra irá aparecer
  const [extra, setExtra] = useState(1); // ponto extra (multiplicação do prêmio)

  const [ajuda, setAjuda] = useState(true);

  const [cartas, setCartas] = useState(1);
  const [universitarios, setUniversitarios] = useState(1);
  const [placas, setPlacas] = useState(1);

  const [msgAjuda, setMsgAjuda] = useState('');

  //--------------

  function changeCategorias(checked, valor) {

    const incluiValor = categorias.includes(valor);

    if(checked) { // se estiver checado, add item a categorias

      if(!incluiValor) setCategorias([...categorias, valor]);

    } else { // nao estiver checado, remover item de categorias

      const novaListaCategorias = [];

      categorias.forEach(c => {
        if(c != valor) novaListaCategorias.push(c);
      });

      setCategorias(novaListaCategorias);
    }
  }

  //--------------

  function pegarPerguntas() {

    let lista = getPerguntas();
    const novaLista = []; // recebera perguntas aleatoriamente

    const perguntasFaceis = [];
    const perguntasMedianas = [];
    const perguntasDificeis = [];

    const indexRandom = Math.floor(Math.random() * (infoEtapa.length - 1));

    setEtapaExtra(indexRandom);

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
      // Separar pergunta extra
      if(perguntaExtra.titulo.length == 0) {
        if(indexRandom < 10 && p.nivel == 'facil') setPerguntaExtra(p);
        if(indexRandom >= 10 && indexRandom < 14 && p.nivel == 'medio') setPerguntaExtra(p);
        if(indexRandom >= 14 && p.nivel == 'dificil') setPerguntaExtra(p);
      }

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

    if(idUsuario.length == 0) {
      alert("Selecione um usuário");
      return
    }

    if(categorias.length < 4) {
      alert("Selecione pelo menos três categorias");
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
        alert('Você venceu o show do Milhão');
        darPremio('milhao');
      }
      else {
        setPerguntaAtual(listaDificil[(rodadaNivel + pulos)]); // continua para proxima pergunta dificil
      }
    }
  }, [rodadaNivel, pulos, nivel]);

  //--------------

  /**
   * @param {string} tentativa
   * @param {string} tipo
   */
  function verificarResposta(tentativa, tipo) {
    if(tipo == 'extra') {
      if(tentativa != perguntaExtra.resposta) {
        alert('Perdeu');
        darPremio('errar-extra'); // erro-extra, perde tudo 'Perdeu tudo na pergunta extra'
        return
      }
      setExtra(extra + 1);
      setEtapaExtra(0);
      alert('Parabéns. Prêmio dobrado!');
    }

    if(tipo == 'normal') {
      // Caso errar a resposta
      if(tentativa != perguntaAtual.resposta) {
        alert('Perdeu');
        darPremio('errar');
        return
      }
      // Acertar resposta
      alert('Acertou');
      setRodada((rodada + 1));
      setRodadaNivel((rodadaNivel + 1));
      setEtapa((etapa + 1));
    }

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

  /**
   * @param {string} tipo
   */
  function pular(tipo) {
    if(tipo == 'normal') {
      if(pulos == 3) return

      setPulos((pulos + 1));

      if((3 - pulos - 1) == 0) alert('Esse foi seu último pulo!');
    }

    if(tipo == 'extra') {
      setEtapaExtra(0);
      alert('Pergunta extra rejeitada ( :');
    }

    setAjuda(true); // Ajudas estarem disponíveis para próxima pergunta
    corAlternativas([]); // Todas as alternativas ficarem estilo padrão
    setMsgAjuda(''); // Limpar msg de ajuda
  }

  //--------------

  function comprarAjuda(tipo) {

    //let certo = false;
    let certo = ComprarAjuda(idUsuario, 3000);

    if(tipo == 'cartas') {
      //certo = ComprarAjuda(idUsuario, 4000);
      if(!certo) {
        alert("Você não tem saldo para esta compra");
        return
      }
      setCartas(cartas + 1);

    }

    if(tipo == 'universitarios') {
      //certo = ComprarAjuda(idUsuario, 2000);
      if(!certo) {
        alert("Você não tem saldo para esta compra");
        return
      }
      setUniversitarios(universitarios + 1);

    }

    if(tipo == 'placas') {
      //certo = ComprarAjuda(idUsuario, 2000);
      if(!certo) {
        alert("Você não tem saldo para esta compra");
        return
      }
      setPlacas(placas + 1);

    }

    alert('Ajuda descontada na sua conta : )');

  }
  //--------------

  function parar() { // Encerrar o jogo, resetando os dados do jogo
    alert('Você decidiu parar o jogo');

    if(etapa == 1) {
      encerrar();
      return
    }

    darPremio('parar');
  }


  useEffect(() => {
    if(!treinar) setIdUsuario('');
  }, [treinar]);

  //--------------

  function darPremio(motivo) {
    if(motivo == 'errar') {
      const et = infoEtapa.find(e => e.etapa == etapa);
      if(et.errar == 0) {
        alert(`Ganhou nada!`);
      }
      else {
        alert(`Você ganhou ${et.errar}`);
        depositar(et.errar);
        salvarPontuacao(et.errar); // Salvar ranking do usuário
      }
    }

    if(motivo == 'parar') {
      const et = infoEtapa.find(e => e.etapa == etapa);
      alert(`Você ganhou ${et.parar}`);
      depositar(et.parar);
      salvarPontuacao(et.parar); // Salvar ranking do usuário
    }

    if(motivo == 'errar-extra') {
      alert(`Você errou a pergunta extra. Perdeu tudo`);
      // Só isso mesmo :D
    }

    if(motivo == 'milhao') {
      alert(`Você ganhou o prêmio final`);
      depositar(1000000);
      salvarPontuacao(1000000); // Salvar ranking do usuário
    }

    encerrar(); // resetar dados do jogo
  }

  //--------------

  function salvarPontuacao(premio) {
    const seSuperou = salvarPontuacaoRanking(idUsuario, etapa, (premio * extra));

    if(seSuperou) { // Significa que teve alterações na lista de pontuação
      alert("Você superou seu resultado anterior!");
      setPontuacoes(getRanking); // atualizar o state
    }
  }

  //--------------

  function encerrar() { // Encerrar o jogo, resetando os dados do jogo
    setJogar(false);
    setIdUsuario('');
    setCategorias([""]);
    setPerguntaAtual(formatoPergunta);
    setPerguntaExtra(formatoPergunta);
    setRodada(0);
    setRodadaNivel(0);
    setNivel('facil');
    setPulos(0);
    setEtapa(1);
  }

  //--------------

  /**
   * @param {number} valor
   */
  function depositar(valor) { // listaUsuarios, setListaUsuarios
    
    const novaLista = [];

    listaUsuarios.forEach(u => {
      if(u.id == idUsuario) {
        u.saldo = u.saldo + (valor * extra); // extra pode ser 1 ou 2
      }
      novaLista.push(u);
    });

    setListaUsuarios(novaLista);
    localStorage.setItem('listaCliente', JSON.stringify(novaLista));

    const valorFormatado = (valor * extra).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });

    // Salvar transação
    const transacao = {
      tipo: 'D',
      valor: valor * extra, // extra pode ser 1 ou 2
      data: new Date(),
      descricao: `Ganhou ${valorFormatado} no jogo do Milhao`
    };
    salvarTransacoesLocalStorage(idUsuario, transacao);
  }



  return (
    <>
      <Menu />


      <br />


      <div className="area-jogo">
        
        <div className='interface'>



        {(!jogar && !treinar) && (
          <i className="logo"></i>
        )}




          {/* Iniciar jogo */}
          {(!jogar && !treinar) && (
            <div className="inicio">

              {/************* Usuário e Categorias e Iniciar (Partida / Treinamento) *************/}
              <div className="col-lg-4">
                <div className="my-3 p-3 bg-body rounded shadow-sm">
                    <h6 className="border-bottom pb-2 mb-2">Show do Milhão</h6>

                    <select className="form-select" onChange={(e) => setIdUsuario(e.target.value)}>
                      <option key="-" value="">Selecione o usuário</option>
                      {listaUsuarios.map(u => {
                        return <option key={u.id} value={u.id}>{u.nome}</option>
                      })}
                    </select>              

                    <br />

                    <div className="categorias">
                      {infoCategorias.map(categoria => {
                        //
                        return (
                          <div key={`div-${categoria}`} className="categoria-opcao">
                            <label htmlFor={categoria}>{categoria}</label>
                            <input 
                              key={categoria}
                              name={categoria}
                              type="checkbox"
                              value={categoria}
                              onChange={(e) => changeCategorias(e.target.checked, categoria)}
                            />
                          </div>
                        )
                      })}
                    </div>
                </div>


                <div className="left-btn">

                  {!jogar && <button onClick={iniciar} className="iniciar-btn">Iniciar jogo</button> }

                  <button onClick={() => setTreinar(true)} className="treinamento-btn">Treinamento</button>

                </div>

              </div>

              {/************* Pontuações *************/}
              <div className="col-lg-4">
                <div className="my-3 p-3 bg-body rounded shadow-sm">

                  <h6 className="border-bottom pb-2 mb-2">Ranking</h6>

                  <table className="tabela-pontuacoes">
                    <tbody>
                      <tr className="topo">
                        <th className="table-th">Jogador</th>
                        <th className="table-th">Etapa</th>
                        <th className="table-th">Prêmio</th>
                      </tr>
                      {pontuacoes.map(p => {
                        return (
                          <LinhaPontuacao key={`pontuacao-${p.idUsuario}`} nome={p.nome} etapa={p.etapa} premio={p.premio} />
                        )
                      })}
                    </tbody>
                  </table>

                </div>
              </div>

            </div>
          )}




          {jogar && (
            <>
              <div className="cima">
                {etapaExtra != etapa? (
                  <div className="pergunta">{etapa}. {perguntaAtual.titulo}</div> // Pergunta normal
                ) : (
                  <div className="pergunta">Extra. {perguntaExtra.titulo}</div> // Pergunta extra
                )}
                <button className="parar" onClick={() => parar()}>Parar</button>
              </div>

              <div className="meio">
                <div className="alternativas">
                  {etapaExtra != etapa? ( // rodada normal
                    <>
                      {perguntaAtual.alternativas.map(item => { // botao que verifica resposta (rodada normal)
                        return <button id={item.alt} className="alt-button" key={item.alt} onClick={() => verificarResposta(item.alt, 'normal')}>{`(${item.alt})`} {item.valor}</button>
                      })}
                    </>
                  ) : ( // etapa extra
                    <>
                      {perguntaExtra.alternativas.map(item => { // botao que verifica resposta da rodada extra (parametro)
                        return <button id={item.alt} className="alt-button" key={item.alt} onClick={() => verificarResposta(item.alt, 'extra')}>{`(${item.alt})`} {item.valor}</button>
                      })}
                    </>
                  )}
                </div>

                <div className="ajudas">
                  <div className="ajudas-cima">

                    {cartas > 0 ? (
                      <button className="cartas" onClick={() => usarCarta()}>Cartas</button>
                    ) : (
                      <button className="comprar-cartas" onClick={() => comprarAjuda('cartas')}>
                        <p className="comprar-ajuda-texto">Comprar cartas</p>
                        <p className="comprar-ajuda-preco">R$ 3000</p>
                      </button>
                    )}

                    {universitarios > 0 ? (
                      <button className="universitarios" onClick={() => convidados('universitarios')}>Universitários</button>
                    ) : (
                      <button className="comprar-universitarios" onClick={() => comprarAjuda('universitarios')}>
                        <p className="comprar-ajuda-texto">Comprar universitarios</p>
                        <p className="comprar-ajuda-preco">R$ 3000</p>
                      </button>
                    )}

                    {placas > 0 ? (
                      <button className="placas" onClick={() => convidados('placas')}>Placas</button>
                    ) : (
                      <button className="comprar-placas" onClick={() => comprarAjuda('placas')}>
                        <p className="comprar-ajuda-texto">Comprar placas</p>
                        <p className="comprar-ajuda-preco">R$ 3000</p>
                      </button>
                    )}

                  </div>
                  <div className="pulos">
                    {etapa != etapaExtra ? (
                      <>
                        {pulos == 0? <button className="pular-btn" onClick={() => pular('normal')}>Pular</button> : <button className="pular-btn" disabled>Pular</button>}
                        {pulos <= 1? <button className="pular-btn" onClick={() => pular('normal')}>Pular</button> : <button className="pular-btn" disabled>Pular</button>}
                        {pulos <= 2? <button className="pular-btn" onClick={() => pular('normal')}>Pular</button> : <button className="pular-btn" disabled>Pular</button>}
                      </>
                    ) : (
                      <button className="pular-btn" onClick={() => pular('extra')}>Pular</button>
                    )}
                  </div>
                </div>
              </div>

              <div className="msg">{msgAjuda}</div>

              <div className="baixo">
                {etapa != etapaExtra ? (
                  <>
                    {infoEtapa[(etapa - 1)] && (
                      <>
                        <i>Errar: {(infoEtapa[(etapa - 1)].errar * extra).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</i>
                        <i>Parar: {(infoEtapa[(etapa - 1)].parar * extra).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</i>
                        <i>Acertar: {(infoEtapa[(etapa - 1)].acertar * extra).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</i>
                      </>
                    )}
                  </>
                ) : ( // Quando for a pergunta secreta
                  <i>Dobre seu prêmio caso acerte a pergunta. É opcional respondê-la.</i>
                )}
              </div>
            </>
          )}




          <TreinamentoMilhao
            treinar={treinar}
            setTreinar={setTreinar}
            categorias={categorias}
            setCategorias={setCategorias}
          />




        </div>

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

/*
{
  idUsuario: '',
  nome: '',
  etapa: 5,
  prêmio: 1000000
}
*/
