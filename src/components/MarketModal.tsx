/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  X, 
  Store, 
  TrendingUp, 
  Coins, 
  ShoppingBag, 
  PieChart,
  ArrowRight,
  Sparkles,
  CheckCircle
} from 'lucide-react';
import { InventoryItem, FinancialJars } from '../types.ts';
import { PLANTS_DATA, PLANT_MAP } from '../data/plants.ts';
import { playCoinSound, playPopSound } from '../utils/audio.ts';

interface MarketModalProps {
  isOpen: boolean;
  onClose: () => void;
  inventory: InventoryItem[];
  jars: FinancialJars;
  onSellCrops: (plantId: string, amount: number, allocation: { operating: number; savings: number; development: number; community: number }) => void;
  marketPriceModifiers: Record<string, number>; // e.g. { morning_glory: 1.15 }
}

export const MarketModal: React.FC<MarketModalProps> = ({
  isOpen,
  onClose,
  inventory,
  jars,
  onSellCrops,
  marketPriceModifiers,
}) => {
  const [selectedCropId, setSelectedCropId] = React.useState<string>('');
  const [sellAmount, setSellAmount] = React.useState<number>(1);
  const [allocationMode, setAllocationMode] = React.useState<'smart_4jars' | 'all_operating'>('smart_4jars');

  React.useEffect(() => {
    if (inventory.length > 0 && (!selectedCropId || !inventory.find(i => i.plantId === selectedCropId))) {
      setSelectedCropId(inventory[0].plantId);
      setSellAmount(1);
    }
  }, [inventory, selectedCropId]);

  if (!isOpen) return null;

  const totalCropsInBasket = inventory.reduce((sum, item) => sum + item.quantity, 0);
  const selectedItem = inventory.find(i => i.plantId === selectedCropId);
  const selectedPlant = selectedCropId ? PLANT_MAP.get(selectedCropId) : null;

  const currentMod = selectedCropId ? (marketPriceModifiers[selectedCropId] || 1.0) : 1.0;
  const unitPrice = selectedPlant ? Math.round(selectedPlant.baseSellPrice * currentMod) : 0;
  const totalRevenue = unitPrice * sellAmount;

  // 4 Jars distribution
  const allocation = allocationMode === 'smart_4jars' 
    ? {
        operating: Math.round(totalRevenue * 0.50), // 50% ทุนหมุนเวียน
        savings: Math.round(totalRevenue * 0.25),   // 25% เงินออมฉุกเฉิน
        development: Math.round(totalRevenue * 0.15), // 15% พัฒนาฟาร์ม
        community: totalRevenue - Math.round(totalRevenue * 0.50) - Math.round(totalRevenue * 0.25) - Math.round(totalRevenue * 0.15), // 10% แบ่งปัน
      }
    : {
        operating: totalRevenue,
        savings: 0,
        development: 0,
        community: 0,
      };

  const handleSell = () => {
    if (!selectedCropId || sellAmount <= 0) return;
    playCoinSound();
    onSellCrops(selectedCropId, sellAmount, allocation);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-stone-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full border-2 border-amber-300 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-2xl shadow-inner">
              🏪
            </div>
            <div>
              <h2 className="text-lg font-bold">ตลาดค้าขายผลผลิตเกษตรอินทรีย์</h2>
              <p className="text-xs text-amber-100">
                เรียนรู้การค้าขาย อุปสงค์-อุปทาน และการแบ่งสัดส่วนรายได้ 4 กระปุก
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
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {/* Basket Overview */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-amber-50/80 border border-amber-200">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-600" />
              <span className="text-sm font-bold text-stone-800">
                ผลผลิตในตะกร้าของคุณ: {totalCropsInBasket} รายการ
              </span>
            </div>
            <span className="text-xs font-medium text-amber-800 bg-amber-100 px-2.5 py-1 rounded-xl">
              ราคาตลาดผันผวนตามอุปสงค์ทุกวัน
            </span>
          </div>

          {/* Crops in basket grid */}
          {inventory.length === 0 ? (
            <div className="text-center py-8 bg-stone-50 rounded-2xl border border-dashed border-stone-300">
              <span className="text-4xl block mb-2">🧺</span>
              <p className="text-sm font-bold text-stone-700">ตะกร้าของคุณยังว่างอยู่</p>
              <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                ดูแลแปลงผักให้เติบโตจนพร้อมเก็บเกี่ยว แล้วนำผลผลิตสดๆ จากฟาร์มมาขายสร้างรายได้ที่นี่นะ!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
              {inventory.map((item) => {
                const plant = PLANT_MAP.get(item.plantId);
                if (!plant) return null;
                const mod = marketPriceModifiers[item.plantId] || 1.0;
                const curPrice = Math.round(plant.baseSellPrice * mod);
                const isSelected = selectedCropId === item.plantId;

                return (
                  <button
                    key={item.plantId}
                    onClick={() => {
                      playPopSound();
                      setSelectedCropId(item.plantId);
                      setSellAmount(1);
                    }}
                    className={`p-2.5 rounded-2xl border text-left transition-all relative ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50/90 ring-2 ring-amber-300 shadow-sm'
                        : 'border-stone-200 bg-white hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <span className="text-2xl">{plant.emoji}</span>
                      <span className="text-xs font-bold text-stone-700 bg-stone-100 px-2 py-0.5 rounded-full">
                        x{item.quantity}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-stone-800 mt-1 truncate">{plant.name}</p>
                    <div className="flex items-center justify-between text-[11px] mt-0.5">
                      <span className="font-semibold text-emerald-700">{curPrice} 🪙/ชิ้น</span>
                      {mod > 1.0 && (
                        <span className="text-[10px] text-amber-600 font-bold flex items-center">
                          <TrendingUp className="w-2.5 h-2.5 mr-0.5" />
                          +{(mod * 100 - 100).toFixed(0)}%
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Sell Controller */}
          {selectedItem && selectedPlant && (
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-3xl">{selectedPlant.emoji}</span>
                  <div>
                    <h3 className="text-sm font-bold text-stone-800">
                      ขาย {selectedPlant.name}
                    </h3>
                    <p className="text-xs text-stone-500">
                      มีในสต็อก {selectedItem.quantity} ชิ้น • ราคาขาย {unitPrice} 🪙 ต่อชิ้น
                    </p>
                  </div>
                </div>

                {/* Quantity selector */}
                <div className="flex items-center gap-1.5 bg-white border border-stone-300 rounded-xl p-1">
                  <button
                    onClick={() => setSellAmount(Math.max(1, sellAmount - 1))}
                    className="w-7 h-7 rounded-lg bg-stone-100 hover:bg-stone-200 font-bold text-stone-700 text-sm flex items-center justify-center"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-bold text-sm text-stone-800">
                    {sellAmount}
                  </span>
                  <button
                    onClick={() => setSellAmount(Math.min(selectedItem.quantity, sellAmount + 1))}
                    className="w-7 h-7 rounded-lg bg-stone-100 hover:bg-stone-200 font-bold text-stone-700 text-sm flex items-center justify-center"
                  >
                    +
                  </button>
                  <button
                    onClick={() => setSellAmount(selectedItem.quantity)}
                    className="text-[11px] font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 px-2 py-1 rounded-lg ml-1"
                  >
                    ทั้งหมด
                  </button>
                </div>
              </div>

              {/* Financial Education: 4 Jars Rule Selection */}
              <div className="border-t border-stone-200 pt-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-stone-800">
                    <PieChart className="w-4 h-4 text-emerald-600" />
                    <span>การแบ่งสัดส่วนเงินที่ได้รับ (ทักษะบริหารการเงิน 4 กระปุก)</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => setAllocationMode('smart_4jars')}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      allocationMode === 'smart_4jars'
                        ? 'border-emerald-500 bg-emerald-50/80 ring-1 ring-emerald-300'
                        : 'border-stone-200 bg-white hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-900">💡 สูตร 4 กระปุกวัยใส (แนะนำ)</span>
                      {allocationMode === 'smart_4jars' && <CheckCircle className="w-4 h-4 text-emerald-600" />}
                    </div>
                    <p className="text-[11px] text-stone-600 mt-1">
                      ทุนหมุนเวียน 50% • ออมฉุกเฉิน 25% • ขยายฟาร์ม 15% • แบ่งปันสังคม 10%
                    </p>
                  </button>

                  <button
                    onClick={() => setAllocationMode('all_operating')}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      allocationMode === 'all_operating'
                        ? 'border-amber-500 bg-amber-50/80 ring-1 ring-amber-300'
                        : 'border-stone-200 bg-white hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-900">🪙 นำเข้าทุนหมุนเวียน 100%</span>
                      {allocationMode === 'all_operating' && <CheckCircle className="w-4 h-4 text-amber-600" />}
                    </div>
                    <p className="text-[11px] text-stone-600 mt-1">
                      เหมาะเมื่อต้องการใช้เงินด่วนเพื่อซื้อเมล็ดพันธุ์จำนวนมาก
                    </p>
                  </button>
                </div>

                {/* Allocation breakdown preview */}
                <div className="mt-3 p-3 bg-white rounded-xl border border-stone-200 text-xs">
                  <div className="flex justify-between items-center mb-1.5 font-bold text-stone-700">
                    <span>รายได้รวมที่จะได้รับ:</span>
                    <span className="text-base text-emerald-600 font-extrabold flex items-center">
                      <Coins className="w-4 h-4 mr-1 text-amber-500" />
                      +{totalRevenue.toLocaleString()} 🪙
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 text-[11px] text-stone-600">
                    <div className="p-1.5 rounded-lg bg-emerald-50 border border-emerald-100">
                      <p className="text-stone-500">ทุนหมุนเวียน</p>
                      <p className="font-bold text-emerald-800">+{allocation.operating} 🪙</p>
                    </div>
                    <div className="p-1.5 rounded-lg bg-blue-50 border border-blue-100">
                      <p className="text-stone-500">เงินออมฉุกเฉิน</p>
                      <p className="font-bold text-blue-800">+{allocation.savings} 🪙</p>
                    </div>
                    <div className="p-1.5 rounded-lg bg-amber-50 border border-amber-100">
                      <p className="text-stone-500">พัฒนาฟาร์ม</p>
                      <p className="font-bold text-amber-800">+{allocation.development} 🪙</p>
                    </div>
                    <div className="p-1.5 rounded-lg bg-purple-50 border border-purple-100">
                      <p className="text-stone-500">แบ่งปันสังคม</p>
                      <p className="font-bold text-purple-800">+{allocation.community} 🪙</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Confirm Sell Button */}
              <button
                onClick={handleSell}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-lime-600 hover:from-emerald-700 hover:to-lime-700 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all transform active:scale-[0.99]"
              >
                <Coins className="w-5 h-5 text-amber-200" />
                <span>ยืนยันการขาย {sellAmount} ชิ้น (รับเงิน {totalRevenue.toLocaleString()} 🪙)</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
