import React from "react"

export const LinhaTransacao = ({data, icone, cor, hora, descricao, valor}) => {

  //

  return (
    <tr key={data}>
      <td style={{width: '1%'}}>
        <div className={icone} style={{ padding: '10px', backgroundColor: cor, fontSize: '20px', color: 'white', borderRadius: '5px' }}></div>
      </td>

      <td style={{width: '1%'}}>
        <div className='text-body-primary text-center' style={{fontSize: '16px'}}>
          {hora}
        </div>
      </td>

      <td style={{ verticalAlign: 'middle' }}>
        {descricao}
      </td>

      <td className='text-end' style={{ verticalAlign: 'middle' }}>
        {valor}
      </td>
    </tr>
  )
}