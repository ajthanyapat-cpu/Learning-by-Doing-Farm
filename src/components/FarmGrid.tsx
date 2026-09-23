/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Droplets, 
  Sun, 
  Sparkles, 
  Bug, 
  AlertTriangle,
  Heart,
  CheckCircle2
} from 'lucide-react';
import { FarmPlot, ToolType } from '../types.ts';
import { PLANTS_DATA, PLANT_MAP } from '../data/plants.ts';

interface FarmGridProps {
  plots: FarmPlot[];
  selectedTool: ToolType;
  onPlotClick: (plot: FarmPlot) => void;
  onOpenPlotDetail: (plot: FarmPlot) => void;
}

export const FarmGrid: React.FC<FarmGridProps> = ({
  plots,
  selectedTool,
  onPlotClick,
  onOpenPlotDetail,
}) => {
  return (
    <div className="w-full max-w-5xl mx-auto px-2 sm:px-4 py-3">
      {/* Farm Field Container */}
      <div className="bg-gradient-to-b from-amber-100/90 to-amber-200/90 rounded-3xl p-3 sm:p-6 border-4 border-amber-300 shadow-lg relative overflow-hidden">
        {/* Farm fence decoration background */}
        <div className="absolute top-0 left-0 right-0 h-4 bg-amber-300/40 border-b border-amber-400/50" />
        
        {/* Header inside farm */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏡</span>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-amber-950">
                แปลงเกษตรอินทรีย์รวมใจ ({plots.length} แปลง)
              </h2>
              <p className="text-[11px] text-amber-800">
                คลิกที่แปลงเพื่อใช้งานเครื่องมือที่เลือก ({selectedTool}) หรือคลิกเพื่อดูแลพืช
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs font-medium text-amber-900 bg-white/70 px-3 py-1 rounded-xl border border-amber-200">
            <span className="flex items-center gap-1">
              <Droplets className="w-3.5 h-3.5 text-blue-500" />
              <span>ความชื้นเหมาะสม: 40-75%</span>
            </span>
            <span className="hidden sm:flex items-center gap-1">
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span>สังเคราะห์แสงด้วยแดด</span>
            </span>
          </div>
        </div>

        {/* Plots Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
          {plots.map((plot) => {
            const plant = plot.plantId ? PLANT_MAP.get(plot.plantId) : null;
            const isReady = plot.stage === 5;
            const isDry = plot.moisture < 25;
            const isWaterlogged = plot.moisture > 88;
            const isThriving = plot.stage > 0 && !plot.hasPest && !isDry && !isWaterlogged;

            // Soil visual class based on moisture & compost
            let soilColor = 'bg-[#c99a66]'; // dry soil
            if (plot.moisture >= 30 && plot.moisture <= 80) {
              soilColor = 'bg-[#8d5b32]'; // moist rich loam
            } else if (plot.moisture > 80) {
              soilColor = 'bg-[#5f3e24]'; // very wet
            }

            return (
              <div
                key={plot.id}
                id={`plot-${plot.id}`}
                onClick={() => {
                  if (selectedTool === 'inspect') {
                    onOpenPlotDetail(plot);
                  } else {
                    onPlotClick(plot);
                  }
                }}
                className={`group relative rounded-2xl p-2.5 sm:p-3 transition-all cursor-pointer border-3 select-none flex flex-col justify-between min-h-[170px] sm:min-h-[190px] shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] ${
                  isReady 
                    ? 'border-amber-400 bg-amber-50/80 ring-2 ring-amber-300 animate-pulse-subtle' 
                    : plot.stage > 0
                    ? 'border-amber-700/60 bg-white/80'
                    : 'border-dashed border-amber-400/80 bg-amber-50/40 hover:bg-amber-100/50'
                }`}
              >
                {/* Plot Header: Number & Status Badges */}
                <div className="flex items-center justify-between w-full text-[10px]">
                  <span className="font-bold text-amber-900 bg-amber-100/90 px-1.5 py-0.5 rounded-md border border-amber-200">
                    แปลง #{plot.id + 1}
                  </span>

                  {/* Badges */}
                  <div className="flex items-center gap-1">
                    {plot.fertilized && (
                      <span className="text-[10px] bg-lime-100 text-lime-800 px-1 py-0.2 rounded-md border border-lime-300" title="ใส่ปุ๋ยหมักชีวภาพแล้ว">
                        ✨ ปุ๋ยหมัก
                      </span>
                    )}
                    {plot.hasBeneficialInsect === 'bee' && (
                      <span className="text-xs animate-bounce" title="ผึ้งช่วยผสมเกสร โตไวขึ้น 25%!">
                        🐝
                      </span>
                    )}
                    {plot.hasBeneficialInsect === 'ladybug' && (
                      <span className="text-xs animate-bounce" title="แมลงเต่าทองช่วยกินเพลี้ย!">
                        🐞
                      </span>
                    )}
                    {plot.hasPest && (
                      <span className="text-xs text-rose-600 animate-pulse" title="มีหนอนกินใบ! ใช้น้ำหมักสะเดาไล่">
                        🐛
                      </span>
                    )}
                  </div>
                </div>

                {/* Center: Soil Bed & Crop Stage Visual */}
                <div className={`my-2 rounded-xl p-2.5 relative flex flex-col items-center justify-center min-h-[90px] border-2 border-amber-900/20 shadow-inner overflow-hidden ${soilColor}`}>
                  {/* Soil texture lines */}
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:8px_8px]" />

                  {/* Empty Plot View */}
                  {plot.stage === 0 && (
                    <div className="flex flex-col items-center justify-center text-center py-2 text-amber-100/80">
                      <span className="text-2xl opacity-60">🕳️</span>
                      <span className="text-[11px] font-medium mt-1">แปลงว่างพร้อมปลูก</span>
                      <span className="text-[9px] opacity-70">เลือกเมล็ดพันธุ์แล้วแตะ</span>
                    </div>
                  )}

                  {/* Planted Crop Visuals */}
                  {plot.stage > 0 && plant && (
                    <div className="flex flex-col items-center justify-center relative z-10">
                      {/* Growth Visual Animation by Stage */}
                      {plot.stage === 1 && (
                        <div className="flex flex-col items-center animate-bounce-subtle">
                          <span className="text-xl">🌰</span>
                          <span className="text-[10px] text-amber-100 font-medium">หยอดเมล็ด</span>
                        </div>
                      )}
                      {plot.stage === 2 && (
                        <div className="flex flex-col items-center animate-bounce-subtle">
                          <span className="text-2xl">🌱</span>
                          <span className="text-[10px] text-lime-200 font-medium">ต้นกล้าแรกผลิ</span>
                        </div>
                      )}
                      {plot.stage === 3 && (
                        <div className="flex flex-col items-center animate-bounce-subtle">
                          <span className="text-3xl">🌿</span>
                          <span className="text-[10px] text-emerald-200 font-medium">กำลังเติบโต</span>
                        </div>
                      )}
                      {plot.stage === 4 && (
                        <div className="flex flex-col items-center animate-bounce-subtle">
                          <span className="text-3xl">🌼</span>
                          <span className="text-[10px] text-amber-200 font-medium">ออกดอก/ติดผล</span>
                        </div>
                      )}
                      {plot.stage === 5 && (
                        <div className="flex flex-col items-center animate-bounce">
                          <span className="text-4xl filter drop-shadow-md">{plant.emoji}</span>
                          <span className="text-[11px] font-bold text-amber-200 bg-amber-950/70 px-2 py-0.5 rounded-full mt-0.5 border border-amber-300">
                            เก็บเกี่ยวได้แล้ว!
                          </span>
                        </div>
                      )}

                      {/* Plant name label */}
                      <span className="text-[11px] font-bold text-white drop-shadow-sm mt-0.5 truncate max-w-[120px]">
                        {plant.name}
                      </span>
                    </div>
                  )}

                  {/* Alert Tag on plot if stressed */}
                  {isDry && plot.stage > 0 && (
                    <div className="absolute top-1 left-1 bg-amber-500/90 text-white text-[9px] px-1.5 py-0.5 rounded-md font-bold flex items-center gap-0.5 shadow-xs">
                      <AlertTriangle className="w-2.5 h-2.5" />
                      <span>ดินแห้ง!</span>
                    </div>
                  )}
                  {isWaterlogged && plot.stage > 0 && (
                    <div className="absolute top-1 left-1 bg-blue-600/90 text-white text-[9px] px-1.5 py-0.5 rounded-md font-bold flex items-center gap-0.5 shadow-xs">
                      <Droplets className="w-2.5 h-2.5" />
                      <span>น้ำขังเกิน!</span>
                    </div>
                  )}
                </div>

                {/* Plot Footer: Moisture & Growth Progress Bar */}
                <div className="space-y-1.5 w-full text-[10px]">
                  {/* Moisture bar */}
                  <div className="flex items-center justify-between text-stone-600">
                    <span className="flex items-center gap-1 font-medium">
                      <Droplets className="w-3 h-3 text-blue-500" />
                      <span>ความชื้นดิน</span>
                    </span>
                    <span className={`font-bold ${isDry ? 'text-rose-600' : isWaterlogged ? 'text-sky-600' : 'text-emerald-700'}`}>
                      {Math.round(plot.moisture)}%
                    </span>
                  </div>
                  <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 rounded-full ${
                        isDry ? 'bg-amber-400' : isWaterlogged ? 'bg-sky-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${Math.min(100, Math.max(0, plot.moisture))}%` }}
                    />
                  </div>

                  {/* Growth Progress Bar */}
                  {plot.stage > 0 && (
                    <>
                      <div className="flex items-center justify-between text-stone-600 pt-0.5">
                        <span className="font-medium">การเจริญเติบโต</span>
                        <span className="font-bold text-emerald-700">
                          {isReady ? '100%' : `${Math.round(plot.progress)}%`}
                        </span>
                      </div>
                      <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-lime-500 to-emerald-500 transition-all duration-300 rounded-full"
                          style={{ width: `${Math.min(100, Math.max(0, plot.progress))}%` }}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
