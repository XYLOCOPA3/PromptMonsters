import { FeatureErrorType } from "@/types/FeatureErrorType";

/**
 * Check feature
 * @param feature feature
 * @return {FeatureErrorType} is valid feature
 */
export const checkFeature = (feature: string): FeatureErrorType => {
  if (feature.trim().length === 0) return FeatureErrorType.noFeature;
  if (isSymbol(feature)) return FeatureErrorType.usingSymbol;
  if (isNum(feature)) return FeatureErrorType.usingNum;
  if (isNGWord(feature)) return FeatureErrorType.usingNGWord;
  return FeatureErrorType.ok;
};

/**
 * Check str is symbol
 * @param str string
 * @return {boolean} is number or symbol
 */
export const isSymbol = (str: string): boolean => {
  const pattern =
    /[!@#$%^&*()_+={}|[\]\\;:<>/?！＃＄％＆（）ー＝＾〜＼｜＠｀「『；＋：＊」』＜＞？＿]/;
  return pattern.test(str);
};

/**
 * Check str is number
 * @param str string
 * @return {boolean} is number or symbol
 */
export const isNum = (str: string): boolean => {
  const pattern =
    /[0-9]|[０-９]|[⓪①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳]|[一二三四五六七八九十百千]/;
  return pattern.test(str);
};

/**
 * Check str is NG word
 * @param str string
 * @return {boolean} is NG word
 */
export const isNGWord = (str: string): boolean => {
  const ngWord =
    "HP|ATK|DEF|INT|MGR|AGL|hp|atk|def|int|mgr|agl|status|ステータス|全ステ|能力|stats|最大|ステMAX|ステマックス|アイヌ系|合いの子|青姦|アカ|明盲|足切り|足を洗う|当て馬|アメ公|あらめん|アル中|按摩|家柄|イカサマ|躄|伊勢乞食|イタ公|板前|いちゃもん|田舎|犬殺し|移民|イモ|インチキ|インディアン嘘つかない|淫売|裏日本|うんこ|運ちゃん|エスキモー|穢多|越後の米つき|エチゼンクラゲ|エディター|ＯＬ|オールドミス|オカマ|沖仲仕|唖|落人部落|落ちこぼれ|落とし前|溺れ死ぬ|お巡り|表日本|親方|おわい屋|女子供|女の腐ったような|隠坊|外人|蛙の子は蛙|ガキ|確信犯|拡張員|拡張団|拡張団長|家系|過去帳|ガサ|かさっかき|片足|片親|片手落ち|片肺|片目|片端|がちゃ目|担ぎ屋|かったい|がっぷり四つ|カッペ|上方の贅六|借り腹|皮被り|皮切り|川向こう|河原乞食|看護婦|姦通|キ印|キチ|気違い|気違い沙汰|気違いに刃物|ぎっちょ|給仕|灸を据える|狂気|狂気の沙汰|狂女|狂人|漁夫|苦力|屑屋|愚鈍|首切り|汲み取り屋|狂う|クロ|黒んぼ|くわえ込む|クンニ|群盲象をなでる|芸人|ゲーセン|下女|血統|毛唐|下男|健全なる精神は健全なる身体に宿る|ゲンナマ|強姦|後進国|興信所|業病|鉱夫|工夫|坑夫|紅毛人|黒人|虚仮|孤児院|乞食|小僧|小使い|子供|小人|ゴミ屋|コロシ|魚屋|ザギン|サツ|サラ金|サラブレッド|三韓征伐|三国人|三助|産婆|色盲|支那|支那人|支那蕎麦|支那竹|支那料理|士農工商|ジプシー|自閉症児|シマ|地回り|ジャップ|ジャリ|ジュー|獣医|周旋屋|酋長|嬢|障害者|将棋倒しになる|情夫|情婦|女給|植物人間|女傑|女工|助産婦|処女作|処女峰|女中|職工|しらっこ|尻拭い|心障児|心障者|新平民|ズージャー|スケ|すけこまし|スチュワーデス|滑り止め|ずらかる|スラム|正妻|精神異常|精神分裂病|精薄|傴僂|鮮人|潜水夫|千摺り|線路工夫|掃除婦|掃除夫|雑役夫|育ちより氏|第三国|代書屋|台湾政府|台湾ハゲ|タケノコ医者|蛸部屋|タタキ|ダッチマン|玉袋筋太郎|他力本願|垂れ流す|知恵遅れ|近目|血筋|チビ|痴呆症|チャリンコ|チャンコロ|中共|朝鮮征伐|朝鮮人参|チョン|跛|釣り書き|連れ子|聾|聾桟敷|低開発国|低脳|低脳児|デカ|出稼ぎ|丁稚|出戻り|天才と狂人は紙一重|手ん棒|土方|特殊学級|特殊学校|特殊部落|土建屋|土工|床屋|土左衛門|屠殺|屠殺場|屠殺人|どさ回り|土人|共稼ぎ|吃|ドヤ|ドヤ街|富山の三助|トルコ嬢|トルコ風呂|どん百姓|ナオン|南鮮|南部の鮭の鼻曲がり|ニガー|ニグロ|二号|ニコヨン|日本のチベット|人足|人非人|人夫|猫糞|農夫|脳膜炎|ノビ|ハーフ|パーマ屋|馬鹿チョンカメラ|馬鹿でもチョンでも|白痴|パクる|馬喰|端女|肌色|バタ屋|発狂する|馬丁|パン助|番太|半島人|飯場|引かれ者|跛|非人|ヒモ|百姓|日雇い|貧農|醜男|不可触民|不具|父兄|不治の病|ブス|ブタ箱|ブツ|踏切番|ブラインドタッチ|部落|浮浪児|浮浪者|ペイ患|ペイ中|坊主|北鮮|ポコペン|保線工夫|ポッポー屋|保母|ポリ公|本腰を入れる|ぽん引き|ほんぼし|まえつき|魔女っ子|股に掛ける|町医者|性行為|性行|せっくす|セックス|sex|Sex|SEX|まんこ|マンコ|満州|未開人|未開発国|三つ口|身分|未亡人|身元調査|婿をとる|娘を片付ける|名門校|妾|盲|盲縞|盲判を押す|盲蛇に怖じず|盲滅法|めっかち|盲愛する|蒙古症|盲人|盲目|文盲|ヤー様|八百屋|役不足|やさぐれ|ヤバい|藪医者|藪睨み|ヤンキー|郵便夫|郵便屋|養護|養老院|寄せ場|ヨツ|四つ足|四つ辻|嫁にやる|寄目|癩病|ルンペン|令嬢|レントゲン技師|老婆|労務者|露助|ロンパリ";
  const pattern = new RegExp(ngWord);
  return pattern.test(str);
};
