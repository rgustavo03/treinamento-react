import React from 'react'
import InputMask from 'react-input-mask';

export default function inputMask(parametros) {
    const { Nome, Id, mascara, ...rest } = parametros;
    return (
        <div className="mb-3">
            <label htmlFor={Id}
                className="form-label">
                {Nome}
            </label>

            <InputMask 
                type="text"
                className="form-control"
                id={Id}
                mask={mascara}
                maskChar=""
                {...rest}
            />
        </div>
    )
}
