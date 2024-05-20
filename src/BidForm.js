import React, { useState, useRef } from 'react';
import toast, { Toaster } from 'react-hot-toast';

const BidForm = ({ onCancel, onPlaceBid }) => {
  const formRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(formRef.current));
    const { amount, price, denom } = formData;

    // Validate form fields
    if (!amount) {
      toast.error("Enter Amount");
      return;
    }
    if (!price) {
      toast.error("Enter Price");
      return;
    }
    if (!denom) {
      toast.error("Enter Denom");
      return;
    }
    setLoading(true);
    try {
      console.log(formData);
      await onPlaceBid(formData); // Pass formData to the onPlaceBid function
      toast.success('Bid placed successfully!');
      formRef.current.reset(); // Reset form fields after successful submission
    } catch (error) {
      toast.error('Error placing bid. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-[750px]">
        <h2 className="text-xl font-medium mb-4">Place New Bid</h2>
        <form ref={formRef} onSubmit={handleSubmit}>
          <div className="mb-6 flex flex-row space-x-2" >
            <label htmlFor="amount" className="text-sm font-medium text-gray-700 mt-2">
              Amount
              <small className="text-red-600">*</small>
            </label>
            <input
              type="text"
              id="amount"
              name="amount"
              placeholder="Enter amount"
              className="border border-gray-300 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2"
            />
          </div>
          <div className="mb-6 flex flex-row space-x-6">
            <label htmlFor="price" className="text-sm font-medium text-gray-700  mt-2">
              Price
              <small className="text-red-600">*</small>
            </label>
            <input
              type="text"
              id="price"
              name="price"
              placeholder="Enter price"
              className="border border-gray-300 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2"
            />
          </div>
          <div className="mb-6 flex flex-row space-x-2">
            <label htmlFor="denom" className="text-sm font-medium text-gray-700  mt-2">
              Denom
              <small className="text-red-600">*</small>
            </label>
            <input
              type="text"
              id="denom"
              name="denom"
              placeholder="Enter denom"
              className="border border-gray-300 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2"
            />
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
              className="px-6 py-1.5 rounded-xl bg-green-500 hover:bg-green-600 text-white font-medium transition-colors duration-200 ease-in-out"
              disabled={loading}
            >
              {loading ? 'Placing Bid...' : 'Place Bid'}
            </button>
          </div>
        </form>
        <Toaster />
      </div>
    </div>
  );
};

export default BidForm;
