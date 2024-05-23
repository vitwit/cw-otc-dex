const ActivityItem = ({bid}) => {
    const { bidder, amount, price, denom ,seconds} = bid;
    // Example epoch time in seconds
const epochSeconds = seconds;

// Convert to milliseconds
const epochMilliseconds = epochSeconds * 1000;

// Create a Date object
const date = new Date(epochMilliseconds);

// Get formatted date and time
const formattedDate = date.toLocaleDateString(); // e.g., "6/1/2021"
const formattedTime = date.toLocaleTimeString(); // e.g., "12:00:00 AM"

// console.log(`Date: ${formattedDate}`);
// console.log(`Time: ${formattedTime}`);

//     console.log("activity",bid);
    return (<>
      <tr className="bg-white border-b hover:bg-slate-50">
                    <td className="py-4 px-6">
                      <span className="border border-slate-100 px-3 py-0.5 rounded-lg bg-zinc-200 text-gray-600 font-medium">
                        Bid
                      </span>
                    </td>
                    <td className="py-4 px-6">${amount}</td>
                    <td className="py-4 px-6">${price}</td>
                    <td className="py-4 px-6">
                      <a href="#" className="text-rose-600">
                      {bidder.substring(0, 10)}...{bidder.substring(bidder.length - 4)}
                      </a>
                    </td>
                    <td className="py-4 px-5">{formattedDate}   {formattedTime}</td>
     </tr>
    </>);
}
 
export default ActivityItem;