import React from "react";

// 可配置的致谢名单
const ACKNOWLEDGEMENTS = [
  "感谢 校团委 支持",
  "感谢 信息工程学院 支持",
  // 可以在这里添加更多...
];

export const Footer: React.FC = () => {
  return (
    <footer className="h-10 bg-card/80 backdrop-blur-md border-t border-white/10 flex items-center justify-between px-8 shrink-0 relative z-10 text-xs text-secondaryText/80 tracking-widest font-mono">
      <div>
        <span className="text-white/60">Powered By </span>
        <span className="font-bold text-primaryText">ChiefNing</span>
      </div>
      <div className="flex gap-6">
        {ACKNOWLEDGEMENTS.map((text, index) => (
          <span key={index}>{text}</span>
        ))}
      </div>
    </footer>
  );
};
