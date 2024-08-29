
// {id: idUsuario, transacoes: [{transacao}, {transacao}, {transacao}]} -- transacao {tipo, valor, data, descricao}

export function salvarTransacoesLocalStorage(id, transacao) {

  const getStorage = localStorage.getItem('transacoes');

  const storageFiltrado = getStorage ? JSON.parse(getStorage) : [];

  if(storageFiltrado.length == 0) {

    // Se localStorage estiver vazio, inserir primeiro registro de transacao
    const dados = {id, transacoes: [transacao]};
    storageFiltrado.push(dados);

  }
  else {
    
    const existe = storageFiltrado.some(e => e.id == id); // checar se existe registro

    if(existe) {
      storageFiltrado.forEach(e => {
        if(e.id == id) {
          e.transacoes.push(transacao);
        }
      });
    }
    else {
      const dados = {id, transacoes: [transacao]};
      storageFiltrado.push(dados);
    }

  }

  // salvar alterações no localStorage
  localStorage.setItem('transacoes', JSON.stringify(storageFiltrado));
}


// ----------------------------------
// ----------------------------------


export function getTransacoes(id) {

  const getStorage = localStorage.getItem('transacoes');

  const storageFiltrado = getStorage ? JSON.parse(getStorage) : [];

  if(storageFiltrado.length == 0) {
    return storageFiltrado // retorna array vazio
  }

  let transacoes = [];

  storageFiltrado.forEach(e => {
    if(e.id == id) {
      transacoes = e.transacoes;
    }
  });
  
  return transacoes
}