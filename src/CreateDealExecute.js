import React, { useEffect, useState } from "react";
import { getOfflineSignerAndCosmWasmClient } from "./GetClient";

export default function CreateDealExecute({ data }) {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const execute = async () => {
      try {
        const { offlineSigner, CosmWasmClient } = await getOfflineSignerAndCosmWasmClient();
        const contractAddress = "osmo1nc5tatafv6eyq7llkr2gv50ff9e22mnf70qgjlv737ktmt4eswrqvlx82r";
        let accounts = await offlineSigner.getAccounts();
        const DealCreatorAddress = accounts[0].address;

        const defaultFee = {
          amount: [
            {
              denom: "stake",
              amount: "5000",
            },
          ],
          gas: "200000",
        };

        const executeMsg = {
          create_deal: {
            deal_creator: DealCreatorAddress,
            min_cap: data.min_capacity,
            total_bid: "0",
            deal_token_denom: data.dealdenom,
            deal_token_amount: data.amount,
            start_block: data.startdate,
            end_block: data.enddate,
            bid_token_denom: data.bidtoken,
            min_price: data.min_price,
          },
        };

        const executeResponse = await CosmWasmClient.execute(
          DealCreatorAddress,
          contractAddress,
          executeMsg,
          defaultFee,
          "Execute create_deal",
          [
            {
              amount: data.amount,
              denom: data.dealdenom,
            },
            {
              amount: "10",
              denom: "uotc",
            },
          ]
        );

        console.log("Execute response:", executeResponse);
        setResponse(executeResponse);
        setError(null); // Clear any previous errors
      } catch (error) {
        console.error("Error executing deal:", error);
        setError(error.message); // Set error state with error message
      }
    };

    execute();
  }, []); // Empty dependency array to run the effect only once

  return (
    <div>
      {/* Render error message if there's an error */}
      {error && <p>Error: {error}</p>}

      {/* Render response if available */}
      {response && (
        <div>
          <h3>Transaction Details:</h3>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
