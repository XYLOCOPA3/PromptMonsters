// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message:
          "OpenAI API key not configured, please follow instructions in README.md",
      },
    });
    return;
  }

  const feature = req.body.feature || "";
  const language = req.body.language || "English";
  if (feature.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid feature",
      },
    });
    return;
  }

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: generatePrompt(feature, language) }],
      temperature: 0.1,
    });
    console.log(completion.data.choices);
    console.log(completion.data.usage);
    res.status(200).json({ result: completion.data.choices });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
}

const generatePrompt = (feature: string, language: string): string => {
  return `Output a fictional monster in JSON format (100 characters or less, JSON only), with the following conditions:
- Use non-litigious words.
- "name" should be a unique name like a monster.
- Do not use proper nouns in the "flavor" description.
- Do not use words used in "feature".
- Only one JSON output.
- Translate JSON values (including "skills" value) to ${language} (JSON key is not translated. No pre-translated text required.).

Example:
feature="A yellow bear that loves honey"
{"name":"Winnie the Pooh","flavor":"A bear with a relaxed personality who loves honey. He has a kind heart and is considerate of his friends.","status":{"HP":10,"ATK":1,"DEF":3,"INT":2,"MGR":4,"AGL":1},"skills":["Honey Attack","Hug","Healing Song"],"isFiction":true,"isExisting":true}

feature="${feature}"`;
};
