import { v4 as uuidv4 } from 'uuid';
import { faker } from '@faker-js/faker';

export const salvarCliente = (dadosCliente) => {
    
    if (!dadosCliente.nome) 
        throw new Error('preencha o campo nome');

    // const usuarioComMesmoNome = listaClientes.filter(c => c.nome == nome && c.id != idCliente);

    // if (usuarioComMesmoNome.length > 0) 
    //     throw new Error('já existe outro cliente com o mesmo nome');

    if (dadosCliente.tipoCliente == 'PF' && !dadosCliente.dataNascimento) 
        throw new Error('preencha o campo data nascimento');

    if (!dadosCliente.cpf) 
        throw new Error('preencha o campo cpf');

    if (!dadosCliente.email) 
        throw new Error('preencha o campo email');

    if (!dadosCliente.senha) 
        throw new Error('preencha o campo senha');

    if (!dadosCliente.confirmacaoSenha) 
        throw new Error('preencha o campo confirmação senha');

    if (dadosCliente.senha != dadosCliente.confirmacaoSenha) 
        throw new Error('senha não confere com a confirmação');
}

export const inicializar = () => {
    const clientesStorage = localStorage.getItem('listaCliente');

    const listaClientesStorage = clientesStorage ? JSON.parse(clientesStorage) : [];

    if (!listaClientesStorage || listaClientesStorage.length == 0) {
      const clientesDefault = [];

      for (let index = 0; index < 10; index++) {
        clientesDefault.push({
          id: uuidv4(),
          cpf: index % 2 == 0 ? ''.padStart(11, '1') : ''.padStart(14, '2'),
          nome: faker.person.fullName(),
          email: faker.internet.email(),
          dataNascimento: '1900-01-' + (index + 1).toString().padStart(2, '0'),
          tipoCliente: index % 2 == 0 ? 'PF' : 'PJ'
        })
      }

      localStorage.setItem('listaCliente', JSON.stringify(clientesDefault));

      return clientesDefault;
    } else {
        return listaClientesStorage;
    }
}