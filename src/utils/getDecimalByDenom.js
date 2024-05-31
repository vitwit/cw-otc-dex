const IdToSymbol = {
    uatom: {
      denom: 'ATOM',
      decimal: 6
    },
    uosmo: {
      denom: 'OSMO',
      decimal: 6
    },
    uusdc: {
      denom: 'USDC',
      decimal: 6
    },

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
  