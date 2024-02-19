import { FinalReceiptMemberSplit, FinalReceiptSplit, Receipt } from "@/app/utils/types";

interface FinalReceiptSplitConfirmationProps {
  finalReceiptSplit: FinalReceiptSplit;
  receipt: Receipt;
}

export default function FinalReceiptSplitConfirmation({ finalReceiptSplit, receipt } : FinalReceiptSplitConfirmationProps) {
  return (
    <div className="p-4">
      <table className="min-w-full table-fixed">
        <thead>
          <tr>
            <th>Item</th>
            {finalReceiptSplit.members.map(member => (
              <th key={member.memberInfo.id}>{member.memberInfo.first_name}</th>
            ))}
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {receipt.items.map(item => (
            <tr key={item.name}>
              <td>{item.name}</td>
              {finalReceiptSplit.members.map(member => (
                <td key={member.memberInfo.id}>{member.splits[item.name]?.toFixed(2) || '-'}</td>
              ))}
              <td>{item.totalItemPrice.toFixed(2)}</td>
            </tr>
          ))}
          <tr>
            <td>Subtotal</td>
            {finalReceiptSplit.members.map(member => (
              <td key={member.memberInfo.id}>{member.subtotal}</td>
            ))}
            <td>{receipt.subtotal.toFixed(2)}</td>
          </tr>
          <tr>
            <td>Tip</td>
            {finalReceiptSplit.members.map(member => (
              <td key={member.memberInfo.id}>{member.tip}</td>
            ))}
            <td>{receipt.tip.toFixed(2)}</td>
          </tr>
          <tr>
            <td>Service Fee</td>
            {finalReceiptSplit.members.map(member => (
              <td key={member.memberInfo.id}>{member.serviceFee}</td>
            ))}
            <td>{receipt.serviceFee.toFixed(2)}</td>
          </tr>
          <tr>
            <td>Tax</td>
            {finalReceiptSplit.members.map(member => (
              <td key={member.memberInfo.id}>{member.tax}</td>
            ))}
            <td>{receipt.tax.toFixed(2)}</td>
          </tr>
          <tr>
            <td>Total</td>
            {finalReceiptSplit.members.map(member => (
              <td key={member.memberInfo.id}>{member.total}</td>
            ))}
            <td>{receipt.totalPrice.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
      <div className="flex justify-center mt-4">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Confirm
        </button>
      </div>
    </div>
  );
}