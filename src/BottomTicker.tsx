import React from "react";
import { Rss } from "lucide-react";

interface Props {
  tickers: string[];
}

export const BottomTicker: React.FC<Props> = ({ tickers }) => {
  // Pad the array to ensure the ticker is long enough
  const displayTickers = [...tickers, ...tickers, ...tickers, ...tickers];

  return (
    <div className="h-16 bg-card border-t border-white/10 flex items-center shrink-0 relative z-10 overflow-hidden shadow-[0_-4px_24px_rgba(0,0,0,0.5)]">
      <div className="px-6 h-full flex items-center gap-3 bg-firstblood/10 border-r border-firstblood/30 shrink-0 z-20 shadow-[4px_0_10px_rgba(0,0,0,0.3)]">
        <Rss className="w-6 h-6 text-firstblood animate-pulse" />
        <span className="font-bold tracking-widest text-firstblood uppercase text-sm">
          赛事快报
        </span>
      </div>

      <div className="flex-1 overflow-hidden relative h-full flex items-center">
        <div className="animate-slow-ticker whitespace-nowrap flex items-center absolute left-0 min-w-max">
          {displayTickers.map((msg, i) => (
            <span key={i} className="inline-flex items-center">
              <span className="text-lg font-medium text-primaryText mx-12 tracking-wide">
                {msg}
              </span>
              <span className="w-2 h-2 rounded-full bg-white/20 mx-4"></span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
