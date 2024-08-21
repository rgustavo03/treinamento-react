import React from 'react'

export default function input(parametros) {

    //javascript
    //destructuring (desestruturação)
    //rest operator (resto)
    //spread operator (espalhar)
    const { Nome, Id, ...rest } = parametros; // {Nome: 'CPF', Id: 'cpf'}

    //{Nome: 'CPF', Id: 'cpf', 
        //placeholder: '___.___.___-__'}

    //{Nome: 'Data de Nascimento', Id: 'data-nascimento', 
        //informacoesExtra: 'fdslkjhsdlkjdshlkdsj',
        //placeholder: '___.___.___-__'}


    // console.log('parametros =>', parametros);
    // console.log('resto =>', rest);

    return (
        <div className="mb-3">
            <label htmlFor={Id}
                className="form-label">
                {Nome}
            </label>

            <input 
                type="text"
                className="form-control"
                id={Id}
                {...rest}
                />
        </div>
    )
}