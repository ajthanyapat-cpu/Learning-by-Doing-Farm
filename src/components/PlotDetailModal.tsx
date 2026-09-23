/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  X, 
  Droplets, 
  Sun, 
  Sparkles, 
  Bug, 
  Heart, 
  CheckCircle2, 
  AlertTriangle,
  Shovel,
  ShoppingBag
} from 'lucide-react';
import { FarmPlot, PlantSpecies } from '../types.ts';
import { PLANT_MAP } from '../data/plants.ts';
import { playPopSound } from '../utils/audio.ts';

interface PlotDetailModalProps {
  plot: FarmPlot | null;
  onClose: () => void;
  onWater: (plot: FarmPlot) => void;
  onCompost: (plot: FarmPlot) => void;
  onPestControl: (plot: FarmPlot) => void;
  onHarvest: (plot: FarmPlot) => void;
  onClear: (plot: FarmPlot) => void;
}

export const PlotDetailModal: React.FC<PlotDetailModalProps> = ({
  plot,
  onClose,
  onWater,
  onCompost,
  onPestControl,
  onHarvest,
  onClear,
}) => {
  if (!plot) return null;

  const plant = plot.plantId ? PLANT_MAP.get(plot.plantId) : null;
  const isReady = plot.stage === 5;
  const isDry = plot.moisture < 25;
  const isWet = plot.moisture > 85;

  const stageNames = ['แปลงว่าง', 'เมล็ดฝังดิน', 'ต้นกล้าผลิใบ', 'ลำต้นเติบโต', 'ออกดอกติดผล', 'สุกพร้อมเก็บเกี่ยว!'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-stone-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full border-2 border-amber-300 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-emerald-600 px-5 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-2xl shadow-inner">
              🔍
            </div>
            <div>
              <h2 className="text-base font-bold">ตรวจสุขภาพแปลงเกษตร #{plot.id + 1}</h2>
              <p className="text-xs text-amber-100">
                วิเคราะห์สภาพดิน ความชื้น แสงแดด และความต้องการของพืช
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
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs">
          {plant ? (
            <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-center gap-3">
              <span className="text-4xl">{plant.emoji}</span>
              <div>
                <h3 className="text-sm font-bold text-stone-800">{plant.name}</h3>
                <p className="text-[11px] text-stone-500 italic">{plant.botanicalName}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="bg-white px-2 py-0.5 rounded-md font-bold text-emerald-800 border border-emerald-200">
                    ระยะ: {stageNames[plot.stage]}
                  </span>
                  <span className="text-stone-500">ความก้าวหน้า: {Math.round(plot.progress)}%</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-center">
              <span className="text-3xl block mb-1">🕳️</span>
              <p className="font-bold text-stone-700">แปลงว่างพร้อมหยอดเมล็ดพันธุ์</p>
              <p className="text-stone-500 text-[11px] mt-0.5">เลือกเครื่องมือหยอดเมล็ดเพื่อเริ่มต้นการปลูก</p>
            </div>
          )}

          {/* Condition Matrix */}
          <div className="grid grid-cols-2 gap-2.5">
            {/* Moisture condition */}
            <div className={`p-3 rounded-xl border ${
              isDry ? 'bg-amber-50 border-amber-300' : isWet ? 'bg-blue-50 border-blue-300' : 'bg-stone-50 border-stone-200'
            }`}>
              <div className="flex items-center justify-between font-bold text-stone-800 mb-1">
                <span className="flex items-center gap-1">
                  <Droplets className="w-3.5 h-3.5 text-blue-500" />
                  <span>ความชื้นในดิน</span>
                </span>
                <span className={isDry ? 'text-amber-700' : isWet ? 'text-blue-700' : 'text-emerald-700'}>
                  {Math.round(plot.moisture)}%
                </span>
              </div>
              <p className="text-[11px] text-stone-500 leading-tight">
                {isDry ? '⚠️ ดินแห้งเกินไป ควรรดน้ำทันที!' : isWet ? '🌊 แฉะเกินไป อาจเกิดโรครากเน่า' : '✅ ชุ่มชื้นกำลังดี พืชดูดซึมอาหารได้ดี'}
              </p>
            </div>

            {/* Sunlight condition */}
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
              <div className="flex items-center justify-between font-bold text-stone-800 mb-1">
                <span className="flex items-center gap-1">
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <span>แสงแดด</span>
                </span>
                <span className="text-amber-600 font-bold">เต็มวัน</span>
              </div>
              <p className="text-[11px] text-stone-500 leading-tight">
                แสงแดดกระตุ้นคลอโรฟิลล์ให้สร้างน้ำตาลเลี้ยงลำต้น
              </p>
            </div>

            {/* Soil Quality & Organic compost */}
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
              <div className="flex items-center justify-between font-bold text-stone-800 mb-1">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>สารอินทรีย์ในดิน</span>
                </span>
                <span className="text-amber-800 font-bold">{plot.soilQuality}%</span>
              </div>
              <p className="text-[11px] text-stone-500 leading-tight">
                {plot.fertilized ? '✨ เติมปุ๋ยหมักชีวภาพแล้ว จุลินทรีย์สมบูรณ์' : 'ใส่ปุ๋ยหมักเพิ่มธาตุอาหารให้พืชโตไว'}
              </p>
            </div>

            {/* Ecosystem Insects */}
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
              <div className="flex items-center justify-between font-bold text-stone-800 mb-1">
                <span className="flex items-center gap-1">
                  <Bug className="w-3.5 h-3.5 text-emerald-600" />
                  <span>แมลงในระบบนิเวศ</span>
                </span>
                <span>
                  {plot.hasBeneficialInsect === 'bee' ? '🐝 ผึ้ง' : plot.hasBeneficialInsect === 'ladybug' ? '🐞 เต่าทอง' : plot.hasPest ? '🐛 มีหนอน' : 'ปกติ'}
                </span>
              </div>
              <p className="text-[11px] text-stone-500 leading-tight">
                {plot.hasPest ? '⚠️ หนอนกินใบ ควรฉีดน้ำหมักสะเดา' : plot.hasBeneficialInsect ? '🌟 แมลงมีประโยชน์ช่วยดูแลแปลงผัก' : 'ไม่มีแมลงรบกวน'}
              </p>
            </div>
          </div>

          {/* Botanical fact if plant planted */}
          {plant && (
            <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200">
              <span className="font-bold text-amber-900 block mb-0.5">💡 ความรู้ธรรมชาติ:</span>
              <p className="text-stone-600 leading-relaxed text-[11px]">{plant.learningFact}</p>
            </div>
          )}

          {/* Quick Actions inside Plot */}
          <div className="pt-2 border-t border-stone-200 space-y-2">
            <span className="font-bold text-stone-700 block text-xs">ดำเนินการดูแลแปลงนี้:</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={() => {
                  onWater(plot);
                  onClose();
                }}
                className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-xl font-bold flex flex-col items-center border border-blue-200 transition-all"
              >
                <Droplets className="w-4 h-4 mb-0.5" />
                <span>รดน้ำ</span>
              </button>

              <button
                onClick={() => {
                  onCompost(plot);
                  onClose();
                }}
                className="p-2 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-xl font-bold flex flex-col items-center border border-amber-200 transition-all"
              >
                <Sparkles className="w-4 h-4 mb-0.5" />
                <span>ใส่ปุ๋ยหมัก</span>
              </button>

              <button
                onClick={() => {
                  onPestControl(plot);
                  onClose();
                }}
                className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-800 rounded-xl font-bold flex flex-col items-center border border-rose-200 transition-all"
              >
                <Bug className="w-4 h-4 mb-0.5" />
                <span>น้ำสะเดา</span>
              </button>

              {isReady ? (
                <button
                  onClick={() => {
                    onHarvest(plot);
                    onClose();
                  }}
                  className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex flex-col items-center shadow-xs animate-bounce"
                >
                  <ShoppingBag className="w-4 h-4 mb-0.5" />
                  <span>เก็บเกี่ยว!</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    onClear(plot);
                    onClose();
                  }}
                  className="p-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-bold flex flex-col items-center border border-stone-200 transition-all"
                >
                  <Shovel className="w-4 h-4 mb-0.5" />
                  <span>ล้างแปลง</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
