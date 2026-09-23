/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  X, 
  BookOpen, 
  Sun, 
  Droplets, 
  Sparkles, 
  Heart, 
  Leaf, 
  HelpCircle,
  Clock
} from 'lucide-react';
import { PlantSpecies, PlantCategory } from '../types.ts';
import { PLANTS_DATA } from '../data/plants.ts';
import { playPopSound } from '../utils/audio.ts';

interface PlantEncyclopediaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PlantEncyclopediaModal: React.FC<PlantEncyclopediaModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedCategory, setSelectedCategory] = React.useState<PlantCategory | 'all'>('all');
  const [activePlant, setActivePlant] = React.useState<PlantSpecies>(PLANTS_DATA[0]);

  if (!isOpen) return null;

  const filteredPlants = selectedCategory === 'all'
    ? PLANTS_DATA
    : PLANTS_DATA.filter(p => p.category === selectedCategory);

  const categories: { id: PlantCategory | 'all'; label: string; icon: string }[] = [
    { id: 'all', label: 'ทั้งหมด', icon: '🌱' },
    { id: 'leafy', label: 'ผักกินใบ', icon: '🥬' },
    { id: 'fruit', label: 'พืชกินผล', icon: '🍅' },
    { id: 'root', label: 'พืชหัวใต้ดิน', icon: '🥕' },
    { id: 'flower', label: 'ไม้ดอกผสมเกสร', icon: '🌻' },
    { id: 'herb', label: 'สมุนไพรไล่แมลง', icon: '🌿' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-stone-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-4xl w-full border-2 border-emerald-300 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-lime-600 px-5 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-2xl shadow-inner">
              📖
            </div>
            <div>
              <h2 className="text-lg font-bold">สารานุกรมพืช & วิทยาศาสตร์ธรรมชาติ</h2>
              <p className="text-xs text-emerald-100">
                เรียนรู้ชีววิทยาพืช แสงแดด น้ำ ดิน และระบบนิเวศน์เกษตรอินทรีย์
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

        {/* Category Filter Bar */}
        <div className="px-5 py-2.5 bg-stone-50 border-b border-stone-200 flex items-center gap-1.5 overflow-x-auto text-xs font-bold">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                playPopSound();
                setSelectedCategory(cat.id);
              }}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Modal Body: Split view (Plant list on left, detailed dossier on right) */}
        <div className="p-4 sm:p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Left: Plant Cards list */}
          <div className="md:col-span-5 space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {filteredPlants.map((plant) => {
              const isSelected = activePlant.id === plant.id;

              return (
                <button
                  key={plant.id}
                  onClick={() => {
                    playPopSound();
                    setActivePlant(plant);
                  }}
                  className={`w-full p-2.5 rounded-2xl border text-left transition-all flex items-center justify-between ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50/90 ring-2 ring-emerald-300 shadow-xs'
                      : 'border-stone-200 bg-white hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-3xl">{plant.emoji}</span>
                    <div>
                      <h4 className="text-xs font-bold text-stone-800">{plant.name}</h4>
                      <p className="text-[10px] text-stone-400 italic">{plant.botanicalName}</p>
                    </div>
                  </div>
                  <div className="text-right text-[11px]">
                    <span className="font-bold text-emerald-700 block">{plant.baseSellPrice} 🪙</span>
                    <span className="text-[10px] text-stone-400">{plant.growthTime} วิ</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right: Detailed Plant Science Dossier */}
          <div className="md:col-span-7 bg-stone-50/80 rounded-2xl p-4 sm:p-5 border border-stone-200 space-y-3.5">
            <div className="flex items-start justify-between pb-3 border-b border-stone-200">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-white border border-stone-200 shadow-sm flex items-center justify-center text-4xl">
                  {activePlant.emoji}
                </div>
                <div>
                  <h3 className="text-base font-bold text-stone-800">{activePlant.name}</h3>
                  <p className="text-xs text-stone-500 italic font-mono">{activePlant.botanicalName}</p>
                  <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200">
                    หมวด: {activePlant.category}
                  </span>
                </div>
              </div>
            </div>

            {/* Environmental Requirements Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200">
                <div className="flex items-center gap-1.5 text-amber-800 font-bold mb-1">
                  <Sun className="w-3.5 h-3.5" />
                  <span>ความต้องการแสงแดด</span>
                </div>
                <p className="text-[11px] text-stone-600">
                  {activePlant.optimalSun === 'full' ? '☀️ แดดจัด (6-8 ชม./วัน)' : activePlant.optimalSun === 'partial' ? '⛅ แดดรำไร (3-5 ชม./วัน)' : '☁️ ร่มเงา'}
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-200">
                <div className="flex items-center gap-1.5 text-blue-800 font-bold mb-1">
                  <Droplets className="w-3.5 h-3.5" />
                  <span>ความชื้นดินที่เหมาะสม</span>
                </div>
                <p className="text-[11px] text-stone-600">
                  💧 {activePlant.minMoisture}% - {activePlant.maxMoisture}%
                </p>
              </div>
            </div>

            {/* Botanical Science & Photosynthesis Fact */}
            <div className="p-3 rounded-xl bg-white border border-emerald-200 text-xs space-y-1">
              <span className="font-bold text-emerald-900 flex items-center gap-1">
                <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                <span>วิทยาศาสตร์ชีววิทยาพืช (Botanical Science)</span>
              </span>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                {activePlant.learningFact}
              </p>
            </div>

            {/* Eco Benefit & Natural Harmony */}
            <div className="p-3 rounded-xl bg-white border border-teal-200 text-xs space-y-1">
              <span className="font-bold text-teal-900 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                <span>คุณประโยชน์ต่อระบบนิเวศน์อินทรีย์ (Eco-benefit)</span>
              </span>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                {activePlant.ecoBenefit}
              </p>
            </div>

            {/* Nutrition & Health */}
            <div className="p-3 rounded-xl bg-white border border-rose-200 text-xs space-y-1">
              <span className="font-bold text-rose-900 flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 text-rose-500" />
                <span>คุณค่าทางโภชนาการสำหรับเยาวชน (Health & Nutrition)</span>
              </span>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                {activePlant.nutritionInfo}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
