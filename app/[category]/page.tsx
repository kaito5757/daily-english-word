"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getWordList } from "@/lib/wordList";
import { motion } from "framer-motion";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const ITEMS_PER_PAGE = 10;

export default function Page({ params }: { params: { category: string } }) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);

  const wordList = getWordList(params.category);

  const totalPages = Math.ceil(wordList.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentWordList = wordList.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-100 via-blue-100 to-pink-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl">
        <CardHeader className="pb-0 relative">
          <motion.button
            onClick={() => router.push("/")}
            className="absolute left-6 top-9 text-blue-600 hover:text-blue-800 transition-colors duration-200"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <div className="flex">
              <ArrowLeft size={24} className="mr-2" />
              戻る
            </div>
          </motion.button>
          <CardTitle className="text-4xl font-bold text-center pb-5">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-blue-500">
              ステージ
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {currentWordList.map((info) => (
              <motion.div
                key={info.index}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.button
                  onClick={() =>
                    router.push(`/${params.category}/${info.index + 1}`)
                  }
                  className={`w-full h-24 text-lg font-semibold rounded-xl transition-all duration-300 ease-in-out shadow-md border ${"bg-gradient-to-r from-teal-50 to-blue-50 text-gray-700 border-gray-200 cursor-pointer"}`}
                  whileHover={{
                    background: "linear-gradient(to right, #4fd1c5, #63b3ed)",
                    color: "white",
                    border: "1px solid transparent",
                  }}
                  transition={{
                    type: "tween",
                    duration: 0.3,
                  }}
                >
                  <div className="flex flex-col items-center justify-center h-full">
                    <span>{`ステージ${info.index + 1}`}</span>
                  </div>
                </motion.button>
              </motion.div>
            ))}
          </div>
          <div className="flex justify-center items-center space-x-4">
            <Button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              <ChevronLeft size={20} />
            </Button>
            <span className="text-blue-600 font-semibold">
              {currentPage} / {totalPages}
            </span>
            <Button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              <ChevronRight size={20} />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
