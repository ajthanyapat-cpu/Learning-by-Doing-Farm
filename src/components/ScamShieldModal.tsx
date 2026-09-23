/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  X, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Lock, 
  ExternalLink,
  Award,
  Sparkles,
  Info
} from 'lucide-react';
import { ScamEvent } from '../types.ts';
import { playAlertSound, playFanfareSound, playPopSound } from '../utils/audio.ts';

interface ScamShieldModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeScam: ScamEvent | null;
  onResolveScam: (scamId: string, madeSafeChoice: boolean) => void;
  safetyScore: number;
  resolvedScamsCount: number;
}

export const ScamShieldModal: React.FC<ScamShieldModalProps> = ({
  isOpen,
  onClose,
  activeScam,
  onResolveScam,
  safetyScore,
  resolvedScamsCount,
}) => {
  const [feedback, setFeedback] = React.useState<{ isSafe: boolean; explanation: string; warning: string } | null>(null);

  if (!isOpen) return null;

  const handleChoice = (madeSafeChoice: boolean) => {
    if (!activeScam) return;

    if (madeSafeChoice) {
      playFanfareSound();
      setFeedback({
        isSafe: true,
        explanation: activeScam.explanation,
        warning: activeScam.realWorldWarning,
      });
    } else {
      playAlertSound();
      setFeedback({
        isSafe: false,
        explanation: `⚠️ ระวัง! กลลวงนี้อันตรายมาก: ${activeScam.explanation}`,
        warning: activeScam.realWorldWarning,
      });
    }
  };

  const handleDismissFeedback = () => {
    if (activeScam && feedback) {
      onResolveScam(activeScam.id, feedback.isSafe);
      setFeedback(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-stone-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full border-2 border-rose-300 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-600 via-amber-600 to-rose-600 px-5 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-2xl shadow-inner">
              🛡️
            </div>
            <div>
              <h2 className="text-lg font-bold">ศูนย์รู้ทันมิจฉาชีพ & ภูมิคุ้มกันไซเบอร์</h2>
              <p className="text-xs text-rose-100">
                เรียนรู้ทักษะชีวิต ป้องกันการถูกหลอกลวง และปกป้องข้อมูลส่วนบุคคล
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

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
          {/* Safety Score Banner */}
          <div className="flex flex-wrap items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-300 gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-2xl">
                🎖️
              </div>
              <div>
                <p className="text-xs text-stone-500 font-medium">คะแนนภูมิคุ้มกันดิจิทัล (Cyber Safety Score)</p>
                <p className="text-xl font-extrabold text-emerald-800">
                  {safetyScore} คะแนน • ป้องกันภัยสำเร็จ {resolvedScamsCount} ครั้ง
                </p>
              </div>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
              {safetyScore >= 100 ? '🌟 ผู้เชี่ยวชาญรู้ทันกลโกง' : '🌱 กำลังเสริมสร้างภูมิคุ้มกัน'}
            </span>
          </div>

          {/* Active Scam Encounter if any */}
          {activeScam ? (
            <div className="p-4 rounded-2xl bg-rose-50/70 border-2 border-rose-300 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-800 uppercase tracking-wide flex items-center gap-1">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  <span>สถานการณ์จำลองตรวจจับภัยคุกคาม</span>
                </span>
                <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                  โบนัสตอบถูก: +{activeScam.rewardCoins} 🪙
                </span>
              </div>

              {/* Message Box */}
              <div className="bg-white p-3.5 rounded-xl border border-rose-200 shadow-2xs space-y-2">
                <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
                  <span className="text-2xl">{activeScam.senderAvatar}</span>
                  <div>
                    <p className="text-xs font-bold text-stone-800">{activeScam.senderName}</p>
                    <p className="text-[10px] text-stone-400">ช่องทาง: {activeScam.channel.toUpperCase()}</p>
                  </div>
                </div>
                <h4 className="text-sm font-bold text-rose-950">{activeScam.title}</h4>
                <p className="text-xs text-stone-700 leading-relaxed font-normal bg-stone-50 p-2.5 rounded-lg border border-stone-100">
                  "{activeScam.content}"
                </p>
              </div>

              {/* Feedback Dialog or Choice Buttons */}
              {feedback ? (
                <div className={`p-4 rounded-xl border-2 space-y-2 ${
                  feedback.isSafe ? 'bg-emerald-50 border-emerald-400' : 'bg-rose-100 border-rose-400'
                }`}>
                  <div className="flex items-center gap-2">
                    {feedback.isSafe ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-rose-600" />
                    )}
                    <h5 className={`text-sm font-bold ${feedback.isSafe ? 'text-emerald-900' : 'text-rose-900'}`}>
                      {feedback.isSafe ? '🎉 ยอดเยี่ยมมาก! คุณตัดสินใจถูกต้อง ปลอดภัย 100%' : '⚠️ เสี่ยงถูกหลอก! ลองศึกษาเหตุผลนะ'}
                    </h5>
                  </div>
                  <p className="text-xs text-stone-700 leading-relaxed">{feedback.explanation}</p>
                  <p className="text-xs font-semibold text-stone-800 bg-white/80 p-2 rounded-lg border border-stone-200">
                    {feedback.warning}
                  </p>
                  <button
                    onClick={handleDismissFeedback}
                    className="w-full py-2 bg-stone-800 hover:bg-stone-900 text-white font-bold text-xs rounded-xl transition-all shadow-xs"
                  >
                    รับทราบและบันทึกลงสมุดความรู้
                  </button>
                </div>
              ) : (
                <div className="space-y-2 pt-1">
                  <p className="text-xs font-bold text-stone-700">น้องเกษตรกรจะเลือกทำอย่างไรดี?</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <button
                      onClick={() => handleChoice(true)}
                      className="p-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-left transition-all shadow-xs flex items-center justify-between group"
                    >
                      <span>{activeScam.safeChoiceText}</span>
                      <ShieldCheck className="w-4 h-4 ml-1 flex-shrink-0 group-hover:scale-110 transition-transform" />
                    </button>
                    <button
                      onClick={() => handleChoice(false)}
                      className="p-3 bg-stone-100 hover:bg-rose-100 text-stone-700 hover:text-rose-800 border border-stone-300 rounded-xl text-left transition-all"
                    >
                      <span>{activeScam.scamChoiceText}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 text-center py-6">
              <span className="text-4xl block mb-2">🌿✨</span>
              <h4 className="text-sm font-bold text-emerald-900">ฟาร์มของคุณปลอดภัยไร้การรบกวนในขณะนี้</h4>
              <p className="text-xs text-stone-600 mt-1 max-w-md mx-auto">
                หากมีคนแปลกหน้าส่งข้อความน่าสงสัยหรือมีข้อเสนอแปลกๆ เข้ามา ระบบเรดาร์จะแจ้งเตือนทันที!
              </p>
            </div>
          )}

          {/* 5 Golden Rules of Youth Digital Safety */}
          <div>
            <h3 className="text-sm font-bold text-stone-800 mb-2.5 flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-emerald-600" />
              <span>5 กฎเหล็กความปลอดภัยในโลกดิจิทัลสำหรับเยาวชน</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-stone-700">
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                <span className="font-bold text-rose-700 block mb-0.5">1. กฎห้ามบอก OTP & รหัสผ่าน</span>
                <p className="text-[11px] text-stone-500 leading-relaxed">
                  รหัส OTP 6 หลักเปรียบเหมือนกุญแจตู้เซฟ เจ้าหน้าที่จริงไม่มีนโยบายทักแชทมาขอเด็ดขาด
                </p>
              </div>

              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                <span className="font-bold text-amber-700 block mb-0.5">2. ไม่กดลิงก์แปลกปลอม (Phishing)</span>
                <p className="text-[11px] text-stone-500 leading-relaxed">
                  มักหลอกล่อด้วย "ของฟรี", "คุณถูกรางวัล", หรือสร้างความกลัวให้รีบกดเพื่อขโมยข้อมูล
                </p>
              </div>

              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                <span className="font-bold text-blue-700 block mb-0.5">3. ระวังผลตอบแทนสูงเว่อร์ (แชร์ลูกโซ่)</span>
                <p className="text-[11px] text-stone-500 leading-relaxed">
                  หากมีคนการันตี "รวยเร็ว งานง่าย กำไร 100% ใน 1 วัน" ให้ตั้งข้อสงสัยว่าโกง 100%
                </p>
              </div>

              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                <span className="font-bold text-emerald-700 block mb-0.5">4. ตรวจสอบมาตรฐานสินค้าเกษตร</span>
                <p className="text-[11px] text-stone-500 leading-relaxed">
                  อย่าซื้อสารเคมีหรือเมล็ดพันธุ์ไร้ฉลาก ต้องมีเครื่องหมายรับรอง อย./มอก./เกษตรอินทรีย์
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
