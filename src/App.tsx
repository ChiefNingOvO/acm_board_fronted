import React from 'react';
import { useEngine } from './useEngine';
import { Header } from './Header';
import { FirstBloodPanel } from './FirstBloodPanel';
import { EventStream } from './EventStream';
import { BottomTicker } from './BottomTicker';
import { Footer } from './Footer';
import { RankListPanel } from './RankListPanel';
import { GlobalMessage } from './GlobalMessage';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket } from 'lucide-react';

function App() {
  const { firstBloods, submissions, stats, tickers, globalMessage, isFrozen, toggleFreeze, isMatchStarted, startMatch } = useEngine();

  return (
    <div className="h-screen w-screen bg-background flex flex-col overflow-hidden relative selection:bg-firstblood/30">
      {/* Dark Tech Background Effects */}
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
      
      {/* Subtle radial gradients to break the solid black */}
      <div className="absolute top-0 left-1/4 w-3/4 h-3/4 bg-ac/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-1/2 h-1/2 bg-firstblood/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-1/3 h-1/3 bg-wa/5 blur-[150px] rounded-full pointer-events-none" />
      
      {/* Core Layout */}
      <Header stats={stats} isFrozen={isFrozen} onToggleFreeze={toggleFreeze} />
      <BottomTicker tickers={tickers} />
      
      <div className="flex-1 flex overflow-hidden relative z-10">
        <FirstBloodPanel firstBloods={firstBloods} />
        <EventStream submissions={submissions} />
        <RankListPanel isFrozen={isFrozen} isMatchStarted={isMatchStarted} />
      </div>

      <Footer />
      
      {/* 全局弹出消息 */}
      <GlobalMessage message={globalMessage} />

      {/* Start Match Overlay */}
      <AnimatePresence>
        {!isMatchStarted && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-md"
          >
            <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-firstblood/10 blur-[150px] rounded-full pointer-events-none" />
            
            <div className="relative flex flex-col items-center gap-12 z-10">
              <div className="text-center">
                <h1 className="text-5xl md:text-7xl font-bold tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-r from-white via-firstblood to-white mb-6 drop-shadow-[0_0_20px_rgba(255,215,0,0.3)]">
                  准备就绪
                </h1>
                <p className="text-xl text-secondaryText tracking-widest font-mono">
                  SYSTEM STANDBY
                </p>
              </div>

              <button
                onClick={startMatch}
                className="group relative px-12 py-6 bg-firstblood/10 hover:bg-firstblood/20 border border-firstblood/50 rounded-2xl transition-all duration-500 flex items-center gap-6 overflow-hidden shadow-[0_0_30px_rgba(255,215,0,0.1)] hover:shadow-[0_0_50px_rgba(255,215,0,0.3)] hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />
                <Rocket className="w-8 h-8 text-firstblood group-hover:scale-125 transition-transform duration-500" />
                <span className="text-2xl font-bold tracking-[0.2em] text-firstblood uppercase">
                  开始比赛
                </span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;