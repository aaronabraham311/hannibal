import { FinalReceiptSplit, Receipt } from "@/app/utils/types";
import axios from "axios";

const SPLITWISE_API_ROUTE_CREATE_EXPENSE =
  "https://secure.splitwise.com/api/v3.0/create_expense";

interface SplitwiseCreateExpenseBody {
  cost: string;
  description: string;
  details: string;
  date: string;
  repeat_interval: string;
  currency_code: string;
  category_id: number;
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
      cost: receipt.totalPrice.toString(),
      details: "from hannibal",
      description: "Instacart",
      date: new Date(Date.now()).toISOString(),
      repeat_interval: "never",
      currency_code: "CAD",
      category_id: 15,
      group_id: groupId,
    };

    finalSplits.members.forEach((member, index) => {
      if (member.total > 0) {
        splitwiseBody[`users__${index}__user_id`] = member.memberInfo.id;
        splitwiseBody[`users__${index}__owed_share`] = member.total.toString();

        if (
          member.memberInfo.first_name == process.env.FIRST_NAME &&
          member.memberInfo.last_name == process.env.LAST_NAME
        ) {
          splitwiseBody[`users__${index}__paid_share`] =
            receipt.totalPrice.toString();
        }
      }
    });

    // Using axios instead of fetch because splitwiseBody doesn't need to
    // be stringified
    const axiosResponse = await axios({
      method: "post",
      url: SPLITWISE_API_ROUTE_CREATE_EXPENSE,
      headers: {
        Authorization: `Bearer ${process.env.SPLITWISE_API_KEY}`,
      },
      data: splitwiseBody,
    });

    if (axiosResponse.status !== 200 || axiosResponse["data"]["errors"]) {
      console.log(axiosResponse)
      return new Response("Error with Splitwise", { status: 400 })
    } else {
      console.log("Posted to Splitwise")
    }

    return Response.json(axiosResponse.data);
  } else {
    return new Response("No data provided", { status: 400 });
  }
}
