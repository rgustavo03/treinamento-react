import React, { useEffect, useState } from "react";

import "../../css/transacoes.css";
import { getTransacoes } from "../../service/transacoes";
import { LinhaTransacao } from "../../componentes/linhaTransacao";

export const ShowTransacoes = ({usuario, alteracaoTransacoes}) => {


  const formatoTransacao = { data: '', descricao: '', tipo: '', valor: 0 };

  const [transacoes, setTransacoes] = useState([formatoTransacao]); // lista de transacoes do usuario (definido no useEffect abaixo)

  useEffect(() => { // buscar transacoes do usuario no localStorage

    if(!usuario) return

    const transacoesUsuario = getTransacoes(usuario.id); // funcao que retorna transacoes (transacoes.js)
    setTransacoes(transacoesUsuario);

  }, [usuario, alteracaoTransacoes]);


  //-----------------


  const [listaDatas, setListaDatas] = useState(['']); // datas de transacoes (array de strings)

  // Cria lista de datas (datas de transacoes) -- salva apenas as datas em string (dia/mês)
  useEffect(() => {

    if(transacoes.length == 0) return

    let novaListaDatas = [''];
    novaListaDatas.pop(); // retira elemento que a lista começa (elemento é para definir tipo) -> typescript :(


    transacoes.forEach(t => {
      let dataString = t.data; // recebe data do jeito que vier
      if(typeof(t.data) == 'string') dataString = t.data.toString(); // converte data em string
      let dataObj = new Date(dataString); // converte data em objeto data (para pegar dia e mês)
      let data = `${dataObj.getDate()}/${dataObj.getMonth()}`; // converte a data em string (dia/mês);
      if(!novaListaDatas.includes(data)) novaListaDatas.push(data); // add em novaListaDatas
    });


    setListaDatas(novaListaDatas.reverse()); // novo array de datas -- datas são invertidas (data mais recentes primeiro)

    setTransacoes(transacoes.reverse()); // inverter ordem das transações (horários mais recentes primeiros)

  }, [transacoes]);




  return (
    <div className='col-lg-8'>
      <div className="my-3 p-3 bg-body rounded shadow-sm">
        <h6 className="border-bottom pb-2 mb-2">Transações</h6>

        <div className="table-responsive">
          <table className="table table-hover">

            {listaDatas.map(d => {

              const getData = new Date();
              const dataAtual = `${getData.getDate()}/${getData.getMonth()}`;

              return (
                <div key={d} className="data-transacoes">

                  <h5>{d == dataAtual? 'Hoje' : d}</h5>{/* caso seja data atual, "Hoje" */}

                  {transacoes.map(t => {
                    const cor = t.tipo == 'D' ? '#198754' : '#dc3545'; // verde : vermelho
                    const icone = 'fa-solid fa-dollar-sign'; // simbolo dólar

                    const dataString = typeof(t.data) == 'string' ? t.data : t.data.toString();
                    const dataObj = new Date(dataString);
                    const data = `${dataObj.getDate()}/${dataObj.getMonth()}`;

                    if(data == d) {
                      return (
                        <LinhaTransacao
                          data={data}
                          icone={icone}
                          cor={cor}
                          hora={`${dataObj.getHours()}:${dataObj.getMinutes()}`}
                          descricao={t.descricao} valor={t.valor.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}
                        />
                      )
                    }
                  })}

                </div>
              )
            })}

          </table>
        </div>

      </div>
    </div>
  )
}
