import React, { useState, useEffect, useRef } from "react";
import { Clock, Snowflake, Play, KeyRound, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import IconPng from "./assets/icon.png";

interface HeaderProps {
  stats: { total: number; ac: number };
  isFrozen: boolean;
  onToggleFreeze: () => void;
}

export const Header: React.FC<HeaderProps> = ({ stats, isFrozen, onToggleFreeze }) => {
  const [time, setTime] = useState(new Date());
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (showPasswordDialog && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showPasswordDialog]);

  const handleToggleClick = () => {
    setShowPasswordDialog(true);
    setPassword("");
    setError(false);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "xknnb666") {
      setShowPasswordDialog(false);
      onToggleFreeze();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <>
      <header className="h-20 bg-card/80 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-8 shrink-0 relative z-10">
      <div className="flex items-center gap-4 min-w-0">
        <img src={IconPng} alt="Logo" className="w-10 h-10 object-contain drop-shadow-[0_0_10px_rgba(255,215,0,0.5)] shrink-0" />
        <h1 className="text-xl md:text-2xl font-bold tracking-wider uppercase text-transparent bg-clip-text bg-gradient-to-r from-primaryText to-secondaryText truncate">
          华北水利水电大学第八届ACM-ICPC程序设计大赛
        </h1>
      </div>

      <div className="flex items-center gap-12 font-mono">
        <div className="flex flex-col items-center">
          <span className="text-xs text-secondaryText uppercase tracking-widest">
            总提交
          </span>
          <span className="text-2xl font-bold text-primaryText">
            {stats.total}
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-xs text-secondaryText uppercase tracking-widest">
            通过 (AC)
          </span>
          <span className="text-2xl font-bold text-ac drop-shadow-[0_0_8px_rgba(0,200,83,0.8)]">
            {stats.ac}
          </span>
        </div>
        <div className="w-px h-10 bg-white/10 mx-2"></div>
        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 text-secondaryText" />
          <span className="text-xl font-bold text-primaryText tracking-widest">
            {time.toLocaleTimeString("en-US", { hour12: false })}
          </span>
        </div>
        <button 
          onClick={handleToggleClick}
          className={`ml-4 px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 ${isFrozen ? 'bg-blue-500/20 border border-blue-400/50 text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'bg-white/10 border border-white/20 text-white/70 hover:bg-white/20'}`}>
            {isFrozen ? <Play className="w-4 h-4"/> : <Snowflake className="w-4 h-4"/>}
            <span className="text-sm font-bold uppercase tracking-wider">
              {isFrozen ? "解封" : "封榜"}
            </span>
        </button>
      </div>
      </header>

      <AnimatePresence>
        {showPasswordDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto"
              onClick={() => setShowPasswordDialog(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-card border border-white/10 p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4 pointer-events-auto"
            >
              <button 
                onClick={() => setShowPasswordDialog(false)}
                className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col items-center gap-4 mb-8">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center border transition-colors duration-300 ${error ? 'bg-wa/10 border-wa/50 text-wa' : 'bg-primaryText/10 border-white/20 text-primaryText'}`}>
                  <KeyRound className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-bold text-primaryText tracking-widest">
                  请输入验证密码
                </h2>
              </div>

              <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
                <div className="relative">
                  <input
                    ref={inputRef}
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className={`w-full bg-black/50 border rounded-xl px-4 py-3 text-center text-xl tracking-[0.5em] font-mono outline-none transition-all duration-300 ${
                      error 
                        ? 'border-wa/50 shadow-[0_0_15px_rgba(255,82,82,0.2)] text-wa placeholder:text-wa/30' 
                        : 'border-white/10 focus:border-ac/50 focus:shadow-[0_0_15px_rgba(0,200,83,0.2)] text-primaryText placeholder:text-white/20'
                    }`}
                  />
                  {error && (
                    <motion.span 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute -bottom-6 left-0 right-0 text-center text-xs text-wa font-bold tracking-widest"
                    >
                      密码错误，请重试
                    </motion.span>
                  )}
                </div>

                <button
                  type="submit"
                  className="mt-4 w-full bg-primaryText/10 hover:bg-primaryText/20 border border-white/20 text-primaryText font-bold tracking-widest py-3 rounded-xl transition-all duration-300 uppercase text-sm hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                >
                  确认{isFrozen ? "解封" : "封榜"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
