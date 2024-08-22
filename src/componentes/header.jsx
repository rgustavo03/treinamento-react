import React from 'react'

export default function header({titulo, subtitulo, icone, cor }) {
    return (
        <div className={`d-flex align-items-center p-3 my-3 text-white rounded shadow-sm ${cor || 'bg-primary'}`} >

            <i className={`me-3 fa-2xl ${icone || 'fa-solid fa-folder'}`}></i>
            <div className="lh-1">
                <h1 className="h6 mb-0 text-white lh-1">{titulo}</h1>
                <small>{subtitulo}</small>
            </div>
        </div>
    )
}
