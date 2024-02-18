import { GetGroupResponse, Item, Receipt, SplitwiseMember } from "@/app/utils/types";
import { useEffect, useState } from "react";

interface SplitReceiptProps {
  receipt: Receipt;
}

interface SplitReceiptFormState {
  [item: string]: SplitwiseMember[];
}

export default function SplitReceipt({ receipt }: SplitReceiptProps) {
  const [groupId, setGroupId] = useState(0);
  const [groupMembers, setGroupMembers] = useState<Array<SplitwiseMember>>([]);
  const [formState, setFormState] = useState<SplitReceiptFormState>();

  const fetchData = async () => {
    // Call Splitwise API
    const splitwiseRawResponse = await fetch("/api/splitwise/group", {
      method: "GET"
    });
    const splitwiseResponse: GetGroupResponse = await splitwiseRawResponse.json();

    setGroupId(splitwiseResponse.groupId);
    setGroupMembers(splitwiseResponse.groupMembers);
  }

  const constructFormState = () => {
    const jsonObject: { [item: string]: SplitwiseMember[] } = {};
  
    receipt.items.forEach(item => {
      jsonObject[item.name] = [];
    });

    setFormState(jsonObject);
  }

  useEffect(() => {
    // Fill in initial state
    fetchData();
    
    // Set initial form state
    constructFormState();
  },[]);

  const handleMemberClick = (itemName: string, member: SplitwiseMember) => {
    const isSelected = formState![itemName]?.includes(member);

    if (isSelected) {
      // Update the state to no longer include the member for this item
      setFormState({
        ...formState,
        [itemName]: formState![itemName].filter(currentMember => currentMember.id !== member.id),
      });
    } else {
      // Update the state to include the new member for this item
      setFormState({
        ...formState,
        [itemName]: [...formState![itemName], member],
      });
    }

    console.log(formState);
  };

  return (
    <div className="p-4">
      <table className="min-w-full table-fixed">
        <thead>
          <tr className="border-b">
            <th className="text-left p-2">Item</th>
            <th className="text-left p-2">Price</th>
            <th className="text-left p-2">Members</th>
          </tr>
        </thead>
        <tbody>
          {receipt.items.map((item, index) => (
            <tr key={index} className="border-b">
              <td className="p-2">{item.name}</td>
              <td className="p-2">${item.totalItemPrice.toFixed(2)}</td>
              <td className="p-2">
                {groupMembers.map((member) => {
                  const isSelected = formState![item.name].includes(member);
                  return (
                    <button
                      key={member.id}
                      className={`m-1 text-white font-bold py-1 px-2 rounded ${
                        isSelected ? 'bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
                      }`}
                      onClick={() => handleMemberClick(item.name, member)}
                    >
                      {member.first_name}
                    </button>
                  )
              })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}