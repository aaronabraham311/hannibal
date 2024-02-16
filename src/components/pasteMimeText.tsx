import { ChangeEvent, MouseEvent, useState } from "react"

import parseMimeText from "@/app/utils/openai";
import { Receipt } from "@/app/types";

interface PasteMimeTextProps {
  setReceipt: (receipt: Receipt) => void;
}

export default function PasteMimeText({ setReceipt } : PasteMimeTextProps) {
  const [mimeText, setMimeText] = useState("");

  const handleTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setMimeText(event.target.value);
  }

  const handleSubmit = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    // Parse mimeText using OpenAI call
    // TODO: convert to an API call
    const parsedReceipt = await parseMimeText(mimeText);

    // Set state
    setReceipt(parsedReceipt);
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
      <button
          className="px-6 py-2 border rounded-md bg-blue-500 text-white hover:bg-blue-600 m-2.5"
          onClick={handleSubmit}
      >
          Submit
      </button>
      </div>
    </main>
  )
}