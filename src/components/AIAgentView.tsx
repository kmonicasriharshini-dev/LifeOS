import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  PlayCircle,
  RotateCcw,
  CheckCircle2,
  Clock,
  Briefcase,
  BookOpen,
  Calendar,
  Wallet,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { useLifeOS } from '../context/LifeOSContext';
import { ActionProposalCard } from './ActionProposalCard';

export const AIAgentView: React.FC = () => {
  const {
    state,
    sendMessage,
    runDemoStep,
    resetToDemo,
    computedMetrics,
    isAILoading,
  } = useLifeOS();

  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [state.chatHistory, isAILoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isAILoading) return;
    sendMessage(inputMessage);
    setInputMessage('');
  };

  const samplePrompts = [
    'I want to get an internship in 4 months.',
    'I have exams for the next 2 weeks.',
    'I have 10 days of vacation.',
    'I completed my Python course.',
    'What should I focus on right now?',
    'I can only spend 2 hours a day on career preparation.',
    'I want to buy a laptop in 3 months.',
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] space-y-4">
      {/* Dynamic Scenario Demo Bar */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#FAF5FF] via-[#FFF6FA] to-[#F1FAF4] border border-[#E9DDFB] shadow-xs shrink-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-white shadow-2xs text-[#523A73]">
              <Sparkles className="w-4 h-4 text-[#8A67B6]" />
            </span>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#523A73]">
                Dynamic Replanning Demo Flow
              </h3>
              <p className="text-[11px] text-[#696B81]">
                Test the 5 key scenario steps to see cross-domain relationships adapt in real time:
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => runDemoStep(1)}
              disabled={isAILoading}
              className="px-2.5 py-1 rounded-xl bg-white hover:bg-[#FAF7FD] text-xs font-semibold text-[#483763] border border-[#E2DCED] shadow-2xs transition cursor-pointer disabled:opacity-50"
            >
              Step 1: Set 4-Mo Goal
            </button>
            <button
              onClick={() => runDemoStep(2)}
              disabled={isAILoading}
              className="px-2.5 py-1 rounded-xl bg-[#FDF2F5] hover:bg-[#FCE7EE] text-xs font-semibold text-[#86374E] border border-[#F7DCE5] shadow-2xs transition cursor-pointer disabled:opacity-50"
            >
              Step 2: Add Exams (Lighten)
            </button>
            <button
              onClick={() => runDemoStep(3)}
              disabled={isAILoading}
              className="px-2.5 py-1 rounded-xl bg-[#F0FAF3] hover:bg-[#E2F7E8] text-xs font-semibold text-[#245D37] border border-[#DDF3E4] shadow-2xs transition cursor-pointer disabled:opacity-50"
            >
              Step 3: 10-Day Vacation (Sprint)
            </button>
            <button
              onClick={() => runDemoStep(4)}
              disabled={isAILoading}
              className="px-2.5 py-1 rounded-xl bg-[#F3F8FE] hover:bg-[#E5F1FC] text-xs font-semibold text-[#295687] border border-[#DCEBFA] shadow-2xs transition cursor-pointer disabled:opacity-50"
            >
              Step 4: Python Completed
            </button>
            <button
              onClick={() => runDemoStep(5)}
              disabled={isAILoading}
              className="px-2.5 py-1 rounded-xl bg-[#FFF9F5] hover:bg-[#FDECE2] text-xs font-semibold text-[#86512C] border border-[#FBE4D5] shadow-2xs transition cursor-pointer disabled:opacity-50"
            >
              Step 5: Synthesize Focus
            </button>
          </div>
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="flex-1 bg-white rounded-3xl border border-[#EDE8F5] shadow-xs p-6 overflow-y-auto space-y-4">
        {state.chatHistory.map((message) => {
          const isUser = message.sender === 'user';
          const isSystem = message.sender === 'system';

          if (isSystem) {
            return (
              <div key={message.id} className="flex justify-center my-3">
                <div className="max-w-xl text-center px-4 py-2 rounded-xl bg-[#F0FAF3] border border-[#DDF3E4] text-xs text-[#205732] font-medium shadow-2xs">
                  {message.text}
                </div>
              </div>
            );
          }

          return (
            <div
              key={message.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1.5`}
            >
              <div className="flex items-center gap-2 px-1 text-[11px] text-[#8C8EA2]">
                <span className="font-semibold text-[#575971]">
                  {isUser ? state.user.name : 'LifeOS AI'}
                </span>
                <span>•</span>
                <span>{message.timestamp}</span>
              </div>

              <div
                className={`max-w-2xl p-4.5 rounded-2xl text-xs md:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-[#523A73] text-white rounded-tr-xs shadow-xs'
                    : 'bg-[#FAF7FD] text-[#2F3142] border border-[#EDE4F7] rounded-tl-xs shadow-2xs'
                }`}
              >
                <div className="whitespace-pre-wrap">{message.text}</div>

                {/* AI Cross-Domain Reasoning Callout */}
                {message.reasoning && (
                  <div className="mt-3 pt-3 border-t border-[#E8DCF7] text-xs text-[#523A73] bg-white/70 p-2.5 rounded-xl border border-[#E9DDFB]">
                    <div className="flex items-center gap-1.5 font-bold mb-1">
                      <Sparkles className="w-3.5 h-3.5 text-[#8869B8]" />
                      <span>Cross-Domain Relationship Reasoning</span>
                    </div>
                    <p className="text-[11px] text-[#4F5165] leading-normal">{message.reasoning}</p>
                  </div>
                )}
              </div>

              {/* Action Proposal Card if present in this turn */}
              {message.actionProposal && (
                <div className="w-full max-w-2xl">
                  <ActionProposalCard proposal={message.actionProposal} />
                </div>
              )}
            </div>
          );
        })}

        {isAILoading && (
          <div className="flex flex-col items-start space-y-1.5">
            <div className="flex items-center gap-2 px-1 text-[11px] text-[#8C8EA2]">
              <span className="font-semibold text-[#575971]">LifeOS AI</span>
              <span>•</span>
              <span>Thinking...</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#FAF7FD] border border-[#EDE4F7] text-xs text-[#6F7185] flex items-center gap-2 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#8E6EC8] animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-[#E586A1] animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-[#469B60] animate-bounce [animation-delay:0.4s]" />
              <span className="ml-1 text-[#553E74] font-medium">
                Evaluating Goals + Schedule + Learning + Career + Finances...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts & Input Bar */}
      <div className="shrink-0 space-y-2">
        {/* Sample prompt chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          <span className="text-[11px] font-bold text-[#7E8095] whitespace-nowrap mr-1">
            Try saying:
          </span>
          {samplePrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => sendMessage(prompt)}
              disabled={isAILoading}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#FAF7FD] text-[11px] font-medium text-[#46385B] border border-[#EDE8F5] whitespace-nowrap shadow-2xs hover:shadow transition cursor-pointer disabled:opacity-50"
            >
              "{prompt}"
            </button>
          ))}
        </div>

        {/* Input box */}
        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={isAILoading}
            placeholder="Tell LifeOS about a schedule change, new goal, completed course, or ask for focus..."
            className="w-full pl-4 pr-12 py-3 rounded-2xl bg-white border border-[#EDE8F5] text-xs md:text-sm text-[#2F3142] placeholder-[#8F91A3] focus:border-[#8E6EC8] focus:outline-none shadow-xs"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isAILoading}
            className="absolute right-2 top-2 p-2 rounded-xl bg-[#523A73] hover:bg-[#432F5F] text-white disabled:opacity-30 transition cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
