
export function bancoService() {
  const clientesStorage = localStorage.getItem('listaCliente');

  const listaClientesStorage = clientesStorage ? JSON.parse(clientesStorage) : [];

  return listaClientesStorage
}