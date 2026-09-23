/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Droplets, 
  Sprout, 
  Sparkles, 
  Bug, 
  ShoppingBag, 
  Search,
  Check,
  Shovel
} from 'lucide-react';
import { ToolType, PlantSpecies } from '../types.ts';
import { PLANTS_DATA } from '../data/plants.ts';
import { playPopSound } from '../utils/audio.ts';

interface ActionToolbarProps {
  selectedTool: ToolType;
  onSelectTool: (tool: ToolType) => void;
  selectedSeedId: string;
  onSelectSeedId: (id: string) => void;
  operatingBalance: number;
}

export const ActionToolbar: React.FC<ActionToolbarProps> = ({
  selectedTool,
  onSelectTool,
  selectedSeedId,
  onSelectSeedId,
  operatingBalance,
}) => {
  const [showSeedPicker, setShowSeedPicker] = React.useState(false);

  const selectedPlant = PLANTS_DATA.find(p => p.id === selectedSeedId) || PLANTS_DATA[0];

  const tools: { id: ToolType; label: string; sub: string; icon: React.ReactNode; color: string }[] = [
    {
      id: 'inspect',
      label: 'ตรวจแปลง',
      sub: 'ดูดิน/น้ำ/แสง',
      icon: <Search className="w-5 h-5" />,
      color: 'hover:bg-sky-50 text-sky-700 border-sky-300',
    },
    {
      id: 'seed',
      label: 'หยอดเมล็ด',
      sub: selectedPlant ? `${selectedPlant.name} (${selectedPlant.seedCost}🪙)` : 'เลือกเมล็ด',
      icon: <Sprout className="w-5 h-5 text-emerald-600" />,
      color: 'hover:bg-emerald-50 text-emerald-700 border-emerald-300',
    },
    {
      id: 'water',
      label: 'รดน้ำแปลง',
      sub: 'รักษาความชื้น',
      icon: <Droplets className="w-5 h-5 text-blue-500" />,
      color: 'hover:bg-blue-50 text-blue-700 border-blue-300',
    },
    {
      id: 'compost',
      label: 'ปุ๋ยหมักชีวภาพ',
      sub: 'เพิ่มอินทรียวัตถุ',
      icon: <Sparkles className="w-5 h-5 text-amber-600" />,
      color: 'hover:bg-amber-50 text-amber-700 border-amber-300',
    },
    {
      id: 'natural_pest',
      label: 'สมุนไพรสะเดา/เต่าทอง',
      sub: 'กำจัดหนอนธรรมชาติ',
      icon: <Bug className="w-5 h-5 text-rose-500" />,
      color: 'hover:bg-rose-50 text-rose-700 border-rose-300',
    },
    {
      id: 'harvest',
      label: 'เก็บเกี่ยวผลผลิต',
      sub: 'เก็บใส่ตะกร้า',
      icon: <ShoppingBag className="w-5 h-5 text-purple-600" />,
      color: 'hover:bg-purple-50 text-purple-700 border-purple-300',
    },
    {
      id: 'shovel',
      label: 'พรวนดิน/เตรียมแปลง',
      sub: 'ล้างแปลงพร้อมปลูก',
      icon: <Shovel className="w-5 h-5 text-stone-600" />,
      color: 'hover:bg-stone-50 text-stone-700 border-stone-300',
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-2 sm:px-4 py-2">
      {/* Seed Selection Drawer if seed tool is active or clicked */}
      {selectedTool === 'seed' && (
        <div className="mb-3 p-3 bg-white/95 rounded-2xl border-2 border-emerald-300 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">🌱</span>
              <span className="text-sm font-bold text-stone-800">
                เลือกเมล็ดพันธุ์พืชอินทรีย์ที่ต้องการปลูก
              </span>
              <span className="text-xs text-stone-500 hidden sm:inline">
                (ใช้ทุนหมุนเวียน {operatingBalance.toLocaleString()} 🪙)
              </span>
            </div>
            <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              พืชแต่ละชนิดต้องการแสงและน้ำต่างกัน
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {PLANTS_DATA.map((plant) => {
              const canAfford = operatingBalance >= plant.seedCost;
              const isSelected = selectedSeedId === plant.id;

              return (
                <button
                  key={plant.id}
                  onClick={() => {
                    playPopSound();
                    onSelectSeedId(plant.id);
                  }}
                  className={`p-2 rounded-xl text-left transition-all border relative flex flex-col justify-between ${
                    isSelected
                      ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-300 shadow-xs'
                      : canAfford
                      ? 'bg-stone-50/80 hover:bg-stone-100/90 border-stone-200'
                      : 'bg-stone-100/50 border-stone-200 opacity-60 cursor-not-allowed'
                  }`}
                  title={`${plant.name} - ${plant.ecoBenefit}`}
                >
                  <div className="flex items-start justify-between">
                    <span className="text-2xl">{plant.emoji}</span>
                    <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-md ${
                      canAfford ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-700'
                    }`}>
                      {plant.seedCost} 🪙
                    </span>
                  </div>
                  <div className="mt-1">
                    <p className="text-xs font-bold text-stone-800 truncate">{plant.name}</p>
                    <div className="flex items-center justify-between text-[10px] text-stone-500 mt-0.5">
                      <span>โต {plant.growthTime} วิ</span>
                      <span>ขาย {plant.baseSellPrice} 🪙</span>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="absolute top-1 right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center text-white">
                      <Check className="w-2.5 h-2.5" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Tool Palette */}
      <div className="bg-white/95 rounded-2xl border border-amber-200 shadow-sm p-1.5 sm:p-2">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-1 sm:gap-2">
          {tools.map((tool) => {
            const isActive = selectedTool === tool.id;

            return (
              <button
                key={tool.id}
                id={`tool-${tool.id}`}
                onClick={() => {
                  playPopSound();
                  onSelectTool(tool.id);
                }}
                className={`flex flex-col items-center justify-center py-2 px-1.5 rounded-xl border text-center transition-all ${
                  isActive
                    ? 'bg-amber-500 text-white border-amber-600 shadow-sm ring-2 ring-amber-300 scale-[1.02]'
                    : `bg-stone-50/60 border-stone-200/90 text-stone-700 ${tool.color}`
                }`}
              >
                <div className={`p-1 rounded-lg ${isActive ? 'text-white' : ''}`}>
                  {tool.icon}
                </div>
                <span className="text-xs font-bold mt-0.5 leading-tight">{tool.label}</span>
                <span className={`text-[10px] truncate max-w-[95%] hidden sm:block ${
                  isActive ? 'text-amber-100' : 'text-stone-400'
                }`}>
                  {tool.sub}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
