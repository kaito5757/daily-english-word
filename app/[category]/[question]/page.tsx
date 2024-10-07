"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getWordList } from "@/lib/wordList";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function Page({
  params,
}: {
  params: { category: string; question: number };
}) {
  const wordList = getWordList(params.category);
  const currentWords = wordList.find(
    (words) => words.index === params.question - 1
  );

  const router = useRouter();

  const [currentPair, setCurrentPair] = useState({ question: "", answer: "" });
  const [userInput, setUserInput] = useState("");
  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [validQuestionCount, setValidQuestionCount] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [usedQuestions, setUsedQuestions] = useState<number[]>([]);
  const [failedWords, setFailedWords] = useState<
    Array<{ question: string; answer: string; userAnswer: string }>
  >([]);

  const totalQuestions = currentWords?.words?.length ?? 0;
  const remainingQuestions = totalQuestions - questionCount;
  const progressPercentage = (questionCount / totalQuestions) * 100;

  const setNewWord = useCallback(() => {
    const availableWords = currentWords?.words.filter(
      (pair) => !usedQuestions.includes(pair.no)
    );
    if (availableWords?.length === 0) {
      setIsPlaying(false);
      return;
    }

    if (!availableWords) return;

    const newPair =
      availableWords[Math.floor(Math.random() * availableWords.length)];
    setCurrentPair({ question: newPair.japanese, answer: newPair.english });
    setUsedQuestions([...usedQuestions, newPair.no]);
    setMistakes(0);
    setUserInput("");
    setQuestionCount((prev) => prev + 1);
  }, [currentWords?.words, usedQuestions]);

  useEffect(() => {
    if (isPlaying && currentPair.question === "") {
      setNewWord();
    }
  }, [isPlaying, currentPair, setNewWord]);

  const checkAnswer = useCallback(() => {
    const isCorrect =
      userInput.toLowerCase() === currentPair.answer.toLowerCase();
    if (isCorrect) {
      if (mistakes < 2) {
        setScore(score + 1);
        setValidQuestionCount(validQuestionCount + 1);
      }
      toast.success("正解！", { duration: 1000 });
      setNewWord();
    } else {
      setMistakes(mistakes + 1);
      if (mistakes < 1) {
        toast.error("不正解", { duration: 1000 });
      } else if (mistakes === 1) {
        toast.error(`不正解。答えが表示されます。`, {
          duration: 5000,
        });
        setValidQuestionCount(validQuestionCount + 1);
        setFailedWords([
          ...failedWords,
          {
            question: currentPair.question,
            answer: currentPair.answer,
            userAnswer: userInput,
          },
        ]);
      }
      setUserInput("");
    }
  }, [
    userInput,
    currentPair,
    mistakes,
    score,
    validQuestionCount,
    failedWords,
    setNewWord,
  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && userInput.length > 0) {
      checkAnswer();
    }
  };

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setQuestionCount(0);
    setValidQuestionCount(0);
    setUsedQuestions([]);
    setFailedWords([]);
    setNewWord();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-100 via-blue-100 to-pink-100 flex items-center justify-center">
      <Toaster />
      <Card className="w-96 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-teal-500 to-blue-500 rounded-t-lg">
          <CardTitle className="text-2xl font-bold text-center text-white">
            {`ステージ${params.question}`}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 bg-white bg-opacity-90 rounded-b-lg">
          {!isPlaying ? (
            <div className="text-center">
              {questionCount > 0 && (
                <>
                  <p className="text-2xl font-bold mb-4 text-teal-700">終了</p>
                  <p className="text-xl mb-6 text-blue-600">
                    あなたのスコア: {score}/{validQuestionCount}
                  </p>
                  {failedWords.length > 0 && (
                    <div className="mb-6 text-left">
                      <p className="font-bold mb-2">間違えた単語:</p>
                      {failedWords.map((word, index) => (
                        <div key={index} className="mb-2">
                          <p>
                            問題: {word.question}、解答: {word.answer}
                          </p>
                          <p className=" text-red-600">
                            あなたの回答: {word.userAnswer}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
              <Button
                onClick={startGame}
                className="w-full bg-gradient-to-r from-teal-500 to-blue-500 text-white font-bold py-3 px-6 rounded-full transition-all hover:from-teal-600 hover:to-blue-600 mb-4"
              >
                {questionCount > 0 ? "もう一度" : "開始"}
              </Button>
              <Button
                onClick={() => router.push(`/${params.category}`)}
                className="w-full bg-gray-300 text-gray-700 font-bold py-3 px-6 rounded-full transition-all hover:bg-gray-400"
              >
                ステージ一覧に戻る
              </Button>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                  <div
                    className="h-2.5 rounded-full bg-gradient-to-r from-teal-500 to-blue-500 transition-all duration-300 ease-in-out"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600">
                  残り問題数: {remainingQuestions}/{totalQuestions}
                </p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold mb-3 text-teal-700">
                  問題{questionCount}: {currentPair.question}
                </p>
                {mistakes >= 2 && (
                  <p className="text-md text-blue-600 mb-2">
                    答え: {currentPair.answer}
                  </p>
                )}
              </div>
              <div className="flex items-center space-x-2 mb-8">
                <Input
                  type="text"
                  inputMode="email"
                  value={userInput}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyPress}
                  placeholder={`英単語を入力 (${currentPair.answer.length}文字)`}
                  className="flex-grow py-2 px-4 rounded-l-full border-2 border-teal-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base"
                  autoFocus
                  aria-label="英単語の回答を入力"
                  style={{ fontSize: "16px" }}
                />
                <Button
                  onClick={checkAnswer}
                  className="bg-gradient-to-r from-teal-500 to-blue-500 text-white font-bold py-2 px-6 rounded-r-full transition-all hover:from-teal-600 hover:to-blue-600"
                >
                  回答
                </Button>
              </div>
              <Button
                onClick={() => router.push(`/${params.category}`)}
                className="w-full bg-gray-300 text-gray-700 font-bold py-2 px-6 rounded-full transition-all hover:bg-gray-400"
              >
                ステージ一覧に戻る
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
