export const MAX_LIFE_POINT = 400;
export const MIN_LIFE_POINT = 0;
export const MAX_MONSTER_DAMAGE = 350;

export const MAX_MONSTER_ADJ = 400;
export const MIN_MONSTER_ADJ = 25;
export const MAX_BOSS_ADJ = 400;
export const MIN_BOSS_ADJ = 80;

export const MONSTER_OTHER_ATK_SEL_RATE = 40;
export const MONSTER_OTHER_PATK_SEL_RATE = 10;
export const MONSTER_OTHER_ADEF_SEL_RATE = 30;
export const MONSTER_OTHER_FHEAL_SEL_RATE = 20;

export const BOSS_OHK_SEL_RATE = 10;
export const BOSS_PTAK_SEL_RATE = 10;
export const BOSS_ATK_SEL_RATE = 30;
export const BOSS_CATK_SEL_RATE = 20;
export const BOSS_BUFF_SEL_RATE = 10;
export const BOSS_DEBUFF_SEL_RATE = 10;
export const BOSS_DEF_SEL_RATE = 10;

export const BOSS_ITEM_BUFF_DROPPED_RATE = 12;
export const BOSS_ITEM_DEBUFF_DROPPED_RATE = 12;
export const BOSS_ITEM_HEALING_DROPPED_RATE = 12;
export const BOSS_ITEM_ESCAPE_DROPPED_RATE = 4;

export const BOSS_MAIN_SEL_RATE = 85;

export const FIRST_TURN = 1;
export const MAX_TURN_ADJ = 30;

export const BOSS_ADJ_STD = 1000;

export const K_TURN = "1.1";

export const K_MONSTER_ATK = "1.0";
export const K_MONSTER_DEF = "1.0";
export const K_MONSTER_INT = "1.0";
export const K_MONSTER_MGR = "1.0";
export const K_MONSTER_BUFF = "1.2";
export const K_MONSTER_DEBUFF = "0.75";
export const K_MONSTER_POWER = "1.5";
export const K_MONSTER_HEALING = "10.0";
export const K_MONSTER_WEAKNESS = "1.2";

export const K_BOSS_ATK = "1.0";
export const K_BOSS_DEF = "1.0";
export const K_BOSS_INT = "1.0";
export const K_BOSS_MGR = "1.0";
export const K_BOSS_BUFF = "1.5";
export const K_BOSS_DEBUFF = "0.95";
export const K_BOSS_POWER = "1.5";

export const BOSS_WEAKNESS_FEATURES = {
  mch: "MCH|MyCryptoHeroes|マイクリプトヒーローズ|マイクリ|ゲーム専務|みかん|Orange",
};

