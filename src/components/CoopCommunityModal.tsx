/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  X, 
  Users, 
  HeartHandshake, 
  Award, 
  Gift, 
  Sparkles, 
  CheckCircle2, 
  Send,
  Droplets,
  Share2
} from 'lucide-react';
import { CoopMember, CoopOrder, InventoryItem } from '../types.ts';
import { PLANT_MAP } from '../data/plants.ts';
import { playFanfareSound, playPopSound, playCoinSound } from '../utils/audio.ts';

interface CoopCommunityModalProps {
  isOpen: boolean;
  onClose: () => void;
  isCoopMode: boolean;
  onToggleCoopMode: () => void;
  members: CoopMember[];
  orders: CoopOrder[];
  inventory: InventoryItem[];
  onContributeOrder: (orderId: string, plantId: string, amount: number) => void;
  onCollectReward: (orderId: string) => void;
  onHelpTeammate: (memberId: string) => void;
  communityPoints: number;
}

export const CoopCommunityModal: React.FC<CoopCommunityModalProps> = ({
  isOpen,
  onClose,
  isCoopMode,
  onToggleCoopMode,
  members,
  orders,
  inventory,
  onContributeOrder,
  onCollectReward,
  onHelpTeammate,
  communityPoints,
}) => {
  const [activeTab, setActiveTab] = React.useState<'orders' | 'members'>('orders');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-stone-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full border-2 border-purple-300 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-2xl shadow-inner">
              🤝
            </div>
            <div>
              <h2 className="text-lg font-bold">สหกรณ์เยาวชนเกษตรรวมใจ (Co-op Community)</h2>
              <p className="text-xs text-purple-100">
                ร่วมมือทำภารกิจเพื่อชุมชน ฝึกฝนการทำงานเป็นทีม (Teamwork) และจิตสาธารณะ
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

        {/* Tab & Mode Switcher */}
        <div className="bg-stone-50 border-b border-stone-200 px-5 py-2.5 flex items-center justify-between">
          <div className="flex gap-2 text-xs font-bold">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeTab === 'orders'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              ภารกิจรวมพลังชุมชน ({orders.filter(o => !o.completed).length})
            </button>
            <button
              onClick={() => setActiveTab('members')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeTab === 'members'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              เพื่อนร่วมทีมสหกรณ์ ({members.length} คน)
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-bold text-purple-900 bg-purple-100 px-2.5 py-1 rounded-full">
            <Award className="w-3.5 h-3.5 text-purple-600" />
            <span>แต้มจิตสาธารณะ: {communityPoints}</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {/* Mode Switch Card */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-purple-900">
                สถานะการเล่น: {isCoopMode ? 'โหมดทีมสหกรณ์ (Cooperative)' : 'โหมดเกษตรกรลุยเดี่ยว (Solo)'}
              </p>
              <p className="text-[11px] text-stone-600">
                {isCoopMode
                  ? 'คุณกำลังร่วมมือกับสมาชิกสหกรณ์ มีเพื่อนๆ มาช่วยรดน้ำและปันผลกำไร'
                  : 'คุณกำลังเล่นคนเดียวตามจังหวะของคุณเอง สามารถเปลี่ยนเป็นโหมดทีมได้ตลอดเวลา'}
              </p>
            </div>
            <button
              onClick={() => {
                playPopSound();
                onToggleCoopMode();
              }}
              className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-xs"
            >
              {isCoopMode ? 'สลับเป็นโหมดเล่นเดี่ยว' : 'เข้าร่วมสหกรณ์ชุมชน'}
            </button>
          </div>

          {/* Tab 1: Orders */}
          {activeTab === 'orders' && (
            <div className="space-y-3">
              {orders.map((order) => {
                const plant = PLANT_MAP.get(order.requiredPlantId);
                const userInv = inventory.find(i => i.plantId === order.requiredPlantId);
                const userHas = userInv ? userInv.quantity : 0;
                const progressPct = Math.min(100, Math.round((order.currentAmount / order.requiredAmount) * 100));

                return (
                  <div
                    key={order.id}
                    className={`p-4 rounded-2xl border-2 transition-all ${
                      order.completed
                        ? 'bg-emerald-50/70 border-emerald-300'
                        : 'bg-white border-stone-200 hover:border-purple-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="text-3xl">{plant ? plant.emoji : '📦'}</span>
                        <div>
                          <h4 className="text-sm font-bold text-stone-800">{order.title}</h4>
                          <p className="text-xs text-stone-500 mt-0.5">{order.description}</p>
                        </div>
                      </div>

                      {order.completed && (
                        <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>สำเร็จแล้ว!</span>
                        </span>
                      )}
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-3 space-y-1">
                      <div className="flex justify-between text-xs text-stone-600 font-medium">
                        <span>ส่งมอบแล้ว {order.currentAmount} / {order.requiredAmount} {plant?.name}</span>
                        <span className="font-bold text-purple-700">{progressPct}%</span>
                      </div>
                      <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-300"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                    </div>

                    {/* Footer Rewards & Action Button */}
                    <div className="mt-3 pt-2.5 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-xs font-semibold text-stone-600">
                        <span className="flex items-center text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                          🪙 ปันผล: +{order.rewardCoins}
                        </span>
                        <span className="flex items-center text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                          💖 แต้มสังคม: +{order.communityPoints}
                        </span>
                      </div>

                      {order.completed ? (
                        !order.rewardCollected ? (
                          <button
                            onClick={() => {
                              playFanfareSound();
                              onCollectReward(order.id);
                            }}
                            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs animate-bounce"
                          >
                            รับเงินปันผลสหกรณ์!
                          </button>
                        ) : (
                          <span className="text-xs font-bold text-stone-400">รับปันผลเรียบร้อย</span>
                        )
                      ) : (
                        <button
                          onClick={() => {
                            if (userHas > 0) {
                              playPopSound();
                              onContributeOrder(order.id, order.requiredPlantId, 1);
                            }
                          }}
                          disabled={userHas <= 0}
                          className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 disabled:bg-stone-200 text-white disabled:text-stone-400 font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>ร่วมส่งมอบ 1 ผลผลิต (มีในคลัง {userHas})</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Tab 2: Teammates */}
          {activeTab === 'members' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="p-3.5 rounded-2xl border border-stone-200 bg-white hover:border-purple-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2.5">
                      <span className="text-3xl">{member.avatar}</span>
                      <div>
                        <h4 className="text-xs font-bold text-stone-800">{member.name}</h4>
                        <p className="text-[10px] text-purple-700 font-medium">{member.role}</p>
                      </div>
                    </div>
                    <p className="text-xs text-stone-600 mt-2 leading-relaxed">{member.bio}</p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-[11px] text-stone-500 font-medium">
                      ช่วยเหลือชุมชน: <strong>{member.contribution} แต้ม</strong>
                    </span>
                    <button
                      onClick={() => {
                        playPopSound();
                        onHelpTeammate(member.id);
                      }}
                      className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-800 text-[11px] font-bold rounded-lg border border-purple-200 transition-all flex items-center gap-1"
                    >
                      <Gift className="w-3 h-3" />
                      <span>ส่งกำลังใจ</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
