import { splitReceipt } from "@/app/utils/receiptSplitter";
import { Receipt, ProposedSplits, SplitwiseMember } from "@/app/utils/types";

export async function POST(request: Request) {
  if (request.body) {
    const requestBody = await request.json();
    const receipt: Receipt = requestBody["receipt"];
    const proposedSplits: ProposedSplits = requestBody["memberSplits"];
    const members: SplitwiseMember[] = requestBody["members"];

    const splitReceiptValue = splitReceipt(receipt, proposedSplits, members);

    return Response.json({ splitReceiptValue });
  } else {
    return new Response("No data provided", { status: 400 });
  }
}
