'use client';

export default function Home() {
  const handleSubmit = () => {
    console.log("Submit button clicked");
  };

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
      />
      <button
        className="px-6 py-2 border rounded-md bg-blue-500 text-white hover:bg-blue-600 m-2.5"
        onClick={() => handleSubmit}
      >
        Submit
      </button>
    </div>
    </main>
  );
}
