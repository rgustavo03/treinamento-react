
export function getMsgAjuda() {

  // valor será tirado daqui e distribuido para as opcoes abaixo
  let porcentagem = 100;

  let a = 0;
  let b = 0;
  let c = 0;
  let d = 0;

  for(let i = 1; i <= 4; i++) {
    if(i == 4) d = porcentagem; // pegando a porcentagem restante;

    // Numero aleatorio (min: 0, max: porcentagem restante)
    const porcentagemAleatoria = Math.floor(Math.random() * porcentagem);

    // subtrai de porcentagem o numero aleatorio obtido acima
    porcentagem = porcentagem - porcentagemAleatoria; 

    if(i == 1) a = porcentagemAleatoria;
    if(i == 2) b = porcentagemAleatoria;
    if(i == 3) c = porcentagemAleatoria;
  }

  return `${a}% indicam (a), ${b}% indicam (b), ${c}% indicam (c) e ${d}% indicam (d).`
}