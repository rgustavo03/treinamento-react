import React from 'react'
import Button from '../../componentes/button';
import Table from '../../componentes/table';

export default function TableCliente({ lista, idCliente, editar, deletar }) {
    return (
        <Table>
            <thead>
                <tr>
                    <th>Nome</th>
                    <th>Saldo</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {lista.map(c => {
                    return (
                        <tr key={c.id}>
                            <td>{c.nome}</td>
                            <td>{c.saldo.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</td>
                            
                            <td>
                                <Button
                                    nome="Editar"
                                    tipoBotao="btn-warning"
                                    tamanho="btn-sm"
                                    onClick={() => editar(c.id)}
                                    disabled={idCliente ? true : false}>
                                    <i className="fa-solid fa-pencil"></i>
                                </Button>

                                <Button
                                    nome="Deletar"
                                    tipoBotao="btn-danger"
                                    tamanho="btn-sm"
                                    onClick={() => deletar(c.id)}
                                    disabled={idCliente ? true : false}>
                                    <i className="fa-regular fa-trash-can"></i>
                                </Button>
                            </td>
                        </tr>
                    )
                })}
            </tbody>
        </Table>
    )
}
