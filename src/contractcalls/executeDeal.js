import { getOfflineSignerAndCosmWasmClient } from "../GetClient";
import { AppConstants } from "../config/constant";
export const executeDeal=async (dealId)=>{
    // const { amount, price, denom } = formData;
    try {
        const { offlineSigner, CosmWasmClient } = await getOfflineSignerAndCosmWasmClient()
        const contractAddress = AppConstants.CONTRACT_ADDRESS
        let accounts = await offlineSigner.getAccounts()
        const ExecutorAddress = localStorage.getItem("walletaddress");
        const defaultFee = {
          amount: [
            {
              denom: 'stake',
              amount: '5000'
            }
          ],
          gas: '200000'
        }
        const id=parseInt(dealId)
        const executeMsg = {
          execute_deal: {
             deal_id: id,
          }
        }
        const executeResponse = await CosmWasmClient.execute(
          ExecutorAddress,
          contractAddress,
          executeMsg,
          defaultFee,
          'Execute execute_deal',
          [
          ]
        )
        console.log('Execute response:', executeResponse)
        const txHash=executeResponse.transactionHash;
        console.log("transation hash",txHash)
        const response = await CosmWasmClient.queryClient.tx.getTx(
          txHash
        )
        console.log("response of hash",response);
        return Promise.resolve(response);
      } catch (error) {
        console.error('Error executing bid:', error)
        return Promise.reject(error.message);
      }
}