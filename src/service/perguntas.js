
export function getPerguntas() {
  const perguntasStorage = localStorage.getItem('perguntas');

  const perguntas = perguntasStorage ? JSON.parse(perguntasStorage) : [];

  localStorage.setItem('perguntas', JSON.stringify(perguntas));

  return perguntas;
}

//---------------
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

