import {
  GetGroupResponse,
  Item,
  Receipt,
  ProposedSplits,
  SplitwiseMember,
  FinalReceiptSplit,
} from "@/app/utils/types";
import { useEffect, useState } from "react";

interface SplitReceiptProps {
  receipt: Receipt;
  setFinalReceiptSplit: (finalReceiptSplit: FinalReceiptSplit) => void;
  setGroupId: (groupId: number) => void;
}

export default function SplitReceipt({
  receipt,
  setFinalReceiptSplit,
  setGroupId,
}: SplitReceiptProps) {
  const [groupMembers, setGroupMembers] = useState<Array<SplitwiseMember>>([]);
  const [formState, setFormState] = useState<ProposedSplits>();

  const fetchData = async () => {
    // Call Splitwise API
    const splitwiseRawResponse = await fetch("/api/splitwise/group", {
      method: "GET",
    });
    const splitwiseResponse: GetGroupResponse =
      await splitwiseRawResponse.json();

    setGroupId(splitwiseResponse.groupId);
    setGroupMembers(splitwiseResponse.groupMembers);
  };

  const constructFormState = () => {
    const jsonObject: { [item: string]: SplitwiseMember[] } = {};

    receipt.items.forEach((item) => {
      jsonObject[item.name] = [];
    });

    setFormState(jsonObject);
  };

  useEffect(() => {
    // Fill in initial state
    fetchData();

    // Set initial form state
    constructFormState();
  }, []);

  const handleMemberClick = (itemName: string, member: SplitwiseMember) => {
    const isSelected = formState![itemName]?.includes(member);

    if (isSelected) {
      // Update the state to no longer include the member for this item
      setFormState({
        ...formState,
        [itemName]: formState![itemName].filter(
          (currentMember) => currentMember.id !== member.id
        ),
      });
    } else {
      // Update the state to include the new member for this item
      setFormState({
        ...formState,
        [itemName]: [...formState![itemName], member],
      });
    }
  };

  const handleSubmit = async () => {
    const rawResponse = await fetch("/api/calculate_split", {
      method: "POST",
      body: JSON.stringify({
        members: groupMembers,
        receipt: receipt,
        memberSplits: formState,
      }),
    });
    const response = await rawResponse.json();
    setFinalReceiptSplit(response["splitReceiptValue"]);
  };

  return (
    <div className="p-4">
      <table className="min-w-full table-fixed">
        <thead>
          <tr className="border-b">
            <th className="text-left p-2">Item</th>
            <th className="text-left p-2">Quantity</th>
            <th className="text-left p-2">Total Price</th>
            <th className="text-left p-2">Members</th>
          </tr>
        </thead>
        <tbody>
          {receipt.items.map((item, index) => (
            <tr key={index} className="border-b">
              <td className="p-2">{item.name}</td>
              <td className="p-2">{item.quantity}</td>
              <td className="p-2">${item.totalItemPrice.toFixed(2)}</td>
              <td className="p-2">
                {groupMembers.map((member) => {
                  const isSelected = formState![item.name].includes(member);
                  return (
                    <button
                      key={member.id}
                      className={`m-1 text-white font-bold py-1 px-2 rounded ${
                        isSelected
                          ? "bg-blue-700"
                          : "bg-blue-500 hover:bg-blue-600"
                      }`}
                      onClick={() => handleMemberClick(item.name, member)}
                    >
                      {member.first_name}
                    </button>
                  );
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        onClick={handleSubmit}
        className="px-6 py-2 border rounded-md bg-blue-500 text-white hover:bg-blue-600 m-2.5"
      >
        Submit
      </button>
    </div>
  );
}
