import { FinalReceiptSplit, Receipt } from "@/app/utils/types";

const SPLITWISE_API_ROUTE_CREATE_EXPENSE = "https://secure.splitwise.com/api/v3.0/create_expense"

interface SplitwiseCreateExpenseBody {
  cost: number;
  description: string;
  date: string;
  repeat_interval: string;
  currency_code: string;
  group_id: number;
  [key: string]: number | string;
}

export async function POST(request: Request) {
  if (request.body) {
    const requestBody = await request.json();
    const receipt: Receipt = requestBody["receipt"];
    const finalSplits: FinalReceiptSplit = requestBody["finalSplits"];
    const groupId: number = requestBody["groupId"];

    // Package information into a Splitwise request
    let splitwiseBody: SplitwiseCreateExpenseBody = {
      "cost": receipt.totalPrice,
      "description": "Instacart",
      "date": new Date(Date.now()).toISOString(),
      "repeat_interval": "never",
      "currency_code": "CAD",
      "group_id": groupId,
    };

    finalSplits.members.forEach((member, index) => {
      splitwiseBody[`users_${index}_user_id`] = member.memberInfo.id;
      splitwiseBody[`users_${index}_owed_share`] = member.total;

      if (member.memberInfo.first_name == "Aaron") {
        splitwiseBody[`users_${index}_paid_share`] = receipt.totalPrice;
      }
    });

    // Submit body to Splitwise
    const createExpenseApiHeader = new Headers();
    createExpenseApiHeader.append("Authorization", `Bearer ${process.env.SPLITWISE_API_KEY}`);
    const createExpenseResponse = await fetch(SPLITWISE_API_ROUTE_CREATE_EXPENSE, {
      method: "POST",
      headers: createExpenseApiHeader,
      body: JSON.stringify(splitwiseBody)
    });
    const createExpenseResponseJson = await createExpenseResponse.json();
    
    if (!createExpenseResponseJson["expenses"]) {
      return new Response("Splitwise error occured", { status: 500 });
    }
    return Response.json(createExpenseResponseJson);
  } else {
    return new Response("No data provided", { status: 400 })
  }
}