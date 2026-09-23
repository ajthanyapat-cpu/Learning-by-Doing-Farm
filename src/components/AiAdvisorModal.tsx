/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  X, 
  Bot, 
  Send, 
  Sparkles, 
  Loader2, 
  MessageSquare,
  HelpCircle
} from 'lucide-react';
import { playPopSound } from '../utils/audio.ts';

interface AiAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
  farmContext: any;
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: number;
}

export const AiAdvisorModal: React.FC<AiAdvisorModalProps> = ({
  isOpen,
  onClose,
  farmContext,
}) => {
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: 'สวัสดีครับน้องเกษตรกรคนเก่ง! พี่ต้นกล้า ยินดีให้คำปรึกษาเรื่องการดูแลพืช แสงแดด น้ำ สภาพดิน ปุ๋ยหมักอินทรีย์ การบริหารเงิน 4 กระปุก หรือถามเรื่องความปลอดภัยดิจิทัลได้เลยนะ!',
      timestamp: Date.now(),
    },
  ]);
  const [inputValue, setInputValue] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const quickQuestions = [
    '💦 ควรรดน้ำต้นไม้อย่างไรไม่ให้รากเน่า?',
    '☀️ แสงแดดกับการสังเคราะห์แสงของพืชทำงานอย่างไร?',
    '🍂 ทำปุ๋ยหมักอินทรีย์จากเศษอาหารอย่างไร?',
    '💰 แบ่งเงิน 4 กระปุกอย่างไรให้มีเงินออม?',
    '🛡️ จะรู้ได้อย่างไรว่าข้อความในแชทเป็นมิจฉาชีพ?',
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputValue).trim();
    if (!query || isLoading) return;

    playPopSound();
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/gemini/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: query,
          farmContext,
        }),
      });

      const data = await res.json();
      const aiReply = data.answer || data.fallback || 'ขออภัยครับ พี่ต้นกล้ากำลังเรียบเรียงข้อมูลอยู่ ลองถามใหม่อีกครั้งนะครับ';

      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: aiReply,
          timestamp: Date.now(),
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'ai',
          text: '🌱 พี่ต้นกล้าพร้อมแนะนำครับ: ในการปลูกพืชอินทรีย์ ให้สังเกตดินและความชุ่มชื้นเป็นหลัก แดดเช้าช่วยสังเคราะห์แสงได้ดีที่สุดครับ!',
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-stone-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full border-2 border-teal-300 shadow-2xl overflow-hidden h-[85vh] max-h-[700px] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-700 px-5 py-3.5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-2xl shadow-inner">
              🤖
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-base sm:text-lg font-bold">พี่ต้นกล้า AI ผู้ช่วยเกษตรกร</h2>
                <span className="text-[10px] bg-emerald-400/30 text-white font-medium px-2 py-0.5 rounded-full border border-white/20">
                  Gemini 3.8 Flash
                </span>
              </div>
              <p className="text-xs text-teal-100">
                ตอบคำถามชีววิทยาพืช สิ่งแวดล้อม การบริหารเงิน และความปลอดภัย
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              playPopSound();
              onClose();
            }}
            className="p-1.5 rounded-full hover:bg-white/20 transition-all text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Messages Stream */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-stone-50/70">
          {messages.map((msg) => {
            const isAi = msg.sender === 'ai';

            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 max-w-[88%] ${isAi ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
              >
                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-sm shadow-2xs ${
                  isAi ? 'bg-teal-100 text-teal-800 border border-teal-300' : 'bg-emerald-600 text-white'
                }`}>
                  {isAi ? '🌱' : '🧑‍🌾'}
                </div>
                <div
                  className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                    isAi
                      ? 'bg-white text-stone-800 border border-stone-200 shadow-2xs rounded-tl-xs whitespace-pre-wrap'
                      : 'bg-emerald-600 text-white shadow-xs rounded-tr-xs'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-2.5 max-w-[80%] mr-auto items-center">
              <div className="w-8 h-8 rounded-full bg-teal-100 border border-teal-300 flex items-center justify-center text-sm">
                🌱
              </div>
              <div className="p-3 bg-white border border-stone-200 rounded-2xl rounded-tl-xs shadow-2xs flex items-center gap-2 text-xs text-stone-500">
                <Loader2 className="w-4 h-4 animate-spin text-teal-600" />
                <span>พี่ต้นกล้ากำลังคิดคำตอบให้...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Question Chips */}
        <div className="p-2.5 bg-white border-t border-stone-100 overflow-x-auto flex items-center gap-1.5 text-[11px]">
          <span className="text-stone-400 font-bold whitespace-nowrap pl-1">คำถามแนะนำ:</span>
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="px-2.5 py-1 bg-teal-50 hover:bg-teal-100 text-teal-800 rounded-xl border border-teal-200 whitespace-nowrap transition-all"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-stone-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="พิมพ์คำถามเรื่องพืช ดิน น้ำ แดด หรือการเงินที่นี่..."
              className="flex-1 p-2.5 bg-stone-50 border border-stone-300 rounded-2xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="p-2.5 bg-teal-600 hover:bg-teal-700 disabled:bg-stone-300 text-white rounded-2xl transition-all shadow-xs flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
