import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { AppConstants } from "./config/constant";
export async function getOfflineSignerAndCosmWasmClient() {
  const chain_config = {
    chainId: AppConstants.CHAIN_ID,  
    chainName: 'otc',
    rest: 'http://142.93.213.125:1317',
    rpc: AppConstants.RPC_URL,
    currencies: [
      {
        coinDenom: 'STAKE',
        coinMinimalDenom: 'stake',
        coinDecimals: 6,
      },
      {
        coinDenom: 'OSMO',
        coinMinimalDenom: 'uosmo',
        coinDecimals: 6,
      },
      {
        coinDenom: 'USD',
        coinMinimalDenom: 'uusdc',
        coinDecimals: 6,
      },
      {
        coinDenom: 'ATOM',
        coinMinimalDenom: 'uatom',
        coinDecimals: 6,
      },
      {
        coinDenom: 'UOTC',
        coinMinimalDenom: 'uotc',
        coinDecimals: 6,
      },
    ],
    bech32Config: {
      bech32PrefixAccAddr: 'osmo',
      bech32PrefixAccPub: 'osmopub',
      bech32PrefixValAddr: 'osmovaloper',
      bech32PrefixValPub: 'osmovaloperpub',
      bech32PrefixConsAddr: 'osmogvalcons',
      bech32PrefixConsPub: 'osmovalconspub',
    },
    feeCurrencies: [
      {
        coinDenom: 'OSMO',
        coinMinimalDenom: 'uosmo',
        coinDecimals: 6,
        gasPriceStep: {
          low: 0.01,
          average: 0.025,
          high: 0.03,
        },
      },
      {
        coinDenom: 'STAKE',
        coinMinimalDenom: 'stake',
        coinDecimals: 6,
        gasPriceStep: {
          low: 0.01,
          average: 0.025,
          high: 0.03,
        },
      },
    ],
    bip44: {
      coinType: 118,
    },
    stakeCurrency: {
      coinDenom: 'OSMO',
      coinMinimalDenom: 'uosmo',
      coinDecimals: 6,
    },
    image:
      'https://raw.githubusercontent.com/leapwallet/assets/2289486990e1eaf9395270fffd1c41ba344ef602/images/logo.svg',
    theme: {
      primaryColor: '#fff',
      gradient:
        'linear-gradient(180deg, rgba(255,255,255,0.32) 0%, rgba(255,255,255,0) 100%)',
    },
  }
  // window.keplr.experimentalSuggestChain(chain_config);
  const chainId = AppConstants.CHAIN_ID;
  await window.keplr.enable(chainId);
  const offlineSigner = await window.getOfflineSigner(chainId);
  const CosmWasmClient = await SigningCosmWasmClient.connectWithSigner(AppConstants.RPC_URL, offlineSigner, {
    gasPrice: 100000,
  });
  console.log("client",CosmWasmClient);
  // function extractValueByKey(attributes, key) {
  //   const attribute = attributes.find(attr => attr.key === key);
  //   return attribute ? attribute.value : null;
  // }
  
  // // Function to find values for "action" and "deal_id" in attributes
  // function findActionAndDealId(attributes) {
  //   const action = extractValueByKey(attributes, 'action');
  //   const dealId = extractValueByKey(attributes, 'deal_id');
  //   return { action, dealId };
  // }
  
  // // Extracting values for "action" and "deal_id"
  // const { action } = findActionAndDealId(response.txResponse.events[8].attributes,"amount");
  // // // Logging the extracted values
  // console.log('Action:', action);
  // console.log('Deal ID:', dealId);
  return { offlineSigner, CosmWasmClient };
}