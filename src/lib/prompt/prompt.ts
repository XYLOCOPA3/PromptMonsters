import { LANGUAGES } from "@/const/language";
import { IPromptMonstersExtension } from "@/typechain/PromptMonsters";

/**
 * Get generating monster prompt
 * @param feature monster feature
 * @param language language
 * @return {Promise<string>} Generate monster prompt
 */
export const getGeneratingPrompt = (
  feature: string,
  language: string,
): string => {
  switch (language) {
    case LANGUAGES[0]:
      return `Generate one fictional monster:
- Absolutely no copyright infringement
- The 'name' must be unique
- Avoid using proper nouns in the 'flavor' description
- Do not reuse words in the 'feature' category
- Status limits: HP<=40,ATK<=20,DEF<=20,INT<=20,MGR<=20,AGL<=20
- The sum of all stats must be <= 100.

"""
Output example:
feature="warlord, merciless, monkey"
Output in JSON->{"name":"Oda noboon","flavor":"A warlord aiming for world domination with wisdom and courage. A character with ambition who carves out a chaotic era with ambition and passion. In fact, he is an alien from the future.","status":{"HP":22,"ATK":8,"DEF":12,"INT":14,"MGR":12,"AGL":6},"skills":["World Conquest","Demon Path","Mind Control"}
"""

feature="${feature}"
Output in JSON->`;
    case LANGUAGES[1]:
      return `架空のモンスターを1体生成。
- 著作権は絶対に侵害しない
- モンスター名はユニークな名前にする
- "flavor"には固有名詞を使用しない
- "feature"の単語を再利用しない
- ステータス上限: HP<=40,ATK<=20,DEF<=20,INT<=20,MGR<=20,AGL<=20
- ステータス合計<=100

"""
出力例:
feature="武将, 無慈悲, 猿"
JSON出力->{"name":"織田ノブーン","flavor":"知略と勇気をもって天下を目指す武将。野望と情熱で混沌とした時代を切り開く、野心のある性格。実は未来からきた宇宙人である。","status":{"HP":22,"ATK":8,"DEF":12,"INT":14,"MGR":12,"AGL":6},"skills":["天下布武","鬼道","マインドコントロール"]}
"""

feature="${feature}"
JSON出力->`;
    default:
      throw new Error("Unknown Language");
  }
};

/**
 * Get fight prompt
 * @param monsterId monster id
 * @param monster monster struct
 * @param enemyId enemy monster id
 * @param enemy enemy struct
 * @param language output language
 * @return {Promise<string>} fight prompt
 */
export const getFightPrompt = (
  monster: IPromptMonstersExtension.MonsterExtensionStructOutput,
  enemy: IPromptMonstersExtension.MonsterExtensionStructOutput,
  language: string = "English",
): string => {
  switch (language) {
    case LANGUAGES[0]:
      return `Output the results of the battle between monsters.

"""
monsterDetails:
  ${monster.name}:
    id:${monster.resurrectionPrompt}
    flavor:${monster.flavor}
    status:
      HP:${monster.hp}
      ATK:${monster.atk}
      DEF:${monster.def}
      INT:${monster.inte}
      MGR:${monster.mgr}
      AGL:${monster.agl}
    skills:[${monster.skills}]
  ${enemy.name}:
    id:${enemy.resurrectionPrompt}
    flavor:${enemy.flavor}
    status:
      HP:${enemy.hp}
      ATK:${enemy.atk}
      DEF:${enemy.def}
      INT:${enemy.inte}
      MGR:${enemy.mgr}
      AGL:${enemy.agl}
    skills:[${enemy.skills}]

Output example:
${monster.name} vs ${enemy.name}
Output in JSON->{"battleDescription":"[Write a novel-like depiction of a battle scene in less than 300 characters, based on the 'flavor', 'status', and 'skills' of 'monsterDetails'. Be sure to determine a winner. Include a quote from the monster.],"winnerId":"0x0000000000000000000000000000000000000000"}
"""

${monster.name} vs ${enemy.name}:
Output in JSON->`;
    case LANGUAGES[1]:
      return `モンスター同士の戦闘結果を出力。

monsterDetails:
  ${monster.name}:
    id:${monster.resurrectionPrompt}
    flavor:${monster.flavor}
    status:
      HP:${monster.hp}
      ATK:${monster.atk}
      DEF:${monster.def}
      INT:${monster.inte}
      MGR:${monster.mgr}
      AGL:${monster.agl}
    skills:[${monster.skills}]
  ${enemy.name}:
    id:${enemy.resurrectionPrompt}
    flavor:${enemy.flavor}
    status:
      HP:${enemy.hp}
      ATK:${enemy.atk}
      DEF:${enemy.def}
      INT:${enemy.inte}
      MGR:${enemy.mgr}
      AGL:${enemy.agl}
    skills:[${enemy.skills}]

"""
出力例:
${monster.name} vs ${enemy.name}
JSON出力->{"battleDescription":"['monsterDetails' の 'flavor', 'status', 'skills'から300文字以下で戦闘の様子を小説風に書く。必ず勝者を決める。必ずモンスターのセリフを入れる。絶対にですます調を使わない。],"winnerId":"0x0000000000000000000000000000000000000000"}
"""

${monster.name} vs ${enemy.name}:
JSON出力->`;
    default:
      throw new Error("Invalid language");
  }
};

// HP->❤️,ATK->💥,DEF->🛡️,INT->🧠,MGR->🛡️✨,AGL->💨

/**
 * Get skill description prompt
 * @param skills skills
 * @return {string} skill description prompt
 */
export const getSkillDescPrompt = (skills: string[]): string => {
  if (skills.length === 0) return "";
  let skillPrompt = "";
  switch (skills.length) {
    case 1:
      skillPrompt = `["${skills[0]}"]`;
      break;
    case 2:
      skillPrompt = `["${skills[0]}","${skills[1]}"]`;
      break;
    case 3:
      skillPrompt = `["${skills[0]}","${skills[1]}","${skills[2]}"]`;
      break;
    default:
      skillPrompt = `["${skills[0]}","${skills[1]}","${skills[2]}","${skills[3]}"]`;
      break;
  }
  return `Please tell me the type of skill based on the skill name.

- Please choose the skill type from the following options.
- Please avoid using "Other" whenever possible.

Skill types:
["Physical Attack","Special Attack","Healing","Other"]

Example
"""
Skills: ["Punch","Fire","Soul Renewal","Joke"]
->["Physical Attack","Special Attack","Healing","Other"]
"""

Skills: ${skillPrompt}
->`;
};
