
export function getPerguntas() {
  const perguntasStorage = localStorage.getItem('perguntas');

  const perguntas = perguntasStorage ? JSON.parse(perguntasStorage) : [];
  
  return perguntas;
}


//---------------


/**
 * @param {string[]} categorias
 */
export function perguntasEmbaralhadas(categorias) {
  
  let lista = getPerguntas();

  const novaLista = [];


  // até lista ficar vazio ( pegar seus dados e colocar aleatoriamente em novaLista )
  while(lista.length > 0) {

    const perg = lista[Math.floor(Math.random() * lista.length)]; // pegando pergunta em posicao aleatoria

    novaLista.push(perg); // adiociona pergunta aleatoria em novaLista

    const listaAlterada = []; // essa aqui substituirá a lista com seus dados que recebera no forEach abaixo

    // Eliminar itens da lista
    lista.forEach(p => {      
      if(p.titulo == perg.titulo) return // elimina pergunta já adicionada (diminuir lista até sobrar nada)

      if(!(categorias.includes(p.categoria))) return // elimina pergunta caso categoria não esta incluida
      
      listaAlterada.push(p);// recebe a pergunta rejeitada nas condições
    });

    lista = listaAlterada; // lista agora e uma lista sem o elemento que foi adicionado
  }

    return novaLista
}


//---------------

export function salvarPergunta(pergunta) {
  const perguntasStorage = localStorage.getItem('perguntas');

  const perguntas = perguntasStorage ? JSON.parse(perguntasStorage) : [];

  let novoRegisto = false;

  if(perguntas.length == 0) {

    perguntas.push(pergunta);
    novoRegisto = true;

  }
  else {

    const existe = perguntas.some(p => p.titulo == pergunta.titulo); // checar se pergunta ja existe

    if(existe) {

      alert('Pergunta já cadastrada');
      novoRegisto = false;

    }
    else { // Add nova pergunta

      perguntas.push(pergunta);
      novoRegisto = true;

    }

  }

  if(!novoRegisto) return

  // Salvar nova lista de pergunta
  localStorage.setItem('perguntas', JSON.stringify(perguntas));

}

