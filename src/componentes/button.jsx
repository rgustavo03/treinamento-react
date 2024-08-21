import React from 'react'

export default function button({onClick, nome, children}) {

    return (
        <button type="button"
            className="btn btn-success"
            onClick={onClick}>
            {children} {nome}
        </button>
    )
}
