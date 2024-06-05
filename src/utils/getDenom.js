const symbolToId = {
  BLD: { denom: 'ubld', decimal: 6 },
  IST: { denom: 'uist', decimal: 6 },
  AKT: { denom: 'uakt', decimal: 6 },
  ATOM: { denom: 'uatom', decimal: 6 },
  // DSM: { denom: 'udsm', decimal: 6 },
  EVMOS: { denom: 'aevmos', decimal: 18 },
  JUNO: { denom: 'ujuno', decimal: 6 },
  FLIX: { denom: 'uflix', decimal: 6 },
  OSMO: { denom: 'uosmo', decimal: 6 },
  // PASG: { denom: 'upasg', decimal: 6 },
  DYDX: { denom: 'adydx', decimal: 18 },
  QCK: { denom: 'uqck', decimal: 6 },
  REGEN: { denom: 'uregen', decimal: 6 },
  STARS: { denom: 'ustars', decimal: 6 },
  // DYM: { denom: 'adym', decimal: 18 },
  UMEE: { denom: 'uumee', decimal: 6 },
  TIA: { denom: 'utia', decimal: 6 },
  // QSR: { denom: 'uqsr', decimal: 6 },
  // CMDX: { denom: 'ucmdx', decimal: 6 },
  GRAV: { denom: 'ugraviton', decimal: 6 },
  MARS: { denom: 'umars', decimal: 6 },
  // ARCH: { denom: 'aarch', decimal: 18 },
  // CRE: { denom: 'ucre', decimal: 6 },
  USDT:{denom:'uusdc',decimal:6}
  


  // BLD: { denom: 'ubld', decimal: 6 },
  // IST: { denom: 'uist', decimal: 6 },
  // AKT: { denom: 'uakt', decimal: 6 },
  // ATOM: { denom: 'uatom', decimal: 6 },
  // DSM: { denom: 'udsm', decimal: 6 },
  // EVMOS: { denom: 'aevmos', decimal: 18 },
  // JUNO: { denom: 'ujuno', decimal: 6 },
  // FLIX: { denom: 'uflix', decimal: 6 },
  // OSMO: { denom: 'uosmo', decimal: 6 },
  // PASG: { denom: 'upasg', decimal: 6 },
  // DYDX: { denom: 'adydx', decimal: 18 },
  // QCK: { denom: 'uqck', decimal: 6 },
  // REGEN: { denom: 'uregen', decimal: 6 },
  // STARS: { denom: 'ustars', decimal: 6 },
  // DYM: { denom: 'adym', decimal: 18 },
  // UMEE: { denom: 'uumee', decimal: 6 },
  // TIA: { denom: 'utia', decimal: 6 },
  // QSR: { denom: 'uqsr', decimal: 6 },
  // CMDX: { denom: 'ucmdx', decimal: 6 },
  // GRAV: { denom: 'ugraviton', decimal: 6 },
  // MARS: { denom: 'umars', decimal: 6 },
  // ARCH: { denom: 'aarch', decimal: 18 },
  // CRE: { denom: 'ucre', decimal: 6 },
  // USDT:{denom:'uusdc',decimal:6}
}

export const fetchTokenDetails = async (Token) => {
  const denom = symbolToId[Token]?.denom
  const decimal = symbolToId[Token]?.decimal
  console.log('---yu-----', denom, decimal)
  if (!denom || !decimal) {
    return {}
  }
  return {
    denom,
    decimal
  }
}

