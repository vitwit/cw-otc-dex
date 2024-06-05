
import { AppConstants } from "../config/constant";
import { CosmWasmClient } from "cosmwasm";
export const getAllDeals=async ()=>
    {
    try
    {

        const  client = await CosmWasmClient.connect(AppConstants.RPC_URL)
        const contractAddress = AppConstants.CONTRACT_ADDRESS
        const queryMessage = {
            "get_all_deals": {}
        };
        const response= await client.queryClient.wasm.queryContractSmart(
            contractAddress,
            queryMessage
        )
        return response
    }
    catch(error)
    {   
        console.log(error)
        return error.message;
    }
    }