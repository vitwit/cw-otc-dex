import { Link } from "react-router-dom";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import './formstyle.css'
const CreateDeal = () => {
  const [successMsg, setSuccessMsg] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    setSuccessMsg("User registration is successful.");
    reset();
  };
    return ( 
        <>
<nav className="fixed right-0 top-0 w-full flex p-2 bg-white/90 backdrop-blur-sm z-50 font-['Raleway'] shadow-sm">
        <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
                <a href="/" className="flex-shrink-0">
                    <img className="min-w-32" src="/assets/img/otc-logo-1.svg" alt="Your Company" />
                </a>

                <div className="hidden md:block mx-auto flex items-baseline space-x-7">
                    <a href="#" className="hover:text-rose-600 rounded-md px-3 py-2 text-md text-black font-medium">
                        Explore
                    </a>
                    <a href="#" className="hover:text-rose-600 rounded-md px-3 py-2 text-md font-medium">
                        Learn
                    </a>
                    <a href="#" className="hover:text-rose-600 rounded-md px-3 py-2 text-md font-medium">
                        Marketplace
                    </a>
                    <a href="#" className="hover:text-rose-600 rounded-md px-3 py-2 text-md font-medium">
                        Earn
                    </a>
                    <a href="#" className="hover:text-rose-600 rounded-md px-3 py-2 text-md font-medium">
                        Brand
                    </a>
                </div>

                <div className="ml-auto flex items-baseline space-x-4">
                    <Link to="/profile" className="px-6 py-2 hover:bg-slate-100 border border-gray-400 rounded-xl text-black/60 font-medium cursor-pointer">
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
                    <label className="text-sm font-medium text-gray-700 w-full md:w-1/6" for="experimentName">
                        Deal title
                        <small className="text-red-600">*</small>
                    </label>
                    {/* <input type="text" 

                        placeholder="100k ATOM liquidation"
                        className="border border-gray-300 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full md:w-2/3 p-2"/> */}
                <input
                  type="text"
                  {...register("dealtitle", {
                    required: "DealTitlel is required."
                  })}
                />
                {errors.dealtitle && (
                  <p className="errorMsg">{errors.dealtitle.message}</p>
                )}
                
                </div>

                <div className="mb-6 flex flex-col md:flex-row md:items-center">
                    <label className="text-sm font-medium text-gray-700 w-full md:w-1/6" for="experimentName">
                        Deal description
                        <small className="text-gray-400 ml-2">Optional</small>
                    </label>
                    <textarea type="text" 
                        placeholder="Looking for ATOM buyers. Pirce range in between 10$ and 10.5$"
                        className="border border-gray-300 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full md:w-2/3 p-2"></textarea>
                </div>

                <div className="mb-6 flex flex-col md:flex-row md:items-center">
                    <label className="text-sm font-medium text-gray-700 w-full md:w-1/6" for="experimentName">
                        Token
                        <small className="text-red-600">*</small>
                    </label>
                    <input type="text" 
                        placeholder="ATOM"
                        className="border border-gray-300 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full md:w-2/3 p-2"/>
                </div>

                <div className="mb-6 flex flex-col md:flex-row md:items-center">
                    <label className="text-sm font-medium text-gray-700 w-full md:w-1/6" for="experimentName">
                        Amount
                        <small className="text-red-600">*</small>
                    </label>
                    <input type="text" placeholder="100,000 ATOMs" className="border border-gray-300 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full md:w-2/3 p-2"/>
                </div>

                <div className="mb-6 flex flex-col md:flex-row md:items-center">
                    <label className="text-sm font-medium text-gray-700 w-full md:w-1/6" for="experimentName">
                        Exchange token
                        <small className="text-red-600">*</small>
                    </label>
                    <input type="text" 
                        placeholder="USDT"
                        className="border border-gray-300 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full md:w-2/3 p-2"/>
                </div>

                <div className="mb-6 flex flex-col md:flex-row md:items-center">
                    <label className="text-sm font-medium text-gray-700 w-full md:w-1/6" for="experimentName">
                        Minimum Price
                        <small className="text-red-600">*</small>
                    </label>
                    <input type="text" 
                        placeholder="MinPrice"
                        className="border border-gray-300 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full md:w-2/3 p-2"/>
                </div>
                
                <div className="mb-6 flex flex-col md:flex-row md:items-center">
                    <label className="text-sm font-medium text-gray-700 w-full md:w-1/6" for="experimentName">
                        Minimum Capacity
                        <small className="text-red-600">*</small>
                    </label>
                    <input type="text" 
                        placeholder="MinCap"
                        className="border border-gray-300 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full md:w-2/3 p-2"/>
                </div>
                <div className="mb-6 flex flex-col md:flex-row md:items-center">
                    <div className="flex flex-col md:flex-row items-center w-full md:w-5/12">
                        <label className="text-sm font-medium text-gray-700 w-full md:w-2/3" for="experimentName">
                            Bid start date
                            <small className="text-red-600">*</small>
                        </label>
                        <input type="text" 
                            placeholder="YYYY-MM-DD"
                            className="border border-gray-300 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2"/>
                    </div>
                    <div className="flex flex-col md:flex-row items-center w-full md:w-5/12 mt-6 md:mt-0">
                        <label className="text-sm font-medium text-gray-700 w-full md:w-2/3 md:text-center" for="experimentName">
                            Bid end date
                            <small className="text-red-600">*</small>
                        </label>
                        <input type="text" 
                            placeholder="2024-04-09"
                            className="border border-gray-300 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2"/>
                    </div>
                </div>
            </div>

            <hr className="border border-gray-100 mt-1 md:mt-3" />
            <div className="p-5 flex">
                <div className="ml-auto">
                    <button className="px-6 py-1.5 rounded-xl border border-gray-200 hover:bg-slate-100 text-black/60 font-medium mr-3 transition-colors duration-200 ease-in-out">
                        Cancel
                    </button>
                    <button  type="submit" className="px-6 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-medium transition-colors duration-200 ease-in-out">
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
 
export default CreateDeal;






// import { useState } from 'react';

// const CreateDeal = () => {
//     const [dealData, setDealData] = useState({
//         title: '',
//         description: '',
//         token: '',
//         amount: '',
//         exchangeToken: '',
//         minPrice: '',
//         minCapacity: '',
//         bidStartDate: '',
//         bidEndDate: ''
//       });
    
//       const [errors, setErrors] = useState({
//         title: false,
//         description: false,
//         token: false,
//         amount: false,
//         exchangeToken: false,
//         minPrice: false,
//         minCapacity: false,
//         bidStartDate: false,
//         bidEndDate: false
//       });
    
//       const handleChange = (e) => {
//         const { name, value } = e.target;
//         setDealData({ ...dealData, [name]: value });
//         setErrors({ ...errors, [name]: false });
//       };
    
//       const handleCancel=()=>{
//         setDealData({  
//             title: '',
//             description: '',
//             token: '',
//             amount: '',
//             exchangeToken: '',
//             minPrice: '',
//             minCapacity: '',
//             bidStartDate: '',
//             bidEndDate: ''
//          });
//       }
//       const handleSubmit = () => {
//         // Validate if all fields are filled out
//         const requiredFields = ['title', 'token', 'amount', 'exchangeToken', 'minPrice', 'minCapacity', 'bidStartDate', 'bidEndDate'];
//         let formValid = true;
//         const updatedErrors = {};
//         requiredFields.forEach(field => {
//           if (!dealData[field]) {
//             formValid = false;
//             updatedErrors[field] = true;
//           }
//         });
    
//         if (!formValid) {
//           setErrors({ ...errors, ...updatedErrors });
//           return;
//         }
     
//         // Here you can send the dealData to your custom hook or wherever you want
//         console.log(dealData);

//         setDealData({  
//           title: '',
//           description: '',
//           token: '',
//           amount: '',
//           exchangeToken: '',
//           minPrice: '',
//           minCapacity: '',
//           bidStartDate: '',
//           bidEndDate: ''
//        });
//       };

//   return (
//     <>
// <nav className="fixed right-0 top-0 w-full flex p-2 bg-white/90 backdrop-blur-sm z-50 font-['Raleway'] shadow-sm">
//         <div className="w-full px-4 sm:px-6 lg:px-8">
//             <div className="flex h-16 items-center justify-between">
//                 <a href="/" className="flex-shrink-0">
//                     <img className="min-w-32" src="/assets/img/otc-logo-1.svg" alt="Your Company" />
//                 </a>

//                 <div className="hidden md:block mx-auto flex items-baseline space-x-7">
//                     <a href="#" className="hover:text-rose-600 rounded-md px-3 py-2 text-md text-black font-medium">
//                         Explore
//                     </a>
//                     <a href="#" className="hover:text-rose-600 rounded-md px-3 py-2 text-md font-medium">
//                         Learn
//                     </a>
//                     <a href="#" className="hover:text-rose-600 rounded-md px-3 py-2 text-md font-medium">
//                         Marketplace
//                     </a>
//                     <a href="#" className="hover:text-rose-600 rounded-md px-3 py-2 text-md font-medium">
//                         Earn
//                     </a>
//                     <a href="#" className="hover:text-rose-600 rounded-md px-3 py-2 text-md font-medium">
//                         Brand
//                     </a>
//                 </div>

//                 <div className="ml-auto flex items-baseline space-x-4">
//                     <Link to="/profile" className="px-6 py-2 hover:bg-slate-100 border border-gray-400 rounded-xl text-black/60 font-medium cursor-pointer">
//                         <i className="fas fa-user text-sm mr-2" />
//                         deotcabc...xyz
//                     </Link>
//                 </div>
//             </div>
//         </div>
//     </nav>


//       <div className="h-20"></div>

//       <main className="px-4 md:px-24 mt-4 md:mt-9 mb-9">
//         <div className="flex mb-7">
//           <h3 className="text-3xl font-medium text-black/90 font-['Alata']">
//             Create new deal
//           </h3>
//         </div>
//         <div className="w-full border rounded-lg bg-white">
//           <div className="px-6 py-4 mt-2 md:mt-5">
//             {/* Input fields */}
//             <div className="mb-6 flex flex-col md:flex-row md:items-center">
//               <label className="text-sm font-medium text-gray-700 w-full md:w-1/6" htmlFor="dealTitle">
//                 Deal title
//                 <small className="text-red-600">*</small>
//               </label>
//               <input
//                 type="text"
//                 id="dealTitle"
//                 name="title"
//                 value={dealData.title}
//                 onChange={handleChange}
//                 placeholder="100k ATOM liquidation"
//                 className="border border-gray-300 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full md:w-2/3 p-2"
//               />
//               {errors.title && <p className="text-red-500 text-sm">Title is required</p>}
//             </div>
            
//             {/* Deal description */}
//             <div className="mb-6 flex flex-col md:flex-row md:items-center">
//               <label className="text-sm font-medium text-gray-700 w-full md:w-1/6" htmlFor="dealDescription">
//                 Deal description
//                 <small className="text-gray-400 ml-2">Optional</small>
//               </label>
//               <textarea
//                 id="dealDescription"
//                 name="description"
//                 value={dealData.description}
//                 onChange={handleChange}
//                 placeholder="Looking for ATOM buyers. Price range between 10$ and 10.5$"
//                 className="border border-gray-300 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full md:w-2/3 p-2"
//               ></textarea>
//                 {errors.description && <p className="text-red-500 text-sm">Title is description</p>}
//             </div>

//             {/* Token */}
//             <div className="mb-6 flex flex-col md:flex-row md:items-center">
//               <label className="text-sm font-medium text-gray-700 w-full md:w-1/6" htmlFor="token">
//                 Token
//                 <small className="text-red-600">*</small>
//               </label>
//               <input
//                 type="text"
//                 id="token"
//                 name="token"
//                 value={dealData.token}
//                 onChange={handleChange}
//                 placeholder="ATOM"
//                 className="border border-gray-300 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full md:w-2/3 p-2"
//               />
//             </div>
//             {/* Amount */}
//             <div className="mb-6 flex flex-col md:flex-row md:items-center">
//               <label className="text-sm font-medium text-gray-700 w-full md:w-1/6" htmlFor="amount">
//                 Amount
//                 <small className="text-red-600">*</small>
//               </label>
//               <input
//                 type="text"
//                 id="amount"
//                 name="amount"
//                 value={dealData.amount}
//                 onChange={handleChange}
//                 placeholder="100,000 ATOMs"
//                 className="border border-gray-300 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full md:w-2/3 p-2"
//               />
//             </div>

//             {/* Exchange token */}
//             <div className="mb-6 flex flex-col md:flex-row md:items-center">
//               <label className="text-sm font-medium text-gray-700 w-full md:w-1/6" htmlFor="exchangeToken">
//                 Exchange token
//                 <small className="text-red-600">*</small>
//               </label>
//               <input
//                 type="text"
//                 id="exchangeToken"
//                 name="exchangeToken"
//                 value={dealData.exchangeToken}
//                 onChange={handleChange}
//                 placeholder="USDT"
//                 className="border border-gray-300 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full md:w-2/3 p-2"
//               />
//             </div>

//             {/* Minimum Price */}
//             <div className="mb-6 flex flex-col md:flex-row md:items-center">
//               <label className="text-sm font-medium text-gray-700 w-full md:w-1/6" htmlFor="minPrice">
//                 Minimum Price
//                 <small className="text-red-600">*</small>
//               </label>
//               <input
//                 type="text"
//                 id="minPrice"
//                 name="minPrice"
//                 value={dealData.minPrice}
//                 onChange={handleChange}
//                 placeholder="MinPrice"
//                 className="border border-gray-300 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full md:w-2/3 p-2"
//               />
//             </div>

//             {/* Minimum Capacity */}
//             <div className="mb-6 flex flex-col md:flex-row md:items-center">
//               <label className="text-sm font-medium text-gray-700 w-full md:w-1/6" htmlFor="minCapacity">
//                 Minimum Capacity
//                 <small className="text-red-600">*</small>
//               </label>
//               <input
//                 type="text"
//                 id="minCapacity"
//                 name="minCapacity"
//                 value={dealData.minCapacity}
//                 onChange={handleChange}
//                 placeholder="MinCap"
//                 className="border border-gray-300 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full md:w-2/3 p-2"
//               />
//             </div>

//             {/* Bid start and end dates */}
//             <div className="mb-6 flex flex-col md:flex-row md:items-center">
//               <div className="flex flex-col md:flex-row items-center w-full md:w-5/12">
//                 <label className="text-sm font-medium text-gray-700 w-full md:w-2/3" htmlFor="bidStartDate">
//                   Bid start date
//                   <small className="text-red-600">*</small>
//                 </label>
//                 <input
//                   type="text"
//                   id="bidStartDate"
//                   name="bidStartDate"
//                   value={dealData.bidStartDate}
//                   onChange={handleChange}
//                   placeholder="YYYY-MM-DD"
//                   className="border border-gray-300 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2"
//                 />
//               </div>
//               <div className="flex flex-col md:flex-row items-center w-full md:w-5/12 mt-6 md:mt-0">
//                 <label className="text-sm font-medium text-gray-700 w-full md:w-2/3 md:text-center" htmlFor="bidEndDate">
//                   Bid end date
//                   <small className="text-red-600">*</small>
//                 </label>
//                 <input
//                   type="text"
//                   id="bidEndDate"
//                   name="bidEndDate"
//                   value={dealData.bidEndDate}
//                   onChange={handleChange}
//                   placeholder="2024-04-09"
//                   className="border border-gray-300 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2"
//                 />
//               </div>
//             </div>
//           </div>
//           <hr className="border border-gray-100 mt-1 md:mt-3" />
//           <div className="p-5 flex">
//             <div className="ml-auto">
//               <button
//                 onClick={handleCancel}
//                 className="px-6 py-1.5 rounded-xl border border-gray-200 hover:bg-slate-100 text-black/60 font-medium mr-3 transition-colors duration-200 ease-in-out"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSubmit}
//                 className="px-6 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-medium transition-colors duration-200 ease-in-out"
//               >
//                 Create deal
//               </button>
//             </div>
//           </div>
//         </div>
//       </main>
//     </>
//   );
// };

// export default CreateDeal;
