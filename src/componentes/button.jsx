import React from 'react'

export default function button({onClick, nome, children, tipoBotao, tamanho, disabled}) {

    const classeTipoBotao = tipoBotao ? tipoBotao : 'btn-success';
    const classeDisable = disabled ? 'disabled' : '';

    return (
        <button type="button"
            className={`btn ${classeTipoBotao} ${tamanho} ${classeDisable} col-12 mb-2`}
            onClick={onClick}>
            {children} {nome}
        </button>
    )
}
