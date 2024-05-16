import axios from 'axios'

export const getLatestBlockHeight = async () => {
  const res = await axios.get('http://142.93.213.125:26657/abci_info')
  if (res.data && res.data?.result?.response?.last_block_height) {
    const dt = new Date()

    return res.data?.result?.response?.last_block_height
  } else {
    return 0
  }
}
