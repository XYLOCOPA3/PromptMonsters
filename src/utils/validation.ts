import { MAX_FEATURES_CHAR } from "@/const/monster";
import { FeatureErrorType } from "@/types/FeatureErrorType";
import { countCharactersForGenerator } from "@/utils/charUtils";

/**
 * Check feature
 * @param feature feature
 * @return {FeatureErrorType} is valid feature
 */
export const checkFeature = (feature: string): FeatureErrorType => {
  if (feature.trim().length === 0) return FeatureErrorType.noFeature;
  if (countCharactersForGenerator(feature) > MAX_FEATURES_CHAR)
    return FeatureErrorType.characterLimit;
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
    /[!@#$%^&*()_+={}|[\]\\;:<>/?！＃＄％＆（）＝＾＼｜＠｀「『；＋：＊」』＜＞？＿]/;
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
    "hp|hP|Hp|HP|atk|atK|aTk|aTK|Atk|AtK|ATk|ATK|DEF|DEf|dEf|INT|MGR|AGL|atk|mgr|status|ステータス|全ステ|能力|stats|最大|ステMAX|ステmax|ステマックス|アイヌ系|合いの子|青姦|アカ|明盲|アメ公|あらめん|アル中|按摩|躄|伊勢乞食|イタ公|淫売|うんこ|穢多|沖仲仕|唖|落人部落|おわい屋|女子供|女の腐ったような|外人|拡張員|拡張団|拡張団長|過去帳|かさっかき|担ぎ屋|かったい|がっぷり四つ|上方の贅六|借り腹|皮被り|皮切り|川向こう|河原乞食|姦通|キ印|キチ|気違い|気違い沙汰|気違いに刃物|ぎっちょ|苦力|屑屋|汲み取り屋|黒んぼ|クンニ|群盲象をなでる|下女|毛唐|下男|健全なる精神は健全なる身体に宿る|ゲンナマ|強姦|業病|紅毛人|虚仮|コロシ|三韓征伐|三国人|自閉症児|地回り|ジャップ|ジャリ|周旋屋|酋長|障害者|情夫|情婦|女給|植物人間|女中|しらっこ|心障児|心障者|新平民|ズージャー|スケ|すけこまし|精神異常|精神分裂病|精薄|傴僂|鮮人|千摺り|線路工夫|雑役夫|育ちより氏|代書屋|台湾ハゲ|タケノコ医者|蛸部屋|知恵遅れ|チャンコロ|中共|朝鮮征伐|朝鮮人参|チョン|跛|聾|聾桟敷|低開発国|低脳|低脳児|丁稚|手ん棒|屠殺|屠殺場|屠殺人|どさ回り|土人|富山の三助|どん百姓|ナオン|南鮮|南部の鮭の鼻曲がり|ニガー|ニグロ|ニコヨン|日本のチベット|人足|人非人|人夫|猫糞|脳膜炎|ノビ|馬鹿チョンカメラ|馬鹿でもチョンでも|白痴|馬喰|端女|バタ屋|馬丁|パン助|番太|半島人|飯場|引かれ者|跛|非人|貧農|醜男|不可触民|不具|不治の病|ブス|踏切番|浮浪児|浮浪者|ペイ患|ペイ中|北鮮|ポコペン|保線工夫|ポッポー屋|保母|ポリ公|本腰を入れる|ぽん引き|ほんぼし|まえつき|魔女っ子|性行為|性行|せっくす|セックス|sex|Sex|SEX|まんこ|マンコ|満州|未開人|未開発国|三つ口|婿をとる|娘を片付ける|妾|盲縞|盲判を押す|盲蛇に怖じず|盲滅法|めっかち|盲愛する|蒙古症|盲人|盲目|文盲|ヤー様|藪睨み|養護|養老院|寄せ場|ヨツ|四つ足|四つ辻|嫁にやる|寄目|癩病|ルンペン|労務者|露助|ロンパリ";
  const pattern = new RegExp(ngWord);
  return pattern.test(str);
};
