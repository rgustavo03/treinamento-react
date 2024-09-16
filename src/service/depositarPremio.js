
/**
 * @param {string} idUsuario
 * @param {number} valor
 */
export function depositarPremio(listaUsuarios, idUsuario, valor) {
  
  const novaLista = [];

  listaUsuarios.forEach(u => {
    if(u.id == idUsuario) {
      u.saldo = u.saldo + valor; // adicionar o valor
    }
    novaLista.push(u);
  });

  localStorage.setItem('listaCliente', JSON.stringify(novaLista)); // salvar lista atualizada no LocalStorage

  return novaLista

}