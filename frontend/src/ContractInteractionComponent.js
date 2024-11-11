import { SigningStargateClient } from "@cosmjs/stargate";
import { SigningCosmWasmClient } from "cosmwasm";
import { GasPrice } from "@cosmjs/stargate";
import { getOfflineSignerAndCosmWasmClient } from "./GetClient";
import { useEffect,useState } from "react";
const ContractInteractionComponent = () => {
  const [offlineSigner, setOfflineSigner] = useState(null);
  const [CosmWasmClient, setCosmWasmClient] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { offlineSigner, CosmWasmClient } = await getOfflineSignerAndCosmWasmClient();
        setOfflineSigner(offlineSigner);
        setCosmWasmClient(CosmWasmClient);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
    // Cleanup function if needed
    return () => {
      // Perform cleanup if necessary
    };
  }, []); 

const executeMessage = async () => {
    try {

    const contractAddress = 'osmo1nc5tatafv6eyq7llkr2gv50ff9e22mnf70qgjlv737ktmt4eswrqvlx82r';
    let accounts = await offlineSigner.getAccounts();
    const bidderAddress =accounts[0].address; // Assuming accounts array is defined elsewhere
    const query={
      "get_all_deals": { }
    };
    const response=await CosmWasmClient.queryClient.wasm.queryContractSmart(contractAddress,query);
      // const response = await CosmWasmClient.execute(
      //   bidderAddress, 
      //           contractAddress,
      //           {
      //             create_deal: {
      //                   deal_creator:bidderAddress,
      //                     min_cap: "7000",
      //                     total_bid: "0",
      //                     deal_token_denom: "uosmo", 
      //                     deal_token_amount: "10000", 
      //                     start_block: "20429", 
      //                     end_block: "25000",
      //                     bid_token_denom: "uusdc",
      //                     min_price: "1600"
      //                 }
      //             },
      //   {
      //     amount: [
      //       {
      //         amount: '5000',
      //         denom: 'stake',
      //       },
      //     ],
      //     gas: '900000',
      //   },
      //   '',
      //   [
      //     {
      //       amount: '10000',
      //       denom: 'uosmo',
      //     },
      //     {
      //       amount: '10',
      //       denom: 'uotc',
      //     },
      //   ]
      // );
      console.log(response);
    } catch (error) {
      console.log("hii");
      console.log(error);
    }
  };
//   const contractAddress = 'osmo14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9sq2r9g9';
//   try {
//     let accounts = await offlineSigner.getAccounts();
//     const dealId = 1;
//     const bidderAddress =accounts[0].address; // Assuming accounts array is defined elsewhere
//     console.log(bidderAddress);
//     const amount = "59000000";
//     const denom = "uusdc";
//     const price = "1600000";
//         const defaultFee = {
//         amount: [
//           {
//               denom: "stake",
//               amount: "5000"
//           }
//         ],
//         gas: "200000" // Example gas amount
//       }

// const executeResponse = await CosmWasmClient.execute(
//         bidderAddress, 
//         contractAddress,
//         {
//           create_deal: {
//                 deal_creator:bidderAddress,
//                   min_cap: "70000000000",
//                   total_bid: "0",
//                   deal_token_denom: "uosmo", 
//                   deal_token_amount: "100000000000", 
//                   start_block: "17427", 
//                   end_block: "19000",
//                   bid_token_denom: "uusdc",
//                   min_price: "1600000"
//               }
//           },
//           defaultFee,
//           'hel',
//           [{
//                 amount:"100000000000",
//                 denom:"uosmo",
//           },
//           {
//             amount: "10",
//             denom: "uotc"
//           }
//         ]

//       );
//       console.log(executeResponse);
//   } catch (error) {
//       console.error("Error executing transaction:", error);
//   }
// }
  return (
    <div>
      <button onClick={executeMessage}>Execute Message</button>
    </div>
  );
}

export default ContractInteractionComponent;
