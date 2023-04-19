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

  const monster = req.body.monster;
  const enemy = req.body.enemy;
  const language = req.body.language;
  console.log(monster);
  console.log(enemy);
  console.log(language);

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: fightPrompt(
            monster.name,
            JSON.stringify(monster),
            enemy.name,
            JSON.stringify(enemy),
            language,
          ),
        },
      ],
      temperature: 0.2,
    });
    console.log(completion.data.choices);
    console.log(completion.data.usage);
    res.status(200).json({ result: completion.data.choices });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
}

const fightPrompt = (
  monsterAName: string,
  monsterADesc: string,
  monsterBName: string,
  monsterBDesc: string,
  language: string = "English",
): string => {
  return `Monster: ${monsterAName}
Description: ${monsterADesc}

Monster: ${monsterBName}
Description: ${monsterBDesc}

Battle begins
- Write in a novel-style within 200 characters (${language})
- Be sure to use "skills"
- Declare the winner and loser at the end`;
};
