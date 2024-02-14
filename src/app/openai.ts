import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY });
const PROMPT = `
The following is an Instacart food order receipt. 

Extract out items (name, quantity, price per unit, total price), item subtotal, tip, service fee, tax and final total price.

Output this in a JSON format
`

const parseMimeText = async (mimeText: string) => {
  const completion = await openai.chat.completions.create({
    messages: [{role: "system", content: PROMPT}],
    model: "gpt-4-1106-preview",
    response_format: {"type": "json_object"}
  });

  return completion.choices[0].message.content;
}

export default parseMimeText;