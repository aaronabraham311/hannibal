import OpenAI from "openai";
import { Receipt } from "./types";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const PROMPT = `
The following is an Instacart food order receipt in MIME text. 

Extract out items (name, quantity, price per unit, total price), item subtotal, tip, service fee, tax and final total price.

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
    "totalPrice": {
      "type": "number"
    }
  },
  "required": ["items", "subtotal", "tip", "serviceFee", "tax", "totalPrice"],
  "additionalProperties": false
}
"""

Here is the Instacart receipt in MIME text. Convert it into the JSON schema above
`

const parseMimeText = async (mimeText: string) : Promise<Receipt> => {
  const completion = await openai.chat.completions.create({
    messages: [{role: "system", content: PROMPT + mimeText}],
    model: "gpt-4-1106-preview",
    response_format: {"type": "json_object"}
  });

  const content = completion.choices[0].message.content
  if (content == null) {
    throw new Error("Content is null")
  }

  return JSON.parse(content) as Receipt;
}

export default parseMimeText;