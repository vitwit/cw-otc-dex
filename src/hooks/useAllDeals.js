import { useEffect, useState } from "react";
import { CosmWasmClient } from "cosmwasm";
import { AppConstants } from "../config/constant";
import { getLatestBlockHeight } from "../utils/util"; 

export function useAllDeals() {
  const [response, setResponse] = useState(null);
  const [user, setUser] = useState(null);
  const [latestBlockHeight, setLatestBlockHeight] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const client = await CosmWasmClient.connect(AppConstants.RPC_URL)
        const contractAddress = AppConstants.CONTRACT_ADDRESS
        const queryMessage = { get_all_deals: {} }
        const contractResp = await client.queryClient.wasm.queryContractSmart(
          contractAddress,
          queryMessage
        )
        setResponse(contractResp);
        const latestBlock = await getLatestBlockHeight();
        setLatestBlockHeight(latestBlock);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);
  return { user, response, latestBlockHeight };
}
