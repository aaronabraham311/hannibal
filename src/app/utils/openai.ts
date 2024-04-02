import OpenAI from "openai";
import { Receipt } from "./types";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const PROMPT = `
The following is an Instacart food order receipt in MIME text. 

Extract out items (name, quantity, price per unit and total price). Some items maybe have had their prices/quantity 
adjusted -- these will be under the header "Replacements". Be sure to take these into account.

The subtotal should reflect the total of all items before taxes and fees.
The "tip" and "serviceFee" should be listed as specified. Under "tax," combine all tax-related charges into one sum including charges for HST and GST. 
Please aggregate any other additional fees not specified, such as checkout bag fees, into a "miscFees" total. Be sure to not include any tax amounts in miscFees.
Finally, provide the "totalPrice" as the sum of all costs including items, tip, service fee, taxes, and miscellaneous fees.

The extracted items should be in a JSON format. The JSON schema has been provided in the section below, denoted by """

"""
{
  "type": "object",
  "properties": {
    "items": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string"
          },
          "quantity": {
            "type": "number"
          },
          "pricePerUnit": {
            "type": "number"
          },
          "totalItemPrice": {
            "type": "number"
          }
        },
        "required": ["name", "quantity", "pricePerUnit", "totalItemPrice"],
        "additionalProperties": false
      },
      "minItems": 1
    },
    "subtotal": {
      "type": "number"
    },
    "tip": {
      "type": "number"
    },
    "serviceFee": {
      "type": "number"
    },
    "tax": {
      "type": "number"
    },
    "miscFees": {
      "type": "number"
    },
    "totalPrice": {
      "type": "number"
    }
  },
  "required": ["items", "subtotal", "tip", "serviceFee", "tax", "totalPrice"],
  "additionalProperties": false
}
"""

Here is the Instacart receipt in MIME text. Convert it into the JSON schema above
`;

const parseMimeText = async (mimeText: string): Promise<Receipt> => {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: PROMPT + mimeText }],
    model: "gpt-4-1106-preview",
    response_format: { type: "json_object" },
  });

  const content = completion.choices[0].message.content;
  if (content == null) {
    throw new Error("Content is null");
  }

  return JSON.parse(content) as Receipt;
};

export default parseMimeText;
