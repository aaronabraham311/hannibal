# Hannibal
This is a tool I built for myself to split Instacart receipts automatically by just pasting in the email receipt. I built this out after getting really tired of doing the math to split receipts myself on Google Sheets.

## Getting Started

Add the following variables into `.env.local` in the root directory:

```
OPENAI_API_KEY=...
SPLITWISE_API_KEY=...
SPLITWISE_GROUP_NAME=...
```

You can create a Splitwise API key by registering a new application [here](https://secure.splitwise.com/apps)

Now, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Todos
[ ] Improve styling: Since I built it out for myself, I didn't care too deeply about how the software actually looks. This can definitely be improved
[ ] Generalize to handle any sort of receipt, not just Instacart
[ ] Generalize to handle splitting complex receipts for any Splitwise group
[ ] Improve OpenAI parsing: We are currently pasting in the entire HTML, which requires a lot more input tokens than necessary. Potentially stripping out the HTML part will help reduce cost.