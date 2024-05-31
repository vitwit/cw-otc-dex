const symbolToId = {
  ATOM: {
    denom: 'uatom',
    decimal: 6
  },
  OSMO: {
    denom: 'uosmo',
    decimal: 6
  },
  USDC: {
    denom: 'uusdc',
    decimal: 6
  },
}

export const fetchTokenDetails = async (Token) => {
  const denom = symbolToId[Token]?.denom
  const decimal = symbolToId[Token]?.decimal
  console.log('---yu-----', denom, decimal)
  if (!denom || !decimal) {
    return 
  }
  return {
    denom,
    decimal
  }
}

