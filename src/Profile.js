import Header from './components/Header'
import { useParams } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import { useFilteredBids } from './hooks/useFilteredBids'
import { useFilteredDeals } from './hooks/useFilteredDeals'
import MyBidItem from './MyBidItem'
import Deal from './Deal'
import { fetchFilteredBids } from './hooks/useFilteredBids'
import { Link } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast'
import { getUser } from './GetUser'
import { fetchFilteredDeals } from './hooks/useFilteredDeals'
const Profile = () => {
  const { filtereddeals, user, error: dealsError } = useFilteredDeals()
  const [deals, setDeals] = useState(null)
  const [bids, setBids] = useState([])

  const [walletAddress, setWalletAddress] = useState(localStorage.getItem('walletaddress'))
  const fetchData = async () => {
    const { filtereddeals, user, error: dealsError } = await fetchFilteredDeals()
    const { bids, error } = await fetchFilteredBids()
    if (filtereddeals) {
      setDeals(filtereddeals)
    }
    if (bids) {
      setBids(bids)
    }
  }
  useEffect(() => {
    fetchData()
  }, [walletAddress])
  window.addEventListener('keplr_keystorechange', async () => {
    const { user, error } = await getUser()
    localStorage.setItem('walletaddress', user)
    setWalletAddress(localStorage.getItem('walletaddress'))
  })
  const handleBidRemoved = (bidId) => {
    setBids((bids) => {
      let bids2 = bids.filter((bid) => bid.bidId !== bidId)
      return bids2
    })
  }
  return (
    <>
      <Header />
      <div className="h-20"></div>
      <main className="px-4 md:px-24 mt-9 mb-9">
        <div className="flex">
          <h3 className="text-3xl font-medium text-black/90 font-['Alata']">My Deals</h3>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-5 mb-9 md:mb-14">
          {deals && deals.length > 0 ? (
            <>
              {deals.map((deal, index) => (
                <Deal dealId={deal[0]} dealDetails={deal[1]} key={index} />
              ))}
            </>
          ) : (
            <p className="flex item-center">No deals available</p>
          )}
        </div>

        <div className="flex">
          <h3 className="text-3xl font-medium text-black/90 font-['Alata']">My bids</h3>
        </div>
        <div className="overflow-x-auto border border-gray-300 rounded-lg mt-5 bg-white">
          {bids && (
            <div className="min-w-full text-sm text-left text-gray-800 mb-4">
              <div className="text-xs text-gray-700 uppercase bg-gray-50 flex justify-between px-6 py-5 font-semibold">
                <div className="w-1/8">Deal id</div>
                <div className="w-1/5">Deal</div>
                <div className="w-1/5">Quantity</div>
                <div className="w-1/5">Bid price</div>
                <div className="w-1/5">Actions</div>
              </div>
              {bids.length === 0 ? (
                <div className="mx-auto text-center text-zinc-500">
                  <b>No bids placed yet.</b>
                </div>
              ) : (
                bids.map((bid) => {
                  return (
                    <MyBidItem
                      key={bid.bidId}
                      bidAmount={bid.amount}
                      dealId={bid.dealId}
                      dealTitle={bid.dealDetails.deal_title}
                      deal_token_denom={bid.dealDetails.deal_token_denom}
                      bidPrice={bid.bidPrice}
                      onBidRemoved={handleBidRemoved}
                      bidId={bid.bidId}
                      bid_token_denom={bid.bidDenom}
                    />
                  )
                })
              )}
            </div>
          )}
        </div>
      </main>
    </>
  )
}

export default Profile
