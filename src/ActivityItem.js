import icons from './assets/icons.json'
const ActivityItem = ({ bid, dealDenom, deal_Decimal }) => {
  const { bidder, amount, price, denom, seconds } = bid
  // Example epoch time in seconds
  const epochSeconds = seconds
  const quantity = Number(amount) / 10 ** Number(deal_Decimal)
  // Convert to milliseconds
  const epochMilliseconds = epochSeconds * 1000

  // Create a Date object
  const date = new Date(epochMilliseconds)

  // Get formatted date and time
  const formattedDate = date.toLocaleDateString() // e.g., "6/1/2021"
  const formattedTime = date.toLocaleTimeString() // e.g., "12:00:00 AM"

  // console.log(`Date: ${formattedDate}`);
  // console.log(`Time: ${formattedTime}`);

  //     console.log("activity",bid);
  return (
    <>
      <tr className="bg-white border-b hover:bg-slate-50">
        <td className="py-4 px-6">
          <span className="border border-slate-100 px-3 py-0.5 rounded-lg bg-zinc-200 text-gray-600 font-medium">
            Bid
          </span>
        </td>
        <td className="py-4 px-6">
          <div className="flex ">
            <img src={icons[dealDenom]} alt={dealDenom} className="inline-block w-4 h-4 mr-1" />
            {quantity}
          </div>
        </td>
        <td className="py-10 px-6 flex items-center justify-center">
          <img src={icons[bid.denom]} alt={bid.denom} className="inline-block w-4 h-4 mr-1" />
          {price}
        </td>
        <td className="py-4 px-6">
          <a href="#" className="text-rose-600">
            {bidder.substring(0, 10)}...{bidder.substring(bidder.length - 4)}
          </a>
        </td>
        <td className="">
          {formattedDate}
          <br />
          {formattedTime}
        </td>
      </tr>
    </>
  )
}

export default ActivityItem
