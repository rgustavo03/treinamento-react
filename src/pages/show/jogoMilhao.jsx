import React, { useEffect, useState } from "react";
import Menu from "../../componentes/menu";
import { getPerguntas } from "../../service/perguntas";
import { inicializar } from "../../service/cliente";
import { salvarTransacoesLocalStorage } from "../../service/transacoes";
import Button from "../../componentes/button";

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

    alert(`${nomeCarta}. Carta(s) errada(s): ${lista}`);
  }

  //--------------

  function universitarios() {
    if(!ajuda) {
      alert('Você pode pedir ajuda aos universitários na próxima rodada.');
      return // para a funcao usarCarta()
    }

    setAjuda(false); // para não poder usar a carta mais de uma vez na mesma pergunta

    const alternativas = perguntaAtual.alternativas;
    const alternativa = alternativas[Math.floor(Math.random() * alternativas.length)];
    alert(`As placas levantadas indicam (${alternativa.alt}) ${alternativa.valor}`);
  }

  //--------------

  function placas() {
    if(!ajuda) {
      alert('Você pode usar as placas na próxima rodada.');
      return // para a funcao usarCarta()
    }

    setAjuda(false); // para não poder usar a carta mais de uma vez na mesma pergunta

    const alternativas = perguntaAtual.alternativas;
    const alternativa = alternativas[Math.floor(Math.random() * alternativas.length)];
    alert(`Os universitários acham que é a alterna tiva (${alternativa.alt}) ${alternativa.valor}`);
  }

  //--------------

  function pular() {
    if(pulos == 3) {
      alert('Você não tem mais pulos disponíveis!');
      return
    }

    setPulos((pulos + 1));

    if((3 - pulos - 1) == 0) {
      alert('Esse foi seu último pulo!');
      return
    }

    alert('Você ainda tem ' + (3 - pulos - 1) + ' pulos disponíveis!');

    setAjuda(true); // Para garantir que carta estará disponível na próxima rodada. Mudar regra?
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

    // Salvar transação
    const transacao = {
      tipo: 'D',
      valor: valor,
      data: new Date(),
      descricao: `Ganhou ${valor} no jogo do Milhao`
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
                  //
                  return <option key={u.id} value={u.id}>{u.nome}</option>
                })}
              </select>
            }

            <br />

            {!jogar && (
              <Button onClick={iniciar} nome="Iniciar jogo" tipoBotao="" tamanho="" disabled={(idUsuario != '')? '' : 'true'}>
                <i className="fa-solid fa-floppy-disk"></i>
              </Button>
            )}

        </div>
      </div>


      <div className="area-jogo">
        {jogar? (

          <div className='col-lg-4'>
            <div className="my-3 p-3 bg-body rounded shadow-sm">

              <div className="pergunta"> {/* chamar um componente, talvez */}
                <h6 className="border-bottom pb-2 mb-2">{perguntaAtual.titulo}</h6>
                <p>{perguntaAtual.nivel}</p>
                <div>
                  {perguntaAtual.alternativas.map(item => {
                    //
                    return (
                      <Button key={item.alt} nome="" tipoBotao="" tamanho="" disabled="" onClick={() => verificarResposta(item.alt)}>
                        {item.valor}
                      </Button>
                    )
                  })}
                </div>
              </div>

              <p>Acertar: {infoEtapa[(etapa - 1)].acertar}</p>
              <p>Errar: {infoEtapa[(etapa - 1)].errar}</p>
              <p>Parar: {infoEtapa[(etapa - 1)].parar}</p>

              <Button
                nome="Usar carta"
                tipoBotao="btn-warning"
                tamanho="btn-sm"
                onClick={() => usarCarta()}
                disabled={ajuda ? false : true}>
                <i className=""></i>
              </Button>

              <Button
                nome="Universitários"
                tipoBotao="btn-warning"
                tamanho="btn-sm"
                onClick={() => universitarios()}
                disabled={ajuda ? false : true}>
                <i className=""></i>
              </Button>

              <Button
                nome="Placas"
                tipoBotao="btn-warning"
                tamanho="btn-sm"
                onClick={() => placas()}
                disabled={ajuda ? false : true}>
                <i className=""></i>
              </Button>

              <Button
                nome="Pular"
                tipoBotao="btn-warning"
                tamanho="btn-sm"
                onClick={() => pular()}
                disabled={ajuda ? false : true}>
                <i className=""></i>
              </Button>

              <Button
                nome="Parar"
                tipoBotao="btn-warning"
                tamanho="btn-sm"
                onClick={() => parar()}
                disabled={ajuda ? false : true}>
                <i className=""></i>
              </Button>

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