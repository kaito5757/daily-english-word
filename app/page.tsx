"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const sections = [
  { id: "junior-high", name: "中学英単語" },
  { id: "high", name: "高校英単語" },
  { id: "toeic", name: "TOEIC英単語" },
];

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-100 via-blue-100 to-pink-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-4xl font-bold text-center">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-blue-500">
              DAILY ENGLISH WORD
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {sections.map((section) => (
              <motion.div
                key={section.id}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.button
                  onClick={() => router.push(`/${section.id}`)}
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
                    <span>{section.name}</span>
                  </div>
                </motion.button>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
