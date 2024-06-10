import { getOfflineSignerAndCosmWasmClient } from '../GetClient'
import { AppConstants } from '../config/constant'
export const executeDeal = async (dealId) => {
  // const { amount, price, denom } = formData;
  try {
    const { offlineSigner, CosmWasmClient } = await getOfflineSignerAndCosmWasmClient()
    const contractAddress = AppConstants.CONTRACT_ADDRESS
    if(!window.keplr){
      return Promise.reject("Install keplr")
    }
    let accounts = await offlineSigner.getAccounts()
    const ExecutorAddress = localStorage.getItem('walletaddress')
    if(!ExecutorAddress ){
      return Promise.reject("Connect Your Wallet")
    }
    const defaultFee = {
      amount: [
        {
          denom: 'stake',
          amount: '5000'
        }
      ],
      gas: '250000'
    }
    const id = parseInt(dealId)
    const executeMsg = {
      execute_deal: {
        deal_id: id
      }
    }
    const executeResponse = await CosmWasmClient.execute(
      ExecutorAddress,
      contractAddress,
      executeMsg,
      defaultFee,
      'Execute execute_deal',
      []
    )
    console.log('Execute response:', executeResponse)
    const txHash = executeResponse.transactionHash
    console.log('transation hash', txHash)
    const response = await CosmWasmClient.queryClient.tx.getTx(txHash)
    console.log('response of hash', response)
    return Promise.resolve(response)
  } catch (error) {
    const { offlineSigner, CosmWasmClient } = await getOfflineSignerAndCosmWasmClient()
    function find64CharHex(message) {
      if (typeof message !== 'string') {
        console.error('Input is not a string.')
        return null
      }
      const hexPattern = /[0-9A-Fa-f]{64}/g
      const result = message.match(hexPattern)
      return result ? result[0] : null
    }
    const errorMessages = error.message || ''
    const txHash = find64CharHex(errorMessages)

    if (txHash != null) {
      const response = await CosmWasmClient.queryClient.tx.getTx(txHash)
      const errorMessage = response.txResponse.rawLog
      const indexOfMessage = errorMessage.indexOf('message index: 0:')

      if (indexOfMessage !== -1) {
        const specificMessage = errorMessage
          .substring(indexOfMessage + 'message index: 0:'.length)
          .trim()
        console.error('Specific error message:', specificMessage)
        return Promise.reject(specificMessage)
      } else {
        return Promise.reject(errorMessage)
      }
    }

    return Promise.reject(error)
  }
}
