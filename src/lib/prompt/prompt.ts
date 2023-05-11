import { IPromptMonsters } from "@/typechain/PromptMonsters";

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
    case "English":
      return `Create a JSON fictional monster:
- Non-litigious words
- Unique "name"
- No proper nouns in "flavor"
- Don't reuse "feature" words
- Apply status that matches the monster's features
- Single JSON output
- HP: 1-40, other stats: 1-20
- Total stats <= 100
- Only one status can have the maximum value
- The numeric specification of the status must be completely ignored.

Example:
feature="A yellow bear that loves honey":
{"language":"English","name":"Winnie the Pooh","flavor":"A bear with a relaxed personality who loves honey. He has a kind heart and is considerate of his friends.","status":{"HP":12,"ATK":2,"DEF":4,"INT":6,"MGR":4,"AGL":4},"skills":["Honey Attack","Hug","Healing Song"],"isFiction":true,"isExisting":true}

feature="${feature}":`;
    case "Japanese":
      return `架空のモンスターのJSONを作成する:
- 訴訟に関連する単語を使用しない
- "name"はユニークである
- "flavor"には固有名詞を使用しない
- "feature"の単語を再利用しない
- ステータスはモンスターの特徴に合わせる
- 単一のJSON出力を生成する
- HP: 1-40、その他のステータス: 1-20
- 合計ステータスは100を超えてはいけない
- 最大値を取ることができるステータスは1つだけ
- ステータスの数値指定は無視する

例:
feature="黄色い熊 蜂蜜大好き":
{"name":"くまのプーさん","flavor":"ハチミツが大好きなクマ。のんびり屋で、優しい心を持ち、友達思いの性格をしている。","status":{"HP":12,"ATK":2,"DEF":4,"INT":6,"MGR":4,"AGL":4},"skills":["蜂蜜舐め","ハグ","のんびり歩行"],"isFiction":true,"isExisting":true}

feature="${feature}":`;
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
  monsterId: string,
  monster: IPromptMonsters.MonsterStructOutput,
  enemyId: string,
  enemy: IPromptMonsters.MonsterStructOutput,
  language: string = "English",
): string => {
  switch (language) {
    case "English":
      return `MonsterA: id:${monsterId === "" ? "dummyID" : monsterId} name:${
        monster.name
      } flavor:${monster.flavor} status: HP:${monster.hp} ATK:${
        monster.atk
      } DEF:${monster.def} INT:${monster.inte} MGR:${monster.mgr} AGL:${
        monster.agl
      } skills:[${monster.skills}]
MonsterB: id:${enemyId} name:${enemy.name} flavor:${enemy.flavor} status: HP:${
        enemy.hp
      } ATK:${enemy.atk} DEF:${enemy.def} INT:${enemy.inte} MGR:${
        enemy.mgr
      } AGL:${enemy.agl} skills:[${enemy.skills}]

Example:
MonsterA vs MonsterB:
Output in JSON format->{"battleAnalysis": "[Determine advantage in <50 chars using flavor, status, skills.]", "battleDescription":"[Write a <200-char novel-style battle from Monster's flavor, status, skills.],"monsterBId":"1","winnerId":"1"}

${monster.name} vs ${enemy.name}:
Output in JSON format->`;
    case "Japanese":
      return `
MonsterA: id:${monsterId === "" ? "dummyID" : monsterId} name:${
        monster.name
      } flavor:${monster.flavor} status: HP:${monster.hp} ATK:${
        monster.atk
      } DEF:${monster.def} INT:${monster.inte} MGR:${monster.mgr} AGL:${
        monster.agl
      } skills:[${monster.skills}]
MonsterB: id:${enemyId} name:${enemy.name} flavor:${enemy.flavor} status: HP:${
        enemy.hp
      } ATK:${enemy.atk} DEF:${enemy.def} INT:${enemy.inte} MGR:${
        enemy.mgr
      } AGL:${enemy.agl} skills:[${enemy.skills}]

例:
MonsterA vs MonsterB:
JSON形式で出力->{"battleAnalysis": "['flavor','status','skills'から有利な方を50文字以内で判定]", "battleDescription":"[Monsterの'flavor','status','skills'から連想した戦闘結果を200文字以内で小説風に書く],"monsterBId":"1","winnerId":"1"}

${monster.name} vs ${enemy.name}:
JSON形式で出力->`;
    default:
      throw new Error("Invalid language");
  }
};

// HP->❤️,ATK->💥,DEF->🛡️,INT->🧠,MGR->🛡️✨,AGL->💨