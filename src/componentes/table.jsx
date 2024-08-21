import React from 'react'

export default function table(parametros) {
    //children - filhos

    return (
        <table className="table table-striped table-hover">
            {parametros.children}
        </table>
    )
}
