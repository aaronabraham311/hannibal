import { GetGroupResponse, Receipt, SplitwiseMember } from "@/app/utils/types";
import { useEffect, useState } from "react";

interface SplitReceiptProps {
  receipt: Receipt;
}

export default function SplitReceipt({ receipt }: SplitReceiptProps) {
  const [groupId, setGroupId] = useState(0);
  const [groupMembers, setGroupMembers] = useState<Array<SplitwiseMember>>([]);

  useEffect(() => {
    const fetchData = async () => {
      // Call Splitwise API
      const splitwiseRawResponse = await fetch("/api/splitwise/group", {
        method: "GET"
      });
      const splitwiseResponse: GetGroupResponse = await splitwiseRawResponse.json();

      setGroupId(splitwiseResponse.groupId);
      setGroupMembers(splitwiseResponse.groupMembers);
    }
    
    // Fill in initial state
    fetchData();
  },[]);

  return (
    <div className="p-4">
      <table className="min-w-full table-fixed">
        <thead>
          <tr className="border-b">
            <th className="text-left p-2">Item</th>
            <th className="text-left p-2">Price</th>
            <th className="text-left p-2">Members</th>
            <th className="text-left p-2">Select</th>
          </tr>
        </thead>
        <tbody>
          {receipt.items.map((item, index) => (
            <tr key={index} className="border-b">
              <td className="p-2">{item.name}</td>
              <td className="p-2">${item.totalItemPrice.toFixed(2)}</td>
              <td className="p-2">
                {groupMembers.map((member) => (
                  <button
                    key={member.id}
                    className="m-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                    onClick={() => console.log(`Item ${item.name} split with member ${member.first_name}`)}
                  >
                    {member.first_name}
                  </button>
                ))}
              </td>
              <td className="p-2">
                <button
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded"
                  onClick={() => console.log(`All members selected for item ${item.name}`)}
                >
                  Split All
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}