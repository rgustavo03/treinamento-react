
import { inicializar } from "./cliente";
import { salvarTransacoesLocalStorage } from "./transacoes";

/**
 * @param {string} idUsuario
 * @param {number} valor
 */

export function ComprarAjuda(idUsuario, valor) {

  const listaUsuarios = inicializar();

  const listaAtualizada = [];

  let certo = false;

  listaUsuarios.forEach(u => {

    if(u.id == idUsuario) {

      if(u.saldo - valor < 0) certo = false;

      else {
        u.saldo = u.saldo - valor;
        certo = true;
      }

    }

    listaAtualizada.push(u);

  });

  //----

  if(!certo) return false



  localStorage.setItem('listaCliente', JSON.stringify(listaAtualizada));


  const valorFormatado = valor.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });

  const transacao = {
    tipo: 'S',
    valor: valor,
    data: new Date(),
    descricao: `Gastou ${valorFormatado} no jogo do Milhao`
  };
  salvarTransacoesLocalStorage(idUsuario, transacao);

  return true
  
}