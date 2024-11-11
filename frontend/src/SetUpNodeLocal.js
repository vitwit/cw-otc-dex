// // import { useState } from "react";
// // import { CosmWasmClient } from "cosmwasm";

// // import { setupWebKeplr } from "cosmwasm";



// // const SetUpNodeLocal = () => {
// //   const [result, setResult] = useState('');

// //   const handleSetupNodeLocal = async () => {
// //     try {
// //       // Setup signer

// //       const config = {
// //         chainId: "testnet",
// //         rpcEndpoint: "http://127.0.0.1:26657",
// //         prefix: "osmo",
// //       };
      
// //       const client = await setupWebKeplr(config);
// //       console.log(client);
// //       // const rpcEndpoint='http://127.0.0.1:26657';
// //       // const mnemonic='mimic govern film era print prize wood shove live enhance naive rifle enhance science measure term feel message crouch various forum inquiry afford step';
     
// //       // const client = await CosmWasmClient.connect(rpcEndpoint);
// //       // console.log(client);
// //       const contractAddress = 'osmo14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9sq2r9g9';
// //       const queryMessage =  { "get_deal": { "id": "1" } }; /// Replace with the actual contract address
// //       const contractInfo = await client.queryClient.wasm.queryContractSmart(contractAddress,queryMessage);

// //       setResult(`Contract Info for address ${contractAddress}: ${JSON.stringify(contractInfo)}`);
    
// //     } catch (error) {
// //       setResult(`Error during setup: ${error.message}`);
// //     }
// //   };

// //   return (
// //     <div>
// //       <h2>Setup Node/Local Mnemonic</h2>
// //       <button onClick={handleSetupNodeLocal}>Setup</button>
// //       <div>{result}</div>
// //     </div>
// //   );
// // };

// // export default SetUpNodeLocal;
// import React, { useState } from "react";
// import { SigningCosmWasmClient } from "cosmwasm";
// import { OfflineSigner, KeplerWalletProvider } from "@keplr-wallet/stores";
// // import { setupWebKeplr } from "cosmwasm";
// // import { getOfflineSigner } from "@cosmostation/cosmos-client"
// const SetUpNodeLocal = () => {
//   const [result, setResult] = useState('');

//   const handleExecuteFunction = async () => {
//     try {
//       // Setup Keplr
//       const config={
//         chainId: "testnet",
//         rpcEndpoint: "http://127.0.0.1:26657",
//         prefix: "osmo",
//         gasPrice: "0.025stake"
//       };


//   const offlineSigner= window.getOfflineSigner("testnet");
//   const walletProvider = new KeplerWalletProvider(offlineSigner);
//   const rpcEndpoint="http://127.0.0.1:26657";
//   // Connect to the CosmWasm client with Kepler signer
//     const client = await SigningCosmWasmClient.connectWithSigner(
//       rpcEndpoint,
//       walletProvider,
//     );
//       // const client = await setupWebKeplr(config);
//       console.log(client);
//       // Define the contract address
//       const contractAddress = 'osmo14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9sq2r9g9';
    
//       // const msg = {
//       //   place_bid: {
//       //     deal_id: 1,
//       //     bidder: "osmo1rvtjs4tl7el584jlxtv6qyhy9x4jvwcn0n56px",
//       //     amount: "59000000000",
//       //     denom: "uusdc",
//       //     price: "1600000"
//       //   }
//       // };
//       // // Serialize the transaction data using Amino encoding
//       // console.log("hi")
//       // const response = await client.execute(contractAddress,{
//       //   place_bid: {
//       //     deal_id: 1,
//       //     bidder: "osmo1rvtjs4tl7el584jlxtv6qyhy9x4jvwcn0n56px",
//       //     amount: "59000000000",
//       //     denom: "uusdc",
//       //     price: "1600000"
//       //   }
//       // });
//       // console.log(response);
//       // setResult(`Transaction executed successfully. Response: ${JSON.stringify(response)}`);

//       const queryMessage =  { "get_deal": { "id": "1" } }; /// Replace with the actual contract address
//       // const contractInfo = await client.queryClient.wasm.queryContractSmart(contractAddress,queryMessage);

//       const { aminoTypes, tmClient } = client;
//       const contractQuery = {
//         place_bid: {
//               deal_id: 1,
//               bidder: "osmo1rvtjs4tl7el584jlxtv6qyhy9x4jvwcn0n56px",
//               amount: "59000000000",
//               denom: "uusdc",
//               price: "1600000"
//             }      
//       };

//       // const executeContractFunction = client.aminoTypes.registry['/cosmwasm.wasm.v1.MsgExecuteContract'];

//       const result=await client.execute(contractAddress,contractQuery)
//       setResult(`Contract Info for address ${contractAddress}: ${JSON.stringify(result)}`);
    
//     } catch (error) {
//       setResult(`Error during execution: ${error.message}`);
//     }
//   };

//   return (
//     <div>
//       <h2>Execute Contract Function</h2>
//       <button onClick={handleExecuteFunction}>Execute</button>
//       <div>{result}</div>
//     </div>
//   );
// };

// export async function setupWebKeplr(config){
//   // Check browser compatibility
//   if (!window.keplr) {
//     throw new Error("Keplr is not supported or installed on this browser!");
//   }

//   // Try to enable Keplr with given chainId
//   await window.keplr.enable(config.chainId).catch(() => {
//     throw new Error("Keplr can't connect to this chainId!");
//   });

//   const { prefix, gasPrice } = config;



//   // const offlineSigner = new CosmjsOfflineSigner(config.chainId);
//   // const signingClient = await SigningCosmWasmClient.connectWithSigner(
//   //         config.rpcEndpoint,
//   //         offlineSigner
//   //       );
//   // Setup signer
//   const offlineSigner = await window.getOfflineSignerAuto(config.chainId);

//   // Initialize SigningCosmWasmClient client
//   const signingClient = new SigningCosmWasmClient(
//     config.rpcEndpoint,
//     await offlineSigner,
//     {
//       prefix,
//       gasPrice,
//     }
//   );

//   return signingClient;
// }

// export default SetUpNodeLocal;
