import parseMimeText from "@/app/utils/openai";

export async function POST(request: Request) {
    if (request.body) {
      const requestBody = await request.json();
      const mimeText = requestBody["text"] as string;

      // Call OpenAI
      // const parsedReceipt = await parseMimeText(mimeText);
      const parsedReceipt = {
          "items": [
            {
              "name": "Coffee",
              "quantity": 2,
              "pricePerUnit": 3.50,
              "totalItemPrice": 7.00
            },
            {
              "name": "Blueberry Muffin",
              "quantity": 1,
              "pricePerUnit": 2.50,
              "totalItemPrice": 2.50
            }
          ],
          "subtotal": 9.50,
          "tip": 1.90,
          "serviceFee": 0.95,
          "tax": 0.76,
          "totalPrice": 13.11
      }
  
      return Response.json({ parsedReceipt });
    } else {
      return new Response("No data provided", { status: 400 });
    }
  }