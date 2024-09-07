import React from "react";

export default function LinhaPontuacao({nome, etapa, premio}) {
  return (
    <tr className="linha">
      <td className="coluna" style={{ fontWeight: '600' }}>{nome}</td>
      <td className="coluna">{etapa}</td>
      <td className="coluna">{premio.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</td>
    </tr>
  )
}