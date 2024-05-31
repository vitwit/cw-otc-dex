import React, { useState, useRef, useEffect } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { placeBid } from './contractcalls/placeBid'
const BidForm = ({ onCancel, onPlaceBid, dealData, dealId ,bidDenom}) => {
  const formRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const [totalAmount, setTotalAmount] = useState(null)
  const [amountError, setAmountError] = useState(null)
  const [priceError, setPriceError] = useState(null)
  const [amount, setAmount] = useState('')
  const [isAmountValid, setIsAmountValid] = useState(false)
  const [isPriceValid, setIsPriceValid] = useState(false)
  const [price, setPrice] = useState('')
  const [availableBalance,SetAvailable]=useState('');
  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = Object.fromEntries(new FormData(formRef.current))
    const { amount, price } = formData

    if (!localStorage.getItem('walletaddress')) {
      toast.error('Connect Your Wallet to Place Bid')
      return
    }

    // Validate form fields
    if (!amount) {
      setAmountError('Enter Amount')
      return
    } else {
      setAmountError(null)
    }

    if (!price) {
      setPriceError('Enter Price')
      return
    } else {
      setPriceError(null)
    }

    setLoading(true)
    try {
      toast.promise(placeBid(amount, price, dealData.bid_token_denom,dealData.deal_token_denom,dealId), {
        loading: <b>Please Wait..Creating Bid...</b>,
        success: () => <b>Bid Placed Successfully</b>,
        error: (error) => <b>{JSON.stringify(error)}</b>
      })
      await onPlaceBid()
      formRef.current.reset()
      setAmount('')
      setPrice('')
      setTotalAmount(null)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handlePriceChange = (e) => {
    const value = e.target.value
    if (!value) {
      setIsPriceValid(false)
      setTotalAmount(null)
      setPrice('')
      setPriceError(null)
    } else {
      if (parseFloat(value) < dealData.min_price) {
        setTotalAmount(null)
        setPriceError(`Price can't be less than ${dealData.min_price}`)
      } else {
        setPriceError(null)
        setPrice(value)
        setIsPriceValid(true)
        if (amount && !amountError) {
          setTotalAmount(parseFloat(amount) * parseFloat(value))
        }
      }
    }
  }

  const handleAmountChange = (e) => {
    const value = e.target.value
    if (!value) {
      setTotalAmount(null)
      setIsAmountValid(true)
      setAmount('')
      setAmountError(null)
    } else {
      if (parseFloat(value) > dealData.deal_token_amount) {
        setTotalAmount(null)
        setAmountError(`Quantity should be less than or equal to ${dealData.deal_token_amount}`)
      } else {
        setIsAmountValid(true)
        setAmountError(null)
        setAmount(value)
        if (price && !priceError) {
          setTotalAmount(parseFloat(value) * parseFloat(price))
        }
      }
    }
  }

  return (
    <div className="absolute top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-[550px]">
        <h2 className="text-xl font-medium mb-4">Place New Bid</h2>
        <form ref={formRef} onSubmit={handleSubmit}>
          <div className="flex flex-col space-y-0 mb-6">
            <div className="flex flex-row space-x-6 ">
              <div>
                <label htmlFor="amount" className="text-sm font-medium text-gray-700 mt-2">
                  Quantity
                  <small className="text-red-600">*</small>
                </label>
              </div>

              <div className="flex col  h-[5vh]">
                <div>
                  <input
                    type="text"
                    id="amount"
                    name="amount"
                    placeholder="Enter amount"
                    onChange={handleAmountChange}
                    className="border border-gray-300 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-[200px] p-2"
                  />
                  <div className="text-start">
                    {/* {amountError && <p className="text-red-600 text-sm">{amountError}</p>} */}
                    {amountError && <p className="text-red-600 text-sm">{amountError}</p>}{' '}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col space-y-0 mb-6">
            <div className="flex flex-row space-x-12">
              <div>
                <label htmlFor="price" className="text-sm font-medium text-gray-700  mt-2">
                  Price
                  <small className="text-red-600">*</small>
                </label>
              </div>

              <div className="flex col  h-[5vh]">
                <div>
                  <input
                    type="text"
                    id="price"
                    name="price"
                    placeholder="Enter price"
                    onChange={handlePriceChange}
                    className="border border-gray-300 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-[210px] p-2"
                  />
                  <div className="text-start">
                    {/* {amountError && <p className="text-red-600 text-sm">{amountError}</p>} */}
                    {priceError && <p className="text-red-600 text-sm mt-1">{priceError}</p>}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-row space-x-2">
            {totalAmount && totalAmount > 0 && (
              <div class="mx-auto">
                <b>Bid Size : {totalAmount + '  ' + bidDenom}</b>
              </div>
            )}
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-1.5 rounded-xl border border-gray-300 hover:bg-gray-100 text-gray-700 font-medium mr-3"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              // className="cursor-not-allowed px-6 py-1.5 rounded-xl bg-green-500 hover:bg-green-600 text-white font-medium transition-colors duration-200 ease-in-out"
              className={`px-6 py-1.5 rounded-xl text-white font-medium transition-colors duration-200 ease-in-out ${
                loading || !isAmountValid || !isPriceValid
                  ? 'bg-green-300 cursor-not-allowed'
                  : 'bg-green-500 hover:bg-green-600'
              }`}
              disabled={loading || !isAmountValid || !isPriceValid}
            >
              {loading ? 'Placing Bid...' : 'Place Bid'}
            </button>
          </div>
        </form>
        <Toaster 

toastOptions={{
  // Define default options
  className: '',
  duration: 5000,
  style: {
    background: '#363636',
    color: '#fff',
  },

  // Default options for specific types
  success: {
    duration: 3000,
    theme: {
      primary: 'green',
      secondary: 'black',
    },
  },
}}
        />
      </div>
    </div>
  )
}

export default BidForm
