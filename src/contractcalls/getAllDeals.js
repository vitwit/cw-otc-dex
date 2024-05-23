import { getOfflineSignerAndCosmWasmClient } from "../GetClient";
import { AppConstants } from "../config/constant";
export const getAllDeals=async ()=>
    {
    try
    {
        const { offlineSigner, CosmWasmClient } = await getOfflineSignerAndCosmWasmClient();
        const contractAddress = AppConstants.CONTRACT_ADDRESS
        const query = {
          "get_all_deals": {}
        };
        const response = await CosmWasmClient.queryClient.wasm.queryContractSmart(contractAddress, query);
        // console.log("print response",response)
        return response
    }
    catch(error)
    {   
        console.log(error)
        return error.message;
    }
    }