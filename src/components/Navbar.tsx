/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Sun, 
  CloudRain, 
  CloudSun, 
  Wind, 
  Volume2, 
  VolumeX, 
  Store, 
  Wallet, 
  ShieldCheck, 
  Users, 
  BookOpen, 
  Bot,
  Sparkles,
  TrendingUp
} from 'lucide-react';
import { WeatherState, FinancialJars } from '../types.ts';
import { toggleMute, playPopSound } from '../utils/audio.ts';

interface NavbarProps {
  weather: WeatherState;
  timeOfDay: 'morning' | 'afternoon' | 'evening';
  dayCount: number;
  jars: FinancialJars;
  isCoopMode: boolean;
  onToggleCoopMode: () => void;
  onOpenMarket: () => void;
  onOpenFinance: () => void;
  onOpenScamShield: () => void;
  onOpenCoop: () => void;
  onOpenEncyclopedia: () => void;
  onOpenAiAdvisor: () => void;
  hasUnreadScam: boolean;
  savingsInterestAccrued: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  weather,
  timeOfDay,
  dayCount,
  jars,
  isCoopMode,
  onToggleCoopMode,
  onOpenMarket,
  onOpenFinance,
  onOpenScamShield,
  onOpenCoop,
  onOpenEncyclopedia,
  onOpenAiAdvisor,
  hasUnreadScam,
  savingsInterestAccrued,
}) => {
  const [muted, setMuted] = React.useState(false);

  const handleMuteToggle = () => {
    const nextState = toggleMute();
    setMuted(nextState);
    if (!nextState) playPopSound();
  };

  const getWeatherIcon = () => {
    switch (weather.type) {
      case 'sunny':
        return <Sun className="w-5 h-5 text-amber-500 animate-spin-slow" />;
      case 'rainy':
        return <CloudRain className="w-5 h-5 text-sky-500 animate-bounce-subtle" />;
      case 'partly_cloudy':
        return <CloudSun className="w-5 h-5 text-amber-400" />;
      case 'breezy':
        return <Wind className="w-5 h-5 text-teal-500 animate-pulse" />;
    }
  };

  const getTimeLabel = () => {
    switch (timeOfDay) {
      case 'morning':
        return { label: 'เช้าตรู่', color: 'bg-amber-100 text-amber-800' };
      case 'afternoon':
        return { label: 'บ่ายสดใส', color: 'bg-orange-100 text-orange-800' };
      case 'evening':
        return { label: 'เย็นสบาย', color: 'bg-indigo-100 text-indigo-800' };
    }
  };

  const timeInfo = getTimeLabel();

  return (
    <header className="sticky top-0 z-30 bg-amber-50/95 backdrop-blur-md border-b border-amber-200/80 shadow-xs px-3 sm:px-6 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand & Weather & Day */}
        <div className="flex items-center justify-between w-full md:w-auto gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-lime-400 flex items-center justify-center text-2xl shadow-sm border border-emerald-300">
              🌱
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-bold text-stone-800 text-base sm:text-lg tracking-tight leading-none">
                  ฟาร์มสุข เกษตรวัยใส
                </h1>
                <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
                  Eco & Safe
                </span>
              </div>
              <p className="text-xs text-stone-500 font-normal">
                เรียนรู้พืช ดิน น้ำ แสง & ทักษะการเงินรอบตัว
              </p>
            </div>
          </div>

          {/* Time & Weather pill for mobile */}
          <div className="flex items-center gap-1.5 md:hidden">
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/80 border border-amber-200 text-xs font-medium text-stone-700 shadow-2xs">
              {getWeatherIcon()}
              <span>{weather.label}</span>
            </div>
            <button
              onClick={handleMuteToggle}
              className="p-1.5 rounded-xl bg-white/80 border border-amber-200 text-stone-600 hover:text-stone-800"
              title={muted ? 'เปิดเสียง' : 'ปิดเสียง'}
            >
              {muted ? <VolumeX className="w-4 h-4 text-stone-400" /> : <Volume2 className="w-4 h-4 text-emerald-600" />}
            </button>
          </div>
        </div>

        {/* Center: Environment & Day status on Desktop */}
        <div className="hidden md:flex items-center gap-2">
          {/* Day pill */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/90 border border-amber-200 shadow-2xs text-xs font-medium text-stone-700">
            <span className="text-amber-600 font-bold">วันที่ {dayCount}</span>
            <span className={`px-2 py-0.5 rounded-md text-[11px] font-medium ${timeInfo.color}`}>
              {timeInfo.label}
            </span>
          </div>

          {/* Weather pill */}
          <div 
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/90 border border-amber-200 shadow-2xs text-xs font-medium text-stone-700 cursor-help"
            title={`${weather.label}: ${weather.description}`}
          >
            {getWeatherIcon()}
            <div>
              <span className="font-semibold">{weather.label}</span>
              <span className="text-[10px] text-stone-500 block leading-tight">
                {weather.type === 'rainy' ? 'รดน้ำแปลงฟรี!' : `สังเคราะห์แสง ${weather.sunlightMultiplier}x`}
              </span>
            </div>
          </div>

          {/* Mode Switcher Button */}
          <button
            onClick={() => {
              playPopSound();
              onToggleCoopMode();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
              isCoopMode
                ? 'bg-purple-100 text-purple-800 border-purple-300 hover:bg-purple-200 shadow-xs'
                : 'bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200 shadow-xs'
            }`}
          >
            {isCoopMode ? (
              <>
                <Users className="w-3.5 h-3.5 text-purple-600" />
                <span>โหมดสหกรณ์ทีม</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>โหมดลุยเดี่ยว (Solo)</span>
              </>
            )}
          </button>
        </div>

        {/* Right side: Quick Jars Balance & Navigation Badges */}
        <div className="flex flex-wrap items-center justify-center md:justify-end gap-1.5 sm:gap-2 w-full md:w-auto">
          {/* Working Capital quick view */}
          <button
            onClick={() => {
              playPopSound();
              onOpenFinance();
            }}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-400/40 text-emerald-800 transition-all text-xs font-semibold"
            title="กระปุกทุนหมุนเวียน (ใช้ซื้อเมล็ดและบำรุงฟาร์ม)"
          >
            <span className="text-sm">🪙</span>
            <span>{jars.operating.toLocaleString()}</span>
            <span className="text-[10px] text-emerald-600 font-normal">ทุน</span>
          </button>

          {/* Emergency Savings quick view */}
          <button
            onClick={() => {
              playPopSound();
              onOpenFinance();
            }}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-400/40 text-blue-800 transition-all text-xs font-semibold relative"
            title="กระปุกเงินออมฉุกเฉิน (มีดอกเบี้ยเงินฝากเติบโต)"
          >
            <span className="text-sm">🏦</span>
            <span>{jars.savings.toLocaleString()}</span>
            <span className="text-[10px] text-blue-600 font-normal">ออม</span>
            {savingsInterestAccrued > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-blue-600 text-white text-[9px] px-1 rounded-full animate-bounce">
                +{savingsInterestAccrued}
              </span>
            )}
          </button>

          {/* Action icon buttons */}
          <button
            id="nav-market-btn"
            onClick={() => {
              playPopSound();
              onOpenMarket();
            }}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white hover:bg-amber-100/60 border border-amber-200 text-stone-700 transition-all text-xs font-medium shadow-2xs"
            title="ตลาดชุมชน ซื้อขายผลผลิต"
          >
            <Store className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden sm:inline">ตลาดผัก</span>
          </button>

          <button
            id="nav-scam-shield-btn"
            onClick={() => {
              playPopSound();
              onOpenScamShield();
            }}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border transition-all text-xs font-medium shadow-2xs relative ${
              hasUnreadScam 
                ? 'bg-rose-100 text-rose-800 border-rose-400 animate-pulse font-bold' 
                : 'bg-white hover:bg-amber-100/60 border-amber-200 text-stone-700'
            }`}
            title="ศูนย์รู้ทันมิจฉาชีพ & ความปลอดภัยไซเบอร์"
          >
            <ShieldCheck className={`w-3.5 h-3.5 ${hasUnreadScam ? 'text-rose-600' : 'text-emerald-600'}`} />
            <span>รู้ทันโกง</span>
            {hasUnreadScam && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping" />
            )}
          </button>

          <button
            id="nav-coop-btn"
            onClick={() => {
              playPopSound();
              onOpenCoop();
            }}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white hover:bg-amber-100/60 border border-amber-200 text-stone-700 transition-all text-xs font-medium shadow-2xs"
            title="สหกรณ์รวมใจ (ร่วมมือช่วยเหลือและทำภารกิจทีม)"
          >
            <Users className="w-3.5 h-3.5 text-purple-600" />
            <span className="hidden sm:inline">สหกรณ์</span>
          </button>

          <button
            id="nav-encyclopedia-btn"
            onClick={() => {
              playPopSound();
              onOpenEncyclopedia();
            }}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white hover:bg-amber-100/60 border border-amber-200 text-stone-700 transition-all text-xs font-medium shadow-2xs"
            title="สารานุกรมพืช วิทยาศาสตร์ธรรมชาติ และดินปุ๋ย"
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">คู่มือพืช</span>
          </button>

          <button
            id="nav-ai-advisor-btn"
            onClick={() => {
              playPopSound();
              onOpenAiAdvisor();
            }}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 transition-all text-xs font-semibold shadow-xs"
            title="ถามพี่ต้นกล้า AI ผู้เชี่ยวชาญเกษตร & การเงิน"
          >
            <Bot className="w-3.5 h-3.5" />
            <span>พี่ต้นกล้า AI</span>
          </button>

          {/* Sound toggle on desktop */}
          <button
            onClick={handleMuteToggle}
            className="hidden md:flex p-1.5 rounded-xl bg-white hover:bg-amber-100/60 border border-amber-200 text-stone-600 transition-all"
            title={muted ? 'เปิดเสียง' : 'ปิดเสียง'}
          >
            {muted ? <VolumeX className="w-4 h-4 text-stone-400" /> : <Volume2 className="w-4 h-4 text-emerald-600" />}
          </button>
        </div>
      </div>
    </header>
  );
};
