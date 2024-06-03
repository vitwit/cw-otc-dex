const IdToSymbol = {
    ubld: { denom: 'BLD', decimal: 6 },
    uist: { denom: 'IST', decimal: 6 },
    uakt: { denom: 'AKT', decimal: 6 },
    uatom: { denom: 'ATOM', decimal: 6 },
    udsm: { denom: 'DSM', decimal: 6 },
    aevmos: { denom: 'EVMOS', decimal: 18 },
    ujuno: { denom: 'JUNO', decimal: 6 },
    uflix: { denom: 'FLIX', decimal: 6 },
    uosmo: { denom: 'OSMO', decimal: 6 },
    upasg: { denom: 'PASG', decimal: 6 },
    adydx: { denom: 'DYDX', decimal: 18 },
    uqck: { denom: 'QCK', decimal: 6 },
    uregen: { denom: 'REGEN', decimal: 6 },
    ustars: { denom: 'STARS', decimal: 6 },
    adym: { denom: 'DYM', decimal: 18 },
    uumee: { denom: 'UMEE', decimal: 6 },
    utia: { denom: 'TIA', decimal: 6 },
    uqsr: { denom: 'QSR', decimal: 6 },
    ucmdx: { denom: 'CMDX', decimal: 6 },
    ugraviton: { denom: 'GRAV', decimal: 6 },
    umars: { denom: 'MARS', decimal: 6 },
    aarch: { denom: 'ARCH', decimal: 18 },
    ucre: { denom: 'CRE', decimal: 6 },
    uusdc:{denom:'USDT',decimal:6}
  }
  
  export const fetchTokenDenom = async (Token) => {
    const denom = IdToSymbol[Token]?.denom
    const decimal = IdToSymbol[Token]?.decimal
    console.log('---------', denom, decimal)
    if (!denom || !decimal) {
      return 
    }
    return {
      denom,
      decimal
    }
  }
  

  