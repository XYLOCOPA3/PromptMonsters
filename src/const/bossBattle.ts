export const MAX_LIFE_POINT = 400;

export const BOSS_NEXT_ACTION_SIGNS = {
  mch: {
    日本語: [
      "宇宙に突如として隕石の雨が降り注ぎ、bossName の周囲を舞っている...",
    ],
    English: [
      "Suddenly, a shower of meteorites begins to fall in space, swirling around bossName ...",
    ],
  },
};

export const ITEMS = {
  日本語: [
    {
      name: "ポーション",
      desc: "LPが全回復する。",
      result: "LPが全回復した。",
    },
    {
      name: "エリクサー",
      desc: "ステータスが上昇する。",
      result: "ステータスが上昇した。",
    },
    {
      name: "まきもの",
      desc: "ボスのステータスが減少する。",
      result: "bossName のステータスが減少した。",
    },
    {
      name: "コンパス",
      desc: "戦闘から逃げ出すことができる。",
      result: "monsterName は戦闘から逃げ出した。",
    },
  ],
  English: [
    {
      name: "POTION",
      desc: "LP is fully restored.",
      result: "LP was fully restored.",
    },
    {
      name: "ELIXIR",
      desc: "Monster's stats increase.",
      result: "monsterName's stats increased.",
    },
    {
      name: "SCROLL",
      desc: "Boss's stats decrease.",
      result: "bossName's stats decreased.",
    },
    {
      name: "COMPASS",
      desc: "You can escape from the battle.",
      result: "monsterName escaped from the battle.",
    },
  ],
};
