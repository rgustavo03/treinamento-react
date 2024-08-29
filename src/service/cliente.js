
export const inicializar = () => {
    const clientesStorage = localStorage.getItem('listaCliente');

    const listaClientesStorage = clientesStorage ? JSON.parse(clientesStorage) : [];

    localStorage.setItem('listaCliente', JSON.stringify(listaClientesStorage));

    return listaClientesStorage;
}