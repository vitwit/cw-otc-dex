import { getOfflineSignerAndCosmWasmClient } from '../GetClient'
import { AppConstants } from '../config/constant'
export const executeDeal = async (dealId) => {
  try {
    if (!window.keplr) {
      return Promise.reject('Install keplr')
    }
    if (!localStorage.getItem('walletaddress')) {
      return Promise.reject('Connect Your Wallet')
    }
    const { offlineSigner, CosmWasmClient } = await getOfflineSignerAndCosmWasmClient()
    const contractAddress = AppConstants.CONTRACT_ADDRESS
    let accounts = await offlineSigner.getAccounts()
    const ExecutorAddress = localStorage.getItem('walletaddress')
    if (!ExecutorAddress) {
      return Promise.reject('Connect Your Wallet')
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

    const txHash = executeResponse.transactionHash

    const response = await CosmWasmClient.queryClient.tx.getTx(txHash)

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

        return Promise.reject(specificMessage)
      } else {
        return Promise.reject(errorMessage)
      }
    }

    return Promise.reject(error.message)
  }
}
