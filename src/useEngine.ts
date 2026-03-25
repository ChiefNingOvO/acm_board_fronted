import { useState, useEffect, useCallback, useRef } from "react";

export type ProblemId = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J" | "K";
export type SubStatus = "Pending" | "AC" | "WA" | "Freeze";

export interface Submission {
  id: string;
  team: string;
  problem: ProblemId;
  status: SubStatus;
  timestamp: number;
  judge_time?: string; // 改为 judge_time
}

export interface FirstBlood {
  problem: ProblemId;
  team: string | null;
  timestamp: number | null;
  isNew?: boolean;
  submitCount: number;
  acCount: number;
  judge_time?: string;
}

export const PROBLEMS: ProblemId[] = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K"];

function randomId() {
  return Math.random().toString(36).substring(2, 9);
}

function parseStatus(raw: string): SubStatus {
  if (!raw) return "WA";
  const s = raw.toUpperCase();
  if (s.includes("AC") || s.includes("ACCEPTED") || s === "TRUE") return "AC";
  if (s.includes("PENDING") || s.includes("WAITING")) return "Pending";
  return "WA";
}

export function useEngine() {
  const [firstBloods, setFirstBloods] = useState<Record<ProblemId, FirstBlood>>(() => {
    const initial: Partial<Record<ProblemId, FirstBlood>> = {};
    PROBLEMS.forEach((p) => {
      initial[p] = { 
        problem: p, 
        team: null, 
        timestamp: null, 
        isNew: false,
        submitCount: 0,
        acCount: 0
      };
    });
    return initial as Record<ProblemId, FirstBlood>;
  });

  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [submissionQueue, setSubmissionQueue] = useState<any[]>([]); // 提交队列
  const processedMessageIds = useRef<Set<string>>(new Set()); // 用于去重的 Set
  const isFetching = useRef(false); // 用于防止并发请求
  const MAX_DISPLAY_COUNT = 8; // 页面最多同时展示的判题卡片数量
  
  const [stats, setStats] = useState({ total: 0, ac: 0 });
  const [tickers, setTickers] = useState<string[]>([
    "欢迎来到 ACM/ICPC 比赛现场",
    "系统已连接至实时评测后端",
  ]);
  const [globalMessage, setGlobalMessage] = useState<any>(null);
  const [isFrozen, setIsFrozen] = useState(false);
  const [isMatchStarted, setIsMatchStarted] = useState(false);

  const addTicker = useCallback((msg: string) => {
    setTickers((prev) => [...prev.slice(-4), msg]);
  }, []);

  // 当队列有数据且展示区有空位时，处理队列
  useEffect(() => {
    // 只有当有空位且队列有数据时才执行弹出逻辑
    if (submissionQueue.length > 0 && submissions.length < MAX_DISPLAY_COUNT) {
      // 从队列中取出第一个元素
      const item = submissionQueue[0];
      
      // 立即从队列中移除这个元素，防止被重复处理
      setSubmissionQueue(currentQueue => currentQueue.slice(1));
      
      if (item.type === "message") {
        const finalStatus = parseStatus(item.status);
        const subId = randomId();
        
        // 格式化时间为易读格式 (HH:mm:ss)
        let formattedTime = "";
        if (item.judge_time) {
          try {
            const date = new Date(item.judge_time);
            formattedTime = date.toLocaleTimeString("en-US", { hour12: false });
          } catch (e) {
            formattedTime = item.judge_time;
          }
        }

        const newSub: Submission = {
          id: subId,
          team: item.name,
          problem: item.label as ProblemId,
          status: isFrozen ? "Freeze" : "Pending",
          timestamp: Date.now(),
          judge_time: formattedTime
        };

        // 将新提交加入展示列表
        setSubmissions(prev => [...prev, newSub]);

        setFirstBloods(current => ({
          ...current,
          [item.label as ProblemId]: {
            ...current[item.label as ProblemId],
            submitCount: (current[item.label as ProblemId]?.submitCount || 0) + 1,
          },
        }));

        const judgingDelay = Math.floor(Math.random() * 2000) + 1000;
        
        setTimeout(() => {
          // 无论是否封榜，都要更新总提交数
          setStats(prev => ({
            total: prev.total + 1,
            ac: prev.ac
          }));
          
          if (isFrozen) {
              setTimeout(() => {
                  setSubmissions((current) => current.filter((s) => s.id !== subId));
              }, 4000);
              return;
          }

          // 更新状态为判题结果
          setSubmissions(current => 
            current.map(s => s.id === subId ? { ...s, status: finalStatus } : s)
          );
          
          if (finalStatus === "AC") {
            setFirstBloods(current => ({
              ...current,
              [item.label as ProblemId]: {
                ...current[item.label as ProblemId],
                acCount: (current[item.label as ProblemId]?.acCount || 0) + 1,
              },
            }));
          }

          setStats(prev => ({ 
            total: prev.total + 1,
            ac: prev.ac + (finalStatus === "AC" ? 1 : 0)
          }));

          // 判题结果展示 4 秒后移除
          setTimeout(() => {
            setSubmissions((current) => current.filter((s) => s.id !== subId));
          }, 4000);
          
        }, judgingDelay);

      } else if (item.type === "first_blood") {
        // 假设 item.user_id 是 "名字 学号" 格式，提取纯名字
        const rawName = item.user_id || "";
        const pureName = rawName.split(" ")[0]; // 取空格前的部分作为名字

        // 格式化判题时间
        let formattedJudgeTime = "";
        if (item.judge_time) {
          try {
            const date = new Date(item.judge_time);
            formattedJudgeTime = date.toLocaleTimeString("en-US", { hour12: false });
          } catch (e) {
            formattedJudgeTime = item.judge_time;
          }
        } else {
           formattedJudgeTime = new Date().toLocaleTimeString("en-US", { hour12: false });
        }

        setFirstBloods(current => ({
          ...current,
          [item.problem_id as ProblemId]: {
            problem: item.problem_id as ProblemId,
            team: pureName,
            timestamp: Date.now(),
            isNew: true,
            submitCount: (current[item.problem_id as ProblemId]?.submitCount || 0) + 1,
            acCount: (current[item.problem_id as ProblemId]?.acCount || 0) + 1,
            judge_time: formattedJudgeTime,
          },
        }));
        addTicker(`恭喜 ${pureName} 斩获 ${item.problem_id} 题 First Blood！`);
      }
    }
  }, [submissionQueue, submissions.length, isFrozen, addTicker]);


  const toggleFreeze = useCallback(() => {
    setIsFrozen(prev => {
        const next = !prev;
        if (next) {
            addTicker("比赛已封榜！");
        } else {
            addTicker("比赛已解封！");
        }
        return next;
    });
  }, [addTicker]);

  const fetchLatest = useCallback(async (overrideStarted = false) => {
    if ((!isMatchStarted && !overrideStarted) || isFetching.current) return;
    
    isFetching.current = true;
    try {
      const res = await fetch("/api/get_latest_submission");
      if (!res.ok) return;
      const data = await res.json();
      
      if (!Array.isArray(data)) return;

      if (isFrozen) return;

      // 过滤掉已经处理过的数据，通过组合关键信息生成唯一标识（假设后端没有传唯一 id）
      const newData = data.filter((item: any) => {
        // 生成唯一标识：时间 + 队伍 + 题目 + 状态 + 类型
        const uniqueKey = `${item.type}-${item.judge_time || item.time || ''}-${item.name || item.user_id || ''}-${item.label || item.problem_id || ''}-${item.status || ''}`;
        
        // 绑定这个唯一键到数据对象上，方便队列去重
        item._internalId = uniqueKey;

        if (processedMessageIds.current.has(uniqueKey)) {
          return false;
        }
        processedMessageIds.current.add(uniqueKey);
        return true;
      });

      if (newData.length === 0) return;

      // 将新获取的数据加入队列，由 useEffect 统一处理渲染
      setSubmissionQueue(prev => {
        const queueMap = new Map(prev.map(item => [item._internalId, item]));
        
        newData.forEach((item: any) => {
          if (!queueMap.has(item._internalId)) {
            queueMap.set(item._internalId, item);
          }
        });

        return Array.from(queueMap.values());
      });

    } catch (e) {
      console.error("Fetch submission error:", e);
    } finally {
      isFetching.current = false;
    }
  }, [addTicker, isFrozen, isMatchStarted]);

  // 获取广播消息
  const fetchMessages = useCallback(async () => {
    try {
      console.log("开始获取广播消息...");
      const res = await fetch("/api/get_messages");
      console.log("响应状态:", res.status, res.ok);
      if (!res.ok) {
        console.log("响应不OK，返回");
        return;
      }
      const data = await res.json();
      console.log("获取到的数据:", data);
      
      // 处理两种情况：单个消息或消息数组
      let messages = [];
      if (Array.isArray(data)) {
        messages = data;
      } else if (data) {
        messages = [data];
      }
      
      // 处理所有广播消息
      for (const message of messages) {
        if (message && message.type === "broadcast") {
          console.log("检测到广播消息:", message.content);
          // 创建广播消息对象
          const broadcastMessage = {
            id: `broadcast-${Date.now()}`,
            content: message.content,
            duration: message.duration || 5000
          };
          
          // 设置全局消息
          console.log("设置全局消息:", broadcastMessage);
          setGlobalMessage(broadcastMessage);
          
          // 自动清除消息
          setTimeout(() => {
            console.log("清除全局消息");
            setGlobalMessage(null);
          }, broadcastMessage.duration);
        }
      }
      
      if (messages.length === 0) {
        console.log("没有找到广播消息");
      }
    } catch (e) {
      console.error("Fetch messages error:", e);
    }
  }, []);

  const startMatch = useCallback(() => {
    setIsMatchStarted(true);
    addTicker("比赛正式开始！祝各位选手取得好成绩！");
    // 强制立即执行一次，不受 state 闭包延迟影响
    fetchLatest(true);
    fetchMessages(); // 同时获取初始消息
  }, [addTicker, fetchLatest, fetchMessages]);

  useEffect(() => {
    if (!isMatchStarted) return;
    const interval = setInterval(fetchLatest, 5000); // Poll every 5 seconds
    const messageInterval = setInterval(fetchMessages, 10000); // Poll messages every 10 seconds
    return () => {
      clearInterval(interval);
      clearInterval(messageInterval);
    };
  }, [fetchLatest, fetchMessages, isFrozen, isMatchStarted]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setFirstBloods((current) => {
        let changed = false;
        const next = { ...current };
        for (const p of PROBLEMS) {
          if (next[p]?.isNew) {
            next[p] = { ...next[p], isNew: false };
            changed = true;
          }
        }
        return changed ? next : current;
      });
    }, 3000);
    return () => clearTimeout(timeout);
  }, [firstBloods]);

  return { firstBloods, submissions, stats, tickers, globalMessage, isFrozen, toggleFreeze, isMatchStarted, startMatch };
}
