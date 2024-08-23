import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

import Input from '../../componentes/input';
import Button from '../../componentes/button';
import Select from '../../componentes/select'
import InputMask from '../../componentes/inputMask';
import Header from '../../componentes/header';
import EmptyState from '../../componentes/emptyState';

import Table from './table';

export default function banco() {

    const tiposTransacao = [
        { label: 'Saque', value: 'S' },
        { label: 'Depósito', value: 'D' }
    ];

    const [transacoes, setTransacoes] = useState([]);

    const [tipoTransacao, setTipoTransacao] = useState('');
    const [valor, setValor] = useState('');

    useEffect(() => {
        Transacionar('D', 1000, 'Saldo Inicial');
    }, []);

    function Transacionar(tipo, valorTransacao, descricaoTransacao) {

        const valorInformado = parseFloat(valorTransacao);

        if (!valorInformado) {
            alert('Preencha o valor');
            return;
        }

        if (!parseFloat(valorInformado)) {
            alert('Preencha com um valor válido');
            return;
        }

        if (parseFloat(valorInformado) <= 0) {
            alert('Preencha com um valor maior que zero');
            return;
        }

        if (tipo == 'S') {
            const saldoAtual = CalcularSaldo();

            if (saldoAtual < valorInformado) {
                alert('Saldo insuficiente');
                return;
            }
        }

        const dados = {
            tipo: tipo,
            valor: valorInformado,
            data: new Date(),
            descricao: descricaoTransacao
        };

        setTransacoes([...transacoes, dados]);

        setTipoTransacao('');
        setValor('');
    }

    function MovimentarConta() {
        const descricao =
            (tipoTransacao == 'D' ? 'Depósito realizado na Agência #' : 'Depósito realizado na Agência #') +
            Math.floor(Math.random() * 100);

        Transacionar(tipoTransacao, valor, descricao);
    }

    function Cancelar() {
        setTipoTransacao('');
        setValor('');
    }

    function CalcularSaldo() {
        const saldo = transacoes.reduce((valorAtual, itemAtual) =>
            valorAtual + (itemAtual.tipo == 'D' ? itemAtual.valor : (itemAtual.valor * -1)), 0);

        return saldo;
    }

    return (
        <div className='bg-body-tertiary'>
            <div className='container'>

                <Header
                    titulo="DC Bank"
                    subtitulo={`${transacoes.length} registros`}
                    icone="fa-solid fa-landmark" />


                <div className='row'>

                    <div className='col-lg-4'>
                        <div className="my-3 p-3 bg-body rounded shadow-sm">
                            <h6 className="border-bottom pb-2 mb-2">Dados Transação</h6>

                            <Select
                                Nome="Tipo Transação"
                                Id="tipo-transacao"
                                Opcoes={tiposTransacao}
                                value={tipoTransacao}
                                onChange={e => setTipoTransacao(e.target.value)} />

                            {tipoTransacao && <>
                                <Input
                                    Nome={tipoTransacao == "S" ? "Valor Saque" : "Valor Depósito"}
                                    Id="valor"
                                    placeholder={"R$ 0,00"}
                                    value={valor}
                                    onChange={e => setValor(e.target.value)} />

                                <Button
                                    onClick={MovimentarConta}
                                    nome="Movimentar Conta"
                                    tipoBotao={tipoTransacao == 'D' ? 'btn-success' : 'btn-danger'}>
                                    {tipoTransacao == 'D' ? <i className="fa-solid fa-check"></i> :
                                        <i className="fa-solid fa-money-bills"></i>}
                                </Button>

                                <Button onClick={Cancelar} nome="Cancelar" tipoBotao="btn-outline-danger">
                                    <i className="fa-solid fa-xmark"></i>
                                </Button>
                            </>}

                        </div>
                    </div>

                    <div className='col-lg-8'>
                        <div className="my-3 p-3 bg-body rounded shadow-sm">
                            {transacoes.length > 0 && <>
                                <Table lista={transacoes} />
                                <div>
                                    <strong>Total:</strong> {CalcularSaldo().toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}
                                </div>
                            </>}

                            {transacoes.length == 0 && <EmptyState mensagem="Nenhuma transação realizada" icone="fa-solid fa-money-bill-transfer" />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
