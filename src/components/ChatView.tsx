import React, { useRef, useEffect } from "react";
import { ChatMessage } from "../types";
import { SAMPLE_QUESTIONS } from "../data/policies";
import { Send, Bot, User, Sparkles, BookOpen, Trash2 } from "lucide-react";

interface ChatViewProps {
  messages: ChatMessage[];
  loading: boolean;
  inputQuery: string;
  onInputChange: (val: string) => void;
  onSend: () => void;
  onSelectSampleQuestion: (q: string) => void;
  onClearChat: () => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
  messages,
  loading,
  inputQuery,
  onInputChange,
  onSend,
  onSelectSampleQuestion,
  onClearChat,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div id="chatView" className="flex-1 flex flex-col min-w-0 bg-[#EEF1F5] h-full">
      {/* Messages area */}
      <div
        id="chatScroll"
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-4 max-w-4xl w-full mx-auto"
      >
        {messages.length === 0 ? (
          <div className="py-8 px-4 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-xl bg-white border border-[#D8DCE3] flex items-center justify-center text-[#14213D] shadow-xs mb-4">
              <Sparkles className="w-6 h-6 text-amber-500" />
            </div>
            <h2 className="font-serif-display text-lg font-semibold text-[#14213D] mb-1">
              Ask about company policies
            </h2>
            <p className="text-xs text-[#5B6472] max-w-md mb-6 leading-relaxed">
              Answers are grounded strictly in your role-accessible documents. Select a suggested prompt or type any question below.
            </p>

            <div className="flex flex-wrap justify-center gap-2 max-w-xl">
              {SAMPLE_QUESTIONS.map((sq, idx) => (
                <button
                  key={idx}
                  onClick={() => onSelectSampleQuestion(sq)}
                  className="text-xs font-sans-body px-3.5 py-2 rounded-lg bg-white border border-[#D8DCE3] hover:border-[#14213D] hover:bg-[#F8F9FA] text-[#14213D] transition-all shadow-xs text-left cursor-pointer"
                >
                  "{sq}"
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-end mb-2">
              <button
                onClick={onClearChat}
                className="flex items-center gap-1 text-[11px] text-[#5B6472] hover:text-[#14213D] transition-colors cursor-pointer px-2 py-1"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear history</span>
              </button>
            </div>

            {messages.map((m) => {
              const isUser = m.sender === "user";
              return (
                <div
                  key={m.id}
                  className={`flex items-start gap-2.5 ${
                    isUser ? "justify-end" : "justify-start"
                  }`}
                >
                  {!isUser && (
                    <div className="w-7 h-7 rounded-md bg-[#14213D] text-white flex items-center justify-center shrink-0 mt-1 shadow-xs">
                      <Bot className="w-4 h-4 text-amber-300" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] md:max-w-[75%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                      isUser
                        ? "bg-[#14213D] text-white font-sans-body shadow-xs"
                        : "bg-white text-[#14213D] border border-[#D8DCE3] shadow-xs"
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{m.text}</div>

                    {m.sources && m.sources.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-[#EDEFF2] flex items-center gap-1.5 text-xs text-[#A6784B] font-mono-code flex-wrap">
                        <BookOpen className="w-3.5 h-3.5 shrink-0 text-[#A6784B]" />
                        <span>Sources:</span>
                        {m.sources.map((s, sIdx) => (
                          <span
                            key={sIdx}
                            className="bg-[#FFF9EE] border border-[#F3E2C4] px-1.5 py-0.5 rounded text-[11px]"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {isUser && (
                    <div className="w-7 h-7 rounded-md bg-[#5B6472] text-white flex items-center justify-center shrink-0 mt-1">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {loading && (
              <div className="flex items-start gap-2.5 justify-start">
                <div className="w-7 h-7 rounded-md bg-[#14213D] text-white flex items-center justify-center shrink-0 mt-1 animate-pulse">
                  <Bot className="w-4 h-4 text-amber-300" />
                </div>
                <div className="bg-white border border-[#D8DCE3] rounded-xl px-4 py-3 text-xs text-[#5B6472] flex items-center gap-2 shadow-xs">
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-[#14213D] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-1.5 h-1.5 bg-[#14213D] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-1.5 h-1.5 bg-[#14213D] rounded-full animate-bounce"></div>
                  </div>
                  <span>Retrieving role-permitted policies & grounding response with Gemini…</span>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Input bar */}
      <div className="border-t border-[#D8DCE3] bg-white p-4">
        <div className="max-w-4xl mx-auto flex items-center gap-2">
          <input
            id="questionInput"
            type="text"
            value={inputQuery}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about expenses, remote work, data security, incidents…"
            disabled={loading}
            className="flex-1 px-4 py-3 rounded-lg border border-[#C7CDD6] bg-[#F7F8FA] text-sm text-[#14213D] placeholder-[#8A93A0] focus:outline-hidden focus:ring-2 focus:ring-[#14213D] focus:bg-white transition-all font-sans-body"
          />
          <button
            id="askBtn"
            onClick={onSend}
            disabled={loading || !inputQuery.trim()}
            className="px-5 py-3 rounded-lg bg-[#14213D] text-white font-medium text-sm flex items-center gap-2 hover:bg-[#1E2F54] transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0 shadow-xs"
          >
            <span>Ask</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
