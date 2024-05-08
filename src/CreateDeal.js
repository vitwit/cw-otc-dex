import { useRef } from "react";
import Header from "./components/Header";
import { getOfflineSignerAndCosmWasmClient } from "./GetClient";
import { AppConstants } from "./config/constant";
const CreateDeal = () => {
    const formRef = useRef(null);

    const handleSubmit = e => {
        e.preventDefault();
        const formData = new FormData(formRef.current);
        console.log(formData.get('dealTitle'));
        console.log(formData.get('dealDescription'));
        console.log(formData.get('tokenName'));

        const submitDeal = async () => {
            try {
                const { offlineSigner, CosmWasmClient } = await getOfflineSignerAndCosmWasmClient();
                const contractAddress = AppConstants.CONTRACT_ADDRESS;
                let accounts = await offlineSigner.getAccounts();
                const currentAddress = accounts[0].address;
                // setUser(currentAddress);
                const query = {
                    "create_deal": { "deal_creator": "osmo1gctn8rslha4k5lmams38539vzncnf548fyrgse", "min_cap": "70000000000", "total_bid": "0", "deal_token_denom": "uosmo", "deal_token_amount": "100000000000", "start_block": "737", "end_block": "9000", "bid_token_denom": "uusdc", "min_price": "1600000" }
                };
                const response = await CosmWasmClient.queryClient.wasm.execute(contractAddress, query)
                // setResponse(response);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        submitDeal()
    }

    return (
        <>
            <Header />
            <main className="px-4 md:px-24 mt-4 md:mt-9 mb-9">

                <div className="flex mb-7">
                    <h3 className="text-3xl font-medium text-black/90 font-['Alata']">
                        Create new deal
                    </h3>
                </div>
                <form ref={formRef} onSubmit={handleSubmit}>

                    <div className="w-full border rounded-lg bg-white">
                        <div className="px-6 py-4 mt-2 md:mt-5">
                            <div className="mb-6 flex flex-col md:flex-row md:items-center">
                                <label className="text-sm font-medium text-gray-700 w-full md:w-1/6" htmlFor="dealTitle">
                                    Deal title
                                    <small className="text-red-600">*</small>
                                </label>
                                <input
                                    type="text"
                                    name="dealTitle"
                                    placeholder="100k ATOM liquidation"
                                    className="border border-gray-300 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full md:w-2/3 p-2" />
                            </div>

                            <div className="mb-6 flex flex-col md:flex-row md:items-center">
                                <label className="text-sm font-medium text-gray-700 w-full md:w-1/6" htmlFor="dealDescription">
                                    Deal description
                                    <small className="text-gray-400 ml-2">Optional</small>
                                </label>
                                <textarea
                                    name="dealDescription"
                                    type="text"
                                    placeholder="Looking for ATOM buyers. Pirce range in between 10$ and 10.5$"
                                    className="border border-gray-300 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full md:w-2/3 p-2"></textarea>
                            </div>

                            <div className="mb-6 flex flex-col md:flex-row md:items-center">
                                <label className="text-sm font-medium text-gray-700 w-full md:w-1/6" htmlFor="tokenName">
                                    Token
                                    <small className="text-red-600">*</small>
                                </label>
                                <input
                                    type="text"
                                    name="tokenName"
                                    placeholder="ATOM"
                                    className="border border-gray-300 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full md:w-2/3 p-2" />
                            </div>

                            <div className="mb-6 flex flex-col md:flex-row md:items-center">
                                <label className="text-sm font-medium text-gray-700 w-full md:w-1/6" htmlFor="tokenAmount">
                                    Amount
                                    <small className="text-red-600">*</small>
                                </label>
                                <input
                                    name="tokenAmount"
                                    type="text" placeholder="100,000 ATOMs" className="border border-gray-300 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full md:w-2/3 p-2" />
                            </div>

                            <div className="mb-6 flex flex-col md:flex-row md:items-center">
                                <label className="text-sm font-medium text-gray-700 w-full md:w-1/6" htmlFor="exchangeToken">
                                    Exchange token
                                    <small className="text-red-600">*</small>
                                </label>
                                <input
                                    name="exchangeToken"
                                    type="text"
                                    placeholder="USDT"
                                    className="border border-gray-300 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full md:w-2/3 p-2" />
                            </div>

                            <div className="mb-6 flex flex-col md:flex-row md:items-center">
                                <label className="text-sm font-medium text-gray-700 w-full md:w-1/6" htmlFor="minPrice">
                                    Minimum Price
                                    <small className="text-red-600">*</small>
                                </label>
                                <input
                                    name="minPrice"
                                    type="text"
                                    placeholder="MinPrice"
                                    className="border border-gray-300 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full md:w-2/3 p-2" />
                            </div>

                            <div className="mb-6 flex flex-col md:flex-row md:items-center">
                                <label className="text-sm font-medium text-gray-700 w-full md:w-1/6" htmlFor="minCapacity">
                                    Minimum Capacity
                                    <small className="text-red-600">*</small>
                                </label>
                                <input
                                    name="minCapacity"
                                    type="text"
                                    placeholder="MinCap"
                                    className="border border-gray-300 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full md:w-2/3 p-2" />
                            </div>
                            <div className="mb-6 flex flex-col md:flex-row md:items-center">
                                <div className="flex flex-col md:flex-row items-center w-full md:w-5/12">
                                    <label className="text-sm font-medium text-gray-700 w-full md:w-2/3" htmlFor="bidStartDate">
                                        Bid start date
                                        <small className="text-red-600">*</small>
                                    </label>
                                    <input
                                        name="bidStartDate"
                                        type="datetime-local"
                                        placeholder="YYYY-MM-DD"
                                        className="border border-gray-300 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2" />
                                </div>
                                <div className="flex flex-col md:flex-row items-center w-full md:w-5/12 mt-6 md:mt-0">
                                    <label className="text-sm font-medium text-gray-700 w-full md:w-2/3 md:text-center" htmlFor="bidEndDate">
                                        Bid end date
                                        <small className="text-red-600">*</small>
                                    </label>
                                    <input
                                        name="bidEndDate"
                                        type="datetime-local"
                                        placeholder="2024-04-09"
                                        className="border border-gray-300 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2" />
                                </div>
                            </div>
                        </div>

                        <hr className="border border-gray-100 mt-1 md:mt-3" />
                        <div className="p-5 flex">
                            <div className="ml-auto">
                                <button className="px-6 py-1.5 rounded-xl border border-gray-200 hover:bg-slate-100 text-black/60 font-medium mr-3 transition-colors duration-200 ease-in-out">
                                    Cancel
                                </button>
                                <button className="px-6 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-medium transition-colors duration-200 ease-in-out">
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