import { useEffect, useState } from "react";
import { getOfflineSignerAndCosmWasmClient } from "../GetClient";
import { AppConstants } from "../config/constant";
import { getLatestBlockHeight } from "../utils/util"; 

export function useAllDeals() {
  const [response, setResponse] = useState(null);
  const [user, setUser] = useState(null);
  const [latestBlockHeight, setLatestBlockHeight] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { offlineSigner, CosmWasmClient } = await getOfflineSignerAndCosmWasmClient();
        const contractAddress = AppConstants.CONTRACT_ADDRESS
        let accounts = await offlineSigner.getAccounts();
        const currentAddress = accounts[0].address;
        setUser(currentAddress);

        const query = { "get_all_deals": {} };
        const response = await CosmWasmClient.queryClient.wasm.queryContractSmart(contractAddress, query);
        setResponse(response);

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
