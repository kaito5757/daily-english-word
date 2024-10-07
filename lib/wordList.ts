import { highWordList } from "@/constants/high";
import { juniorHighWordList } from "@/constants/junior-high";
import { toeicWordList } from "@/constants/toeic";

export const getWordList = (category: string) => {
  const wordList = (() => {
    switch (category) {
      case "junior-high":
        return juniorHighWordList;
      case "high":
        return highWordList;
      case "toeic":
        return toeicWordList;
    }
  })();

  if (!wordList) {
    throw new Error("指定されたカテゴリに対する単語リストが見つかりません。");
  }

  return wordList.reduce((acc, current, index) => {
    if (index % 15 === 0) {
      acc.push({ index: acc.length, words: [current] });
    } else {
      acc[acc.length - 1].words.push(current);
    }
    return acc;
  }, [] as { index: number; words: typeof wordList }[]);
};
