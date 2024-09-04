import React from 'react'
import Button from '../../componentes/button';
import Table from '../../componentes/table';

export default function table({ lista }) {
    return (
        <Table>
            <tbody>
                {lista.map(c => {
                    const cor = c.tipo == 'D' ? '#198754' : '#dc3545';
                    const icone = c.tipo == 'D' ? 'fa-solid fa-dollar-sign' : 'fa-solid fa-dollar-sign';

                    let dataString = c.data;

                    if(typeof(c.data) != 'string') {
                        dataString = c.data.toString();
                    }

                    let data = new Date(dataString);

                    return (
                        <tr key={c.data}>
                            <td style={{width: '1%'}}>
                                <div className={icone}
                                    style={{
                                        padding: '10px',
                                        backgroundColor: cor,
                                        fontSize: '20px',
                                        color: 'white',
                                        borderRadius: '5px'
                                    }}>

                                </div>

                            </td>
                            <td style={{width: '1%'}}>
                                <strong className='d-block text-gray-dark' style={{fontSize: '16px'}}> 
                                    {data.getDate()}/{data.getMonth()}
                                </strong>
                                <div className='text-body-secondary text-center' style={{fontSize: '10px'}}>
                                    {data.getHours()}:{data.getUTCMinutes()}
                                </div>
                            </td>
                            <td style={{ verticalAlign: 'middle' }}>{c.descricao}</td>
                            <td className='text-end' style={{ verticalAlign: 'middle' }}>{parseFloat(c.valor).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</td>
                        </tr>
                    )
                })}
            </tbody>
        </Table>
    )
}
