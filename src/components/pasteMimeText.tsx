import { ChangeEvent, MouseEvent, useState } from "react"

import { Receipt } from "@/app/types";

interface PasteMimeTextProps {
  setReceipt: (receipt: Receipt) => void;
}

export default function PasteMimeText({ setReceipt } : PasteMimeTextProps) {
  const [mimeText, setMimeText] = useState("");
  const [isParsing, setIsParsing] = useState(false);

  const handleTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setMimeText(event.target.value);
  }

  const handleSubmit = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    setIsParsing(true);

    // Parse mimeText using OpenAI call
    const response = await fetch("/api/parse", {
      method: "POST",
      body: JSON.stringify({"text": mimeText})
    })
    const parsedReceipt = await response.json() as Receipt;
    console.log(parsedReceipt)
    // Set state
    setReceipt(parsedReceipt);
    setIsParsing(false);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Hannibal</h1>
      <p className="mb-6 text-center">
          Paste in the MIME text of the Instacart receipt
      </p>
      <textarea
          className="w-11/12 h-[32rem] p-4 border rounded-md"
          placeholder="Paste your text here..."
          value={mimeText}
          onChange={handleTextChange}
      />
      {
        isParsing 
          ? <p>Parsing...</p> 
          : <button
              className="px-6 py-2 border rounded-md bg-blue-500 text-white hover:bg-blue-600 m-2.5"
              onClick={handleSubmit}
              disabled={isParsing}
            > 
                  Submit
            </button>
      }
      </div>
    </main>
  )
}