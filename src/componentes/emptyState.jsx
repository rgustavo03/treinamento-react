import React from 'react'

export default function emptyState({ mensagem, icone }) {
    return (
        <div className='row text-center' style={{paddingTop: '100px', paddingBottom: '100px', color: '#ccc'}}>
            <div className='col-12'>
                <i className={`${icone || "fa-brands fa-sistrix"}`} style={{fontSize: '80px'}}></i>
            </div>
            <div className='col-12' style={{fontSize: '30px'}}>
                {mensagem || "Nenhum item encontrado"}
            </div>
        </div>
    )
}
