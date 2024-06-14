import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Deal from './Deal';
import Header from './components/Header';
import { useAllDeals } from './hooks/useAllDeals';

const DealsComponent = () => {
  const { user, response, latestBlockHeight } = useAllDeals();
  const [deals, setDeals] = useState([]);
  const [filteredDeals, setFilteredDeals] = useState([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    if (response && Array.isArray(response.deals)) {
      setDeals(response.deals);
    }
  }, [response]);

  useEffect(() => {
    if (latestBlockHeight !== null) {
      const categorizeDeals = () => {
        const live = [];
        const upcoming = [];
        const completed = [];
        console.log("latest block height is:",latestBlockHeight);

        deals.forEach((deal) => {
          const startBlock = deal[1].start_block;
          const endBlock = deal[1].end_block;
          console.log("deals are :",deal)
          console.log("start block is:",startBlock);
          console.log("end block is:",endBlock);
          if (Number(latestBlockHeight) < Number(startBlock)) {
            upcoming.push(deal);
          } else if (Number(startBlock) <= Number(latestBlockHeight) && Number(latestBlockHeight) <= Number(endBlock)) {
            live.push(deal);
          } else {
            completed.push(deal);
          }
        });

        return { live, upcoming, completed };
      };

      const { live, upcoming, completed } = categorizeDeals();

      switch (filter) {
        case 'Live':
          setFilteredDeals(live);
          break;
        case 'Upcoming':
          setFilteredDeals(upcoming);
          break;
        case 'Completed':
          setFilteredDeals(completed);
          break;
        default:
          setFilteredDeals(deals);
      }
    }
  }, [deals, filter, latestBlockHeight]);

  return (
    <>
      <div>
        <Header />
        <div className="h-20"></div>

        <main className="px-4 md:px-24 mt-9 mb-9">
          <div className="flex mb-9">
            <h3 className="text-3xl font-medium text-black/90 font-['Alata']">Deals</h3>
            <div className="ml-auto">
              <Link
                to="/create-deal"
                className="px-6 py-2 rounded-xl border border-rose-500 hover:border-rose-600 text-rose-500 hover:text-rose-600 hover:bg-rose-50 font-medium transition-colors duration-200 ease-in-out"
              >
                <i className="fas fa-plus mr-1" />
                Create new deal
              </Link>
            </div>
          </div>

          <div className="flex items-center overflow-x-auto space-x-2 whitespace-nowrap scrollbar-hide w-full">
            <span className="font-medium text-gray-600 mr-3">Filters:</span>
            {['All', 'Live', 'Upcoming', 'Completed'].map((status) => (
              <button
                key={status}
                className={`px-5 py-1.5 text-sm font-medium rounded-md transition-colors duration-200 ease-in-out ${
                  filter === status
                    ? 'bg-blue-500 text-white border border-blue-500'
                    : 'text-gray-700 border border-gray-500 hover:text-blue-700 hover:border-blue-600 hover:bg-blue-100'
                }`}
                onClick={() => setFilter(status)}
              >
                {status}
              </button>
              
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-12 mb-36">
            {filteredDeals.length > 0 ? (
              filteredDeals.map((deal, index) => (
                <Deal dealId={deal[0]} dealDetails={deal[1]} key={index} />
              ))
            ) : (
              <p>No deals available</p>
            )}
          </div>
        </main>
        <style>{`
          .truncate-2-lines {
            overflow: hidden;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }
        `}</style>
      </div>
    </>
  );
};

export default DealsComponent;
