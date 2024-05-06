import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import CreateDealExecute from "./CreateDealExecute";
export default function InputForm() {
  const [successMsg, setSuccessMsg] = useState(null);
  const [data,setData]=useState('');
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const onSubmit = async (data) => {
    if(data){
      setSuccessMsg(true);
      setData(data);
    }
    reset();
  };  
  const handleCancel = () => {
    reset(); // Reset the form on cancel button click
  };

  return (
    <>
  
      <nav className="fixed right-0 top-0 w-full flex p-2 bg-white/90 backdrop-blur-sm z-50 font-['Raleway'] shadow-sm">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <a href="/" className="flex-shrink-0">
              <img
                className="min-w-32"
                src="/assets/img/otc-logo-1.svg"
                alt="Your Company"
              />
            </a>
            <div className="hidden md:block mx-auto flex items-baseline space-x-7">
              <a
                href="#"
                className="hover:text-rose-600 rounded-md px-3 py-2 text-md text-black font-medium"
              >
                Explore
              </a>
              <a
                href="#"
                className="hover:text-rose-600 rounded-md px-3 py-2 text-md font-medium"
              >
                Learn
              </a>
              <a
                href="#"
                className="hover:text-rose-600 rounded-md px-3 py-2 text-md font-medium"
              >
                Marketplace
              </a>
              <a
                href="#"
                className="hover:text-rose-600 rounded-md px-3 py-2 text-md font-medium"
              >
                Earn
              </a>
              <a
                href="#"
                className="hover:text-rose-600 rounded-md px-3 py-2 text-md font-medium"
              >
                Brand
              </a>
            </div>

            <div className="ml-auto flex items-baseline space-x-4">
              <Link
                to="/profile"
                className="px-6 py-2 hover:bg-slate-100 border border-gray-400 rounded-xl text-black/60 font-medium cursor-pointer"
              >
                <i className="fas fa-user text-sm mr-2" />
                deotcabc...xyz
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="h-20"></div>

      <main className="px-4 md:px-24 mt-4 md:mt-9 mb-9">
        <div className="flex mb-7">
          <h3 className="text-3xl font-medium text-black/90 font-['Alata']">
            Create new deal
          </h3>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="w-full border rounded-lg bg-white">

            
            <div className="px-6 py-4 mt-2 md:mt-5">
                <div className="mb-6 flex flex-col md:flex-row md:items-center">
                <label
                  className="text-sm font-medium text-gray-700 w-full md:w-1/6"
                  htmlFor="dealtitle"
                >
                  Deal title
                  <small className="text-red-600">*</small>
                </label>
                <input
                  type="text"
                  id="dealtitle"
                  className="border border-gray-300 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full md:w-2/3 p-2"
                  placeholder="100k ATOM liquidation"
                  {...register("dealtitle", {
                    required: "Deal title is required.",
                    pattern: {
                      value: /^[a-zA-Z0-9\s]*$/,
                      message: "Deal title must contain only letters and numbers.",
                    },
                  })}
               
                />
                {errors.dealtitle && (
                  <p className="errorMsg">{errors.dealtitle.message}</p>
                )}
              </div>          
              <div className="mb-6 flex flex-col md:flex-row md:items-center">
                <label
                  className="text-sm font-medium text-gray-700 w-full md:w-1/6"
                  for="experimentName"
                >
                  Deal description
                  <small className="text-gray-400 ml-2">Optional</small>
                </label>

                <input
                  type="textarea"
                  className="border border-gray-300 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full md:w-2/3 p-2"
                  placeholder="Looking for ATOM buyers. Pirce range in between 10$ and 10.5$"
                  {...register("dealdescription", {
                    required:"Deal description should be entered",
                    pattern: {
                      value: /^[a-zA-Z0-9\s]*$/,
                      message: "Deal description must contain only letters and numbers.",
                    },
                  })}
                />
                {errors.dealdescription && (
                  <p className="errorMsg">{errors.dealdescription.message}</p>
                )}
              </div>

              <div className="mb-6 flex flex-col md:flex-row md:items-center">
                <label
                  className="text-sm font-medium text-gray-700 w-full md:w-1/6"
                  for="experimentName"
                >
                  Token
                  <small className="text-red-600">*</small>
                </label>
                <input
                  type="text"
                  className="border border-gray-300 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full md:w-2/3 p-2"
                  placeholder="ATOM"
                  {...register("dealdenom", {
                    required: "Dealdenom is required.",
                    pattern: {
                      value: /^[a-zA-Z\s]*$/,
                      message: "Deal token must contain only letters.",
                    },
                  })}
                />
                {errors.dealdenom && (
                  <p className="errorMsg">{errors.dealdenom.message}</p>
                )}
              </div>
              <div className="mb-6 flex flex-col md:flex-row md:items-center">
                <label
                  className="text-sm font-medium text-gray-700 w-full md:w-1/6"
                  htmlFor="amount"
                >
                  Amount
                  <small className="text-red-600">*</small>
                </label>
                <input
                  type="text"
                  id="amount"
                  className="border border-gray-300 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full md:w-2/3 p-2"
                  placeholder="100,000 ATOMs"
                  {...register("amount", {
                    required: "Amount is required.",
                    pattern: {
                      value: /^[0-9]+$/,
                      message: "Amount must contain only numbers.",
                    },
                  })}
                />
                {errors.amount && (
                  <p className="errorMsg">{errors.amount.message}</p>
                )}
              </div>
              <div className="mb-6 flex flex-col md:flex-row md:items-center">
                <label
                  className="text-sm font-medium text-gray-700 w-full md:w-1/6"
                  for="experimentName"
                >
                  Exchange token
                  <small className="text-red-600">*</small>
                </label>
                <input
                  type="text"
                  placeholder="USDT"
                  className="border border-gray-300 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full md:w-2/3 p-2"
                  {...register("bidtoken", {
                    required: "Enter the bidtokedenom ",
                    pattern: {
                      value: /^[a-zA-Z\s]*$/,
                      message: "Bid token must contain only letters.",
                    },
                  })}
                />
                {errors.bidtoken && (
                  <p className="errorMsg">{errors.bidtoken.message}</p>
                )}
              </div>

              <div className="mb-6 flex flex-col md:flex-row md:items-center">
                <label
                  className="text-sm font-medium text-gray-700 w-full md:w-1/6"
                  htmlFor="min_price"
                >
                  Minimum Price
                  <small className="text-red-600">*</small>
                </label>
                <input
                  type="text"
                  id="min_price"
                  className="border border-gray-300 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full md:w-2/3 p-2"
                  placeholder="MinPrice"
                  {...register("min_price", {
                    required: "Minimum price is required.",
                    pattern: {
                      value: /^[0-9]+$/,
                      message: "Minimum price must contain only numbers.",
                    },
                  })}
                />
                {errors.min_price && (
                  <p className="errorMsg">{errors.min_price.message}</p>
                )}
              </div>
              {/* Minimum Capacity */}
              <div className="mb-6 flex flex-col md:flex-row md:items-center">
                <label
                  className="text-sm font-medium text-gray-700 w-full md:w-1/6"
                  htmlFor="min_capacity"
                >
                  Minimum Capacity
                  <small className="text-red-600">*</small>
                </label>
                <input
                  type="text"
                  id="min_capacity"
                  className="border border-gray-300 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full md:w-2/3 p-2"
                  placeholder="MinCap"
                  {...register("min_capacity", {
                    required: "Minimum capacity is required.",
                    pattern: {
                      value: /^[0-9]+$/,
                      message: "Minimum capacity must contain only numbers.",
                    },
                  })}
                />
                {errors.min_capacity && (
                  <p className="errorMsg">{errors.min_capacity.message}</p>
                )}
              </div>

        
              <div className="mb-6 flex flex-col md:flex-row md:items-center">
                <div className="flex flex-col md:flex-row items-center w-full md:w-5/12">
                  <label
                    className="text-sm font-medium text-gray-700 w-full md:w-2/3"
                    for="experimentName"
                  >
                    Bid start date
                    <small className="text-red-600">*</small>
                  </label>
                  <input
                    type="text"
                    placeholder="YYYY-MM-DD"
                    className="border border-gray-300 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2"
                    {...register("startdate", {
                      required: "Enter the start date",
                      pattern: {
                        value: /^[0-9]+$/,
                        message: "startdate must contain only numbers.",
                      },
                    })}
                  />
                  {errors.startdate && (
                    <p className="errorMsg">{errors.startdate.message}</p>
                  )}
                </div>
                <div className="flex flex-col md:flex-row items-center w-full md:w-5/12 mt-6 md:mt-0">
                  <label
                    className="text-sm font-medium text-gray-700 w-full md:w-2/3 md:text-center"
                    for="experimentName"
                  >
                    Bid end date
                    <small className="text-red-600">*</small>
                  </label>
                  <input
                    type="text"
                    placeholder="2024-04-09"
                    className="border border-gray-300 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2"
                    {...register("enddate", {
                      required: "Enter the end-date",
                      pattern: {
                        value: /^[0-9]+$/,
                        message: "enddate must contain only numbers.",
                      },
                    })}
                  />
                  {errors.enddate && (
                    <p className="errorMsg">{errors.enddate.message}</p>
                  )}
                </div>
              </div>
            </div>
            { successMsg&& 
    <CreateDealExecute data={data} /> }
            <hr className="border border-gray-100 mt-1 md:mt-3" />
            <div className="p-5 flex">
              <div className="ml-auto">
                <button 
                  type="button"
                  onClick={handleCancel}
                className="px-6 py-1.5 rounded-xl border border-gray-200 hover:bg-slate-100 text-black/60 font-medium mr-3 transition-colors duration-200 ease-in-out">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-medium transition-colors duration-200 ease-in-out"
                >
                  Create deal
                </button>
              </div>
            </div>
          </div>
        </form>
      </main>
    </>
  );
}
