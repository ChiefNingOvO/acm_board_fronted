import React from "react";
import { motion } from "framer-motion";
import { ProblemId, FirstBlood, PROBLEMS } from "./useEngine";
import { Target } from "lucide-react";

interface Props {
  firstBloods: Record<ProblemId, FirstBlood>;
}

// 预定义 12 道题的颜色（参考 Material Design 的鲜艳色板：明度与饱和度适中，适合深色模式）
const PROBLEM_COLORS: Record<ProblemId, string> = {
  A: "#f44336", // Red 500
  B: "#9e9e9e", // Grey 500 (等待中/未解决)
  C: "#ffeb3b", // Yellow 500
  D: "#9e9e9e",
  E: "#9e9e9e",
  F: "#00bcd4", // Cyan 500
  G: "#2196f3", // Blue 500
  H: "#9e9e9e",
  I: "#9c27b0", // Purple 500
  J: "#673ab7", // Deep Purple 500
  K: "#e91e63", // Pink 500
};

export const FirstBloodPanel: React.FC<Props> = ({ firstBloods }) => {
  // 直接使用预定义的题目顺序，避免重复渲染
  const problems = PROBLEMS.map(problem => firstBloods[problem]);

  return (
    <div className="w-[350px] h-full bg-transparent flex flex-col relative z-10 shrink-0 border-r border-white/5">
      <div className="p-4 flex items-center gap-3 shrink-0">
        <Target className="text-firstblood drop-shadow-[0_0_8px_rgba(255,215,0,0.6)] w-5 h-5" />
        <h2 className="text-lg font-bold uppercase tracking-widest text-white">
          FIRST BLOODS
        </h2>
      </div>
      <div className="flex-1 overflow-hidden px-4 pb-4 flex flex-col justify-between h-full">
        {problems.map((fb, index) => (
          <FirstBloodItem key={`${fb.problem}-${index}`} fb={fb} />
        ))}
      </div>
    </div>
  );
};

const FirstBloodItem: React.FC<{ fb: FirstBlood }> = ({ fb }) => {
  const isSolved = !!fb.team;
  // 未解决时统一使用暗灰色
  const themeColor = isSolved ? PROBLEM_COLORS[fb.problem] || "#9e9e9e" : "#333333";

  return (
    <motion.div
      layout
      className="relative flex items-center justify-between rounded-lg border px-3 py-2 transition-colors duration-500 h-[calc(100%/11-0.5rem)] min-h-[40px]"
      style={{
        backgroundColor: isSolved ? `${themeColor}1a` : "transparent", // 1a is ~10% opacity
        borderColor: isSolved ? `${themeColor}80` : "#333333",
      }}
    >
      <div className="flex items-center gap-4">
        <div
          className="w-8 h-8 rounded-md flex items-center justify-center font-bold text-lg font-mono"
          style={{
            backgroundColor: isSolved ? themeColor : "#222222",
            color: isSolved ? "#000" : "#666666",
          }}
        >
          {fb.problem}
        </div>
        <span 
          className="font-bold text-base"
          style={{ color: isSolved ? themeColor : "#666666" }}
        >
          {isSolved ? fb.team : "等待中..."}
        </span>
      </div>

      {isSolved && fb.judge_time && (
        <span 
          className="text-sm font-mono"
          style={{ color: themeColor }}
        >
          {fb.judge_time}
        </span>
      )}
    </motion.div>
  );
};
