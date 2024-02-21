import parseMimeText from "@/app/utils/openai";

export async function POST(request: Request) {
  if (request.body) {
    const requestBody = await request.json();
    const mimeText = requestBody["text"] as string;

    // Call OpenAI
    const parsedReceipt = await parseMimeText(mimeText);

    return Response.json({ parsedReceipt });
  } else {
    return new Response("No data provided", { status: 400 });
  }
}