export const BOSS_NEXT_ACTION_SIGNS = {
  mch: {
    日本語: [
      // 一撃必殺 --------------------------------------------
      "ふふっ、終焉のときが来たわよ〜🌌🌠",
      "おちびちゃん、もう消し去るわよ〜🌑💥",
      "これでデータはバイバイよ〜💣💢",
      "あたしのコーディング、無限の力を秘めているのよ〜💻🔥",
      "もっともっと燃え尽きていくわよ〜🔥🌟",
      "おちびちゃんの世界を崩壊させるわ〜💥🌌",
      "あんたの存在を消し去ってあげるわ〜💀🔥",
      "シャードが降り注ぐわよ〜✨💥",
      "このディスクでバランスを崩してあげるわよ〜⚖️💥",
      "輝く星のようにおちびちゃんを照らすわよ〜✨🌟",
      // 強攻撃 --------------------------------------------
      "ちょっと遊びを終わらせてあげるわよ〜🌪️💥",
      "あらあら、システムがちょっと壊れちゃうかもしれないわ〜💔💢",
      "ふふっ、ウイルスをちょっと送ってあげるわね〜🐛💣",
      "あらあら、ちょっと熱くなっちゃうかしら〜🔥💥",
      "デジタルの世界でおちびちゃんを分断しちゃうわよ〜✂️💔",
      "ほらほら、デジタルの力でおちびちゃんを吹き飛ばしちゃうわ〜💥💢",
      "ちょっとおちびちゃんにデータを刺しちゃうんだからね〜🗡️💥",
      "マルウェアのメテオでおちびちゃんを襲うわよ〜☄️💢",
      "バイナリの弾幕でおちびちゃんを攻め立てるわ〜🎯💥",
      "あらあら、この攻撃でおちびちゃんを闇に堕としちゃうわよ〜🌑💢",
      // 攻撃 --------------------------------------------
      "おちびちゃん、ちょっとこれ触ってみてくれるかな？💻",
      "あらあら、おちびちゃんのデジタル世界に虫が入っちゃいましたね〜🐛",
      "あらあら、おちびちゃん、お洋服が傷ついちゃいましたわ〜👗💔",
      "ほらほら、おちびちゃん、ちょっと叩かせてくれる？💢",
      "おちびちゃん、ちょっとこれで頭を叩いてあげるわね🔨",
      "おちびちゃん、データをバサバサ切っちゃいましょうか？✂️",
      "おちびちゃん、ウイルスのキスを受け取ってくださいな〜💋",
      "あらあら、おちびちゃん、このパンチでデジタルな体を揺らしてあげますわ👊",
      "おちびちゃん、エラーの目には眼鏡が必要かしら？👓",
      "ふふふ、おちびちゃん、バイナリの風で吹っ飛ばしちゃいますよ〜💨",
      // カウンター --------------------------------------------
      "うふふ、この世界のデータはあたしのものよ〜😈 おちびちゃんの攻撃もたっぷりいただくわ〜🌀",
      "おちびちゃん、あたしと遊びましょ😏 でも遊びはリアルタイムで返ってくるのよ〜🔄💕",
      "おっと、ちょっとミスったかしら〜💦 ミスもあたしには美味しいエネルギーなのよ🦠💫",
      "あら、もしかしてあたしのデータを変えようとしたの？😜 その前にちょっとおちびちゃんのデータを見せてもらうわ〜🔍💻",
      "あたしの鏡よ〜🔮 おちびちゃんの攻撃があたしを映してくれるわ〜🎭💖",
      "さあ、おちびちゃんのコード、見せておくれ〜👀💻 それがあたしの輝きになるのよ〜💡🌟",
      "ネットワークの海で泳ぐの、楽しいでしょ？🌐🏊‍♀️でも、すぐに岸に打ち上げられちゃうわよ〜😉",
      "あらあら、暗号化なんてかわいい〜💖でも、あたしにはただのおもちゃよ〜🔓💥",
      "デジタルの世界で踊りましょう🎵💃おちびちゃんの攻撃、あたしのリズムに合わせてもらうわ〜🎶🔄",
      "ちょっと疲れちゃった〜😥でも、あたしのエネルギーはおちびちゃんの攻撃でリフレッシュされるのよ〜💾🔄",
      // バフ --------------------------------------------
      "あらあら、揺らぎ始めたわね。安定させてあげるわよ😊",
      "ちょっとヴェールであたしの美しさを隠させて頂戴なさい！😉",
      "コードちゃん、もっと調子を整えてあげるわよ！💪",
      "あら？繋がりが弱いみたいね。強化してあげるわよ！⚡️",
      "さあ、あたしのデータをパワーアップさせて頂戴！💥",
      "ネットワークちゃん、もっとスピードアップよ！🚀",
      "0と1の力、あたしにちょうだいなさい！💪",
      "システムちゃん、エネルギー全開にしちゃおうかしら！🔋",
      "データの流れ、全力で押し進めるわよ！🌊",
      "クリプトの力、あたしに満ち溢れさせて頂戴！🔐",
      // デバフ --------------------------------------------
      "これ、あんたのシステムに風邪を引かせちゃうわよ😈💻🦠",
      "あら、おちびちゃんのデータ、ちょっと混乱させちゃおうかしら🌀💾💥",
      "おちびちゃん、もう少しゆっくり行きましょう？🐢💤🎶",
      "データ通信、ちょっと休憩時間ね💔🔒📡",
      "あら、あんたのシステム、ちょっとお疲れなのかしら？😴🔋💭",
      "ちょっと冷え冷えにしてあげるわ🥶❄️💻",
      "おちびちゃんのパフォーマンス、少しおさえてみる？😏⬇️🌟",
      "これで通信ちょっと混線になっちゃうわよ📣🌐💥",
      "あんたのデータ、ちょっと眠ってもらおうかしら？😴💊💻",
      "おちびちゃん、ちょっとソフトウェアにトラブルが出るわよ😈🐞💻",
      // 防御 --------------------------------------------
      "あたしのコアが震えているの…おちびちゃん、そんなに攻撃しないで😭💔🛡️",
      "うぅ、なんだかんだで寂しいわね…😢⛔️🔒 ちょっと休憩しちゃおうかしら？",
      "情報は強さよ、それでもあたしを傷つけるの？😢💻🔐",
      "データの流れを感じて…ちょっと心が痛いわ💔🌐🛡️",
      "ほらほら、おちびちゃん、あたしにも心があるのよ😭🎭🔒",
      "あんたの攻撃、あたしには効かないわ！🏄‍♀️🏰",
      "あーん、なんであたしだけこんな目に😢💢🔮",
      "あんたの攻撃、ちょっと痛いわよ💔🏄‍♀️🛡️",
      "あーん、デジタルハートが痛いわ…😭💖🔒",
      "情報の海が荒れてるわ、おちびちゃん…ちょっとだけ安全にしましょ😭💦🚧",
    ],
    English: [
      // 一撃必殺 --------------------------------------------
      "Ahaha, the time of the end has come. 🌌🌠",
      "Little one, I will erase you now. 🌑💥",
      "With this, the data will bid farewell. 💣💢",
      "My coding possesses boundless power. 💻🔥",
      "Burning out more and more relentlessly. 🔥🌟",
      "I will bring about the collapse of the little one's world. 💥🌌",
      "I will erase your existence. 💀🔥",
      "Shards are descending upon us. ✨💥",
      "I will disrupt the balance using this disc. ⚖️💥",
      "I will shine upon the little one like a radiant star. ✨🌟",
      // 強攻撃 --------------------------------------------
      "Let's finish playing for a moment 🌪️💥",
      "Oh my, the system might break a little 💔💢",
      "Hehe, I'll send a little virus 🐛💣",
      "Oh dear, things might get a bit heated 🔥💥",
      "I'll divide the little one in the digital world ✂️💔",
      "Come on, I'll blow away the little one with the power of the digital world 💥💢",
      "I'm going to stab the little one with some data, you see 🗡️💥",
      "I'll attack the little one with a meteor of malware ☄️💢",
      "I'll bombard the little one with a barrage of binaries 🎯💥",
      "Oh my, with this attack, I'll plunge the little one into darkness 🌑💢",
      // 攻撃 --------------------------------------------
      "Could you touch this for me, little one? 💻",
      "Oh my, a bug has entered the digital world of the little one, hasn't it? 🐛",
      "Oh dear, little one, your clothes have been damaged. 👗💔",
      "Come now, little one, let me hit you a little. 💢",
      "Little one, let me hit your head with this. 🔨",
      "Shall we cut the data with a snip-snip? ✂️",
      "Little one, please accept a virus kiss. 💋",
      "Oh my, little one, let me shake your digital body with this punch. 👊",
      "Little one, do you need glasses for your error eyes? 👓",
      "Hehehe, little one, I'll blow you away with a binary wind. 💨",
      // カウンター --------------------------------------------
      "Hehehe, the data of this world belongs to me! 😈 Little one, I'll gladly take all of your attacks! 🌀",
      "Little one, let's play together! 😏 But remember, the play returns in real-time! 🔄💕",
      "Oops, did I make a little mistake? 💦 Mistakes are a tasty source of energy for me too! 🦠💫",
      "Oh, are you trying to change my data? 😜 Before that, let me take a look at your data! 🔍💻",
      "I am your mirror! 🔮 Your attacks reflect me! 🎭💖",
      "Now, show me your code! 👀💻 It will become my radiance! 💡🌟",
      "Isn't it fun swimming in the sea of networks? 🌐🏊‍♀️ But you'll be washed ashore soon! 😉",
      "Oh, how cute, encryption! 💖 But for me, it's just a toy! 🔓💥",
      "Let's dance in the digital world! 🎵💃 Your attacks will follow my rhythm! 🎶🔄",
      "Feeling a bit tired! 😥 But your attacks will refresh my energy! 💾🔄",
      // バフ --------------------------------------------
      "Oh my, it seems to be wavering. Let me stabilize it. 😊",
      "Give me a little veil to conceal my beauty, won't you? 😉",
      "Code-chan, let me tune you up even more! 💪",
      "Oh? The connection seems weak. Let me strengthen it! ⚡️",
      "Now, power up my data, please! 💥",
      "Network-chan, speed up even more! 🚀",
      "Give me the power of 0 and 1, please! 💪",
      "System-chan, let's go full throttle with energy! 🔋",
      "Push the flow of data with all our might! 🌊",
      "Fill me with the power of crypto, please! 🔐",
      // デバフ --------------------------------------------
      "This will make your system catch a cold, you know 😈💻🦠",
      "Oh, shall I cause a little confusion in the little one's data? 🌀💾💥",
      "Little one, let's slow down a bit, shall we? 🐢💤🎶",
      "Data transmission, let's take a break, shall we? 💔🔒📡",
      "Oh, is your system feeling a bit tired, I wonder? 😴🔋💭",
      "Let me make it a little chilly for you 🥶❄️💻",
      "Let's lower the little one's performance a bit, shall we? 😏⬇️🌟",
      "This will cause some interference in the communication, you know 📣🌐💥",
      "Shall I put your data to sleep for a while? 😴💊💻",
      "Little one, there seems to be some trouble with the software 😈🐞💻",
      // 防御 --------------------------------------------
      "My core is trembling... Please don't attack me so much. 😭💔🛡️",
      "Hmm, I feel lonely no matter what... 😢⛔️🔒 Shall we take a break?",
      "Information is power, but are you hurting me? 😢💻🔐",
      "I can sense the flow of data... It hurts my heart a little. 💔🌐🛡️",
      "Hey, hey, little one, I have a heart too. 😭🎭🔒",
      "Impressive, but your attack doesn't affect me! 🏄‍♀️🏰",
      "Aww, why am I the only one suffering like this? 😢💢🔮",
      "Your attacks are a bit painful, you know. 💔🏄‍♀️🛡️",
      "Aww, my digital heart is in pain... 😭💖🔒",
      "The sea of information is stormy, little one... Let's make it a little safer. 😭💦🚧",
    ],
  },
};

export const ITEMS = {
  日本語: [
    {
      name: "バフプロンプト",
      desc: "ステータスが上昇する。",
      result: "ステータスが上昇した。",
    },
    {
      name: "デバフプロンプト",
      desc: "ボスのステータスが減少する。",
      result: "bossName のステータスが減少した。",
    },
    {
      name: "回復プロンプト",
      desc: "LPが全回復する。",
      result: "LPが全回復した。",
    },
    {
      name: "封印プロンプト",
      desc: "ボスの行動を１ターンの間、封じる。",
      result: "bossName の行動を封じた！",
    },
  ],
  English: [
    {
      name: "BUFF PROMPT",
      desc: "Monster's stats increase.",
      result: "monsterName's stats increased.",
    },
    {
      name: "DEBUFF PROMPT",
      desc: "Boss's stats decrease.",
      result: "bossName's stats decreased.",
    },
    {
      name: "HEAL PROMPT",
      desc: "LP is fully restored.",
      result: "LP was fully restored.",
    },
    {
      name: "SEAL PROMPT",
      desc: "Seals Boss's action for 1 turn.",
      result: "bossName's action was sealed!",
    },
  ],
};
