import React, { useEffect } from 'react'
import toast from 'react-hot-toast'
import { withdrawBid } from './contractcalls/withdrawBid'
import { Link } from 'react-router-dom'
import icons from './assets/icons.json'
import Deal from './Deal'
import { getUser } from './GetUser'
import Modal from './Modal'
import { useState } from 'react'
import { fetchTokenDenom } from './utils/getDecimalByDenom'

const MyBidItem = ({
  dealTitle,
  bidAmount,
  bidId,
  bidPrice,
  dealId,
  onBidRemoved,
  bid_token_denom,
  deal_token_denom
}) => {
  const address = localStorage.getItem('walletaddress')
  const [showModal, setShowModal] = useState(false)
  const [dealTokenDenom, setDealTokenDenom] = useState(null)
  const [bidTokenDenom, setBidTokenDenom] = useState(null)
  const [dealDecimal, setDealDecimal] = useState(null)
  const [Quantity, setQuantity] = useState(null)
  const fetchTokenData = async () => {
    const dealDenom = await fetchTokenDenom(deal_token_denom)
    const bidDenom = await fetchTokenDenom(bid_token_denom)
    setDealTokenDenom(dealDenom.denom)
    setBidTokenDenom(bidDenom.denom)
    setDealDecimal(dealDenom.decimal)
  }

  useEffect(() => {
    fetchTokenData()
  }, [])
  const handleRemoveBid = async () => {
    try {
      setShowModal(true)
    } catch (error) {
      console.error('Error removing bid: ', error)
      toast.error('Error removing bid')
    }
  }
  const confirmBidWithdrawal = async () => {
    setShowModal(false)
    try {
      await withdrawBid(bidId, dealId)
      toast.success('Bid removed successfully')
      onBidRemoved(bidId)
      setShowModal(false)
    } catch (error) {
      const errorMessage = error.message || error.toString()
      const indexOfMessage = errorMessage.indexOf('message index: 0:')

      if (indexOfMessage !== -1) {
        const specificMessage = errorMessage
          .substring(indexOfMessage + 'message index: 0:'.length)
          .trim()
        console.error('Specific error message:', specificMessage)
        toast.error(specificMessage)
      } else {
        toast.error(error)
      }
    }
  }

  const totalBidConverted = (Number(bidAmount) / 10 ** dealDecimal).toFixed(dealDecimal)
  const formattedTotalBid = totalBidConverted
    .toLocaleString('en-US', { maximumFractionDigits: 20 })
    .replace(/\.?0+$/, '')

  return (
    <div className="text-md text-black  flex justify-between px-6 py-5 ">
      <div className="w-1/8">
        <Link
          to={`/deal/${dealId}`}
          className="text-zinc-700 pr-10 hover:text-black flex justify-start"
        >
          <div>{dealId}</div>
        </Link>
      </div>
      <div className="w-1/5">{dealTitle}</div>
      <div className="w-1/5">
        <img
          src={icons[deal_token_denom]}
          alt={deal_token_denom}
          className="inline-block w-4 h-4 mr-1"
        />
        {formattedTotalBid}
      </div>
      <div className="w-1/5">
        <img
          src={icons[bid_token_denom]}
          alt={bid_token_denom}
          className="inline-block w-4 h-4 mr-1"
        />
        {bidPrice}
      </div>
      <div className="w-1/5">
        <button
          onClick={handleRemoveBid}
          className="px-5 py-1 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-200 flex items-center"
        >
          <i className="fa-solid fa-xmark mr-2"></i>
          Withdraw
        </button>
      </div>
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={confirmBidWithdrawal}
        title="Confirm Bid Withdrawal"
        message="Are you sure you want to withdraw this bid?"
      />
    </div>
  )
}

export default MyBidItem
