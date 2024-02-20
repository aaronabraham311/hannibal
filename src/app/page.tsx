'use client';

import PasteMimeText from "@/components/pasteMimeText";
import { useEffect, useState } from "react";
import { FinalReceiptSplit, Receipt } from "./utils/types";
import SplitReceipt from "@/components/splitReceipt";
import FinalReceiptSplitConfirmation from "@/components/finalReceiptSplitConfirmation";

export default function Home() {
  const [receipt, setReceipt] = useState<Receipt>();
  const [finalReceiptSplit, setFinalReceiptSplit] = useState<FinalReceiptSplit>();
  const [groupId, setGroupId] = useState(0);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
     <PasteMimeText setReceipt={setReceipt}/>
     {receipt && (
      <SplitReceipt receipt={receipt} setFinalReceiptSplit={setFinalReceiptSplit} setGroupId={setGroupId}/>
     )}
     {finalReceiptSplit && receipt && (
      <FinalReceiptSplitConfirmation
        receipt={receipt}
        finalReceiptSplit={finalReceiptSplit}
        groupId={groupId}
      />
     )}
    </main>
  );
}
