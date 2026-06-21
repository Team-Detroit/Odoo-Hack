import React from 'react';
import { Volume2, User, Cpu } from 'lucide-react';
import { ChatMessage } from './useAIConcierge';

interface AIMessageProps {
  message: ChatMessage;
  onSpeak: (text: string) => void;
}

export const AIMessage: React.FC<AIMessageProps> = ({ message, onSpeak }) => {
  const isAI = message.sender === 'ai';

  return (
    <div className={`flex gap-3 my-4 w-full items-start ${isAI ? 'justify-start' : 'justify-end'}`}>
      {isAI && (
        <div className="w-8 h-8 rounded-full bg-[#714B67] border-2 border-black flex items-center justify-center text-white shadow shrink-0">
          <Cpu className="w-4 h-4" />
        </div>
      )}
      
      <div className="flex flex-col max-w-[75%] gap-1">
        <div 
          className={`p-3 rounded-2xl text-xs font-bold font-sans leading-relaxed tracking-tight whitespace-pre-line relative group transition-all
            ${isAI 
              ? 'bg-white border-2 border-black text-gray-900 shadow-[3px_3px_0px_#000] rounded-tl-none' 
              : 'bg-[#875A7B] border-2 border-black text-white shadow-[3px_3px_0px_#000] rounded-tr-none'
            }`}
        >
          {message.text}

          {isAI && (
            <button
              onClick={() => onSpeak(message.text)}
              className="absolute -right-8 bottom-1 p-1 rounded-full bg-white border border-black hover:bg-gray-100 text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity shadow"
              title="Speak Response"
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <span className={`text-[9px] font-black text-gray-500 px-1 mt-0.5 ${!isAI ? 'text-right' : ''}`}>
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      {!isAI && (
        <div className="w-8 h-8 rounded-full bg-[#00A09D] border-2 border-black flex items-center justify-center text-white shadow shrink-0">
          <User className="w-4 h-4" />
        </div>
      )}
    </div>
  );
};
