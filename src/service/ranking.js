import { inicializar } from "./cliente";

/**
 * @param {string} idUsuario
 * @param {number} etapa
 * @param {number} premio
 */
export function salvarPontuacaoRanking(idUsuario, etapa, premio) {
  
  const listaRanking = getRanking();

  const listaUsuarios = inicializar();

  const usuario = listaUsuarios.find(u => u.id == idUsuario); // usuario.nome

  const pontuacaoUsuario = {idUsuario: idUsuario, nome: usuario.nome, etapa: etapa, premio: premio};

  let seSuperou = false;

  const novaLista = [];


  if(listaRanking.length == 0) {

    novaLista.push(pontuacaoUsuario);
    seSuperou = true;

  }
  else {

    let usuarioEsta = false;

    listaRanking.forEach(e => {

      if(e.idUsuario == idUsuario) {

        usuarioEsta = true;

        if(premio > e.premio) { // se nova pontuacao for maior

          novaLista.push(pontuacaoUsuario);
          seSuperou = true;

        }
      }
      else {
        novaLista.push(e);
      }
    });

    if(!usuarioEsta) { // se usuario nao estiver na lista, push

      novaLista.push(pontuacaoUsuario);
      seSuperou = true;
    }
  }


  if(!seSuperou) return false


  localStorage.setItem('ranking', JSON.stringify(novaLista));

  return true

}


//------------------------


export function getRanking() {

  const getStorage = localStorage.getItem('ranking');

  const listaRanking = getStorage ? JSON.parse(getStorage) : [];

  // colocar em ordem (maior para menor)

  listaRanking.sort((a, b) => b.premio - a.premio);

  return listaRanking

}