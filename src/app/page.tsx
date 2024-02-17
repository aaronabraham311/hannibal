'use client';

import PasteMimeText from "@/components/pasteMimeText";
import { useState } from "react";
import { Receipt } from "./utils/types";
import SplitReceipt from "@/components/splitReceipt";

export default function Home() {
  const [receipt, setReceipt] = useState<Receipt>();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
     <PasteMimeText setReceipt={setReceipt}/>
     {receipt && (
        <SplitReceipt receipt={receipt} />
     )}
    </main>
  );
}
