/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  X, 
  Wallet, 
  TrendingUp, 
  PiggyBank, 
  Wrench, 
  HeartHandshake, 
  ArrowRightLeft, 
  Clock, 
  Sparkles, 
  CheckCircle2,
  BookOpen,
  DollarSign
} from 'lucide-react';
import { FinancialJars, TransactionRecord } from '../types.ts';
import { playCoinSound, playPopSound } from '../utils/audio.ts';

interface FinancialDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  jars: FinancialJars;
  transactions: TransactionRecord[];
  onTransferFunds: (from: keyof FinancialJars, to: keyof FinancialJars, amount: number) => void;
  onDonateCommunity: (amount: number) => void;
  onUpgradeFarmPlot: () => void;
  plotCount: number;
  upgradeCost: number;
  interestRatePercent: number;
}

export const FinancialDashboard: React.FC<FinancialDashboardProps> = ({
  isOpen,
  onClose,
  jars,
  transactions,
  onTransferFunds,
  onDonateCommunity,
  onUpgradeFarmPlot,
  plotCount,
  upgradeCost,
  interestRatePercent,
}) => {
  const [fromJar, setFromJar] = React.useState<keyof FinancialJars>('operating');
  const [toJar, setToJar] = React.useState<keyof FinancialJars>('savings');
  const [transferAmount, setTransferAmount] = React.useState<number>(50);

  if (!isOpen) return null;

  const totalWealth = jars.operating + jars.savings + jars.development + jars.community;

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (fromJar === toJar || transferAmount <= 0 || jars[fromJar] < transferAmount) return;
    playCoinSound();
    onTransferFunds(fromJar, toJar, transferAmount);
  };

  const jarMeta: Record<keyof FinancialJars, { title: string; desc: string; icon: string; bg: string; border: string; text: string }> = {
    operating: {
      title: 'ทุนหมุนเวียน (Operating)',
      desc: 'ใช้ซื้อเมล็ดพันธุ์ ปุ๋ย และอุปกรณ์จำเป็นในฟาร์ม',
      icon: '🪙',
      bg: 'bg-emerald-50',
      border: 'border-emerald-300',
      text: 'text-emerald-900',
    },
    savings: {
      title: 'เงินออมฉุกเฉิน (Savings)',
      desc: `ฝากสหกรณ์ฟาร์ม รับปันผลดอกเบี้ย ${interestRatePercent}% สม่ำเสมอ`,
      icon: '🏦',
      bg: 'bg-blue-50',
      border: 'border-blue-300',
      text: 'text-blue-900',
    },
    development: {
      title: 'พัฒนาฟาร์ม (Invest)',
      desc: 'สะสมไว้เพื่อขยายแปลงปลูกและเทคโนโลยีเกษตรทันสมัย',
      icon: '🛠️',
      bg: 'bg-amber-50',
      border: 'border-amber-300',
      text: 'text-amber-900',
    },
    community: {
      title: 'แบ่งปันสังคม (Kindness)',
      desc: 'ช่วยเหลือโรงเรียน เพื่อนบ้าน สร้างความสุขและชื่อเสียง',
      icon: '💖',
      bg: 'bg-purple-50',
      border: 'border-purple-300',
      text: 'text-purple-900',
    },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-stone-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-3xl w-full border-2 border-emerald-300 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-2xl shadow-inner">
              💰
            </div>
            <div>
              <h2 className="text-lg font-bold">ห้องเรียนการเงิน & การบริหาร 4 กระปุก</h2>
              <p className="text-xs text-emerald-100">
                เรียนรู้การจัดสรรเงิน ออมเงินฉุกเฉิน และพลังแห่งดอกเบี้ยทบต้น
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

        {/* Modal Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
          {/* Total Wealth Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-emerald-500/15 to-blue-500/15 border border-stone-200 flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-xs text-stone-500 font-medium">สินทรัพย์รวมทั้งหมดของฟาร์ม (Total Wealth)</span>
              <p className="text-2xl sm:text-3xl font-extrabold text-stone-800">
                {totalWealth.toLocaleString()} <span className="text-sm font-semibold text-emerald-600">เหรียญฟาร์ม</span>
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs bg-white/90 px-3 py-2 rounded-xl border border-stone-200 text-stone-700">
              <PiggyBank className="w-4 h-4 text-blue-600" />
              <span>ดอกเบี้ยเงินฝากสหกรณ์: <strong className="text-blue-700">+{interestRatePercent}% ต่อรอบ</strong></span>
            </div>
          </div>

          {/* 4 Jars Grid */}
          <div>
            <h3 className="text-sm font-bold text-stone-800 mb-2.5 flex items-center gap-1.5">
              <span>🏺</span>
              <span>สถานะเงินในกระปุกทั้ง 4 ใบ (The 4 Jars Model)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(Object.keys(jars) as Array<keyof FinancialJars>).map((key) => {
                const meta = jarMeta[key];
                const amount = jars[key];
                const percentage = totalWealth > 0 ? Math.round((amount / totalWealth) * 100) : 0;

                return (
                  <div
                    key={key}
                    className={`p-3.5 rounded-2xl border-2 ${meta.border} ${meta.bg} flex flex-col justify-between`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xl">{meta.icon}</span>
                          <span className={`text-xs font-bold ${meta.text}`}>{meta.title}</span>
                        </div>
                        <span className="text-xs font-bold text-stone-600 bg-white/80 px-2 py-0.5 rounded-md border border-stone-200">
                          {percentage}%
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-600 mt-1">{meta.desc}</p>
                    </div>

                    <div className="mt-3 flex items-baseline justify-between">
                      <span className="text-xl font-extrabold text-stone-800">
                        {amount.toLocaleString()} <span className="text-xs font-medium text-stone-500">🪙</span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Actions: Transfer & Farm Upgrade */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Transfer between jars */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
              <h4 className="text-xs font-bold text-stone-800 mb-2 flex items-center gap-1.5">
                <ArrowRightLeft className="w-4 h-4 text-emerald-600" />
                <span>โอนเงินระหว่างกระปุก (ปรับสัดส่วนการเงิน)</span>
              </h4>

              <form onSubmit={handleTransfer} className="space-y-2.5 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] text-stone-500 block mb-1">จากกระปุก</label>
                    <select
                      value={fromJar}
                      onChange={(e) => setFromJar(e.target.value as keyof FinancialJars)}
                      className="w-full p-2 bg-white border border-stone-300 rounded-xl font-medium text-stone-700"
                    >
                      <option value="operating">🪙 ทุนหมุนเวียน ({jars.operating})</option>
                      <option value="savings">🏦 เงินออมฉุกเฉิน ({jars.savings})</option>
                      <option value="development">🛠️ พัฒนาฟาร์ม ({jars.development})</option>
                      <option value="community">💖 แบ่งปันสังคม ({jars.community})</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] text-stone-500 block mb-1">ไปยังกระปุก</label>
                    <select
                      value={toJar}
                      onChange={(e) => setToJar(e.target.value as keyof FinancialJars)}
                      className="w-full p-2 bg-white border border-stone-300 rounded-xl font-medium text-stone-700"
                    >
                      <option value="operating">🪙 ทุนหมุนเวียน</option>
                      <option value="savings">🏦 เงินออมฉุกเฉิน</option>
                      <option value="development">🛠️ พัฒนาฟาร์ม</option>
                      <option value="community">💖 แบ่งปันสังคม</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type="number"
                      min={1}
                      max={jars[fromJar]}
                      value={transferAmount}
                      onChange={(e) => setTransferAmount(Number(e.target.value))}
                      className="w-full p-2 pl-3 bg-white border border-stone-300 rounded-xl font-bold text-stone-800"
                      placeholder="จำนวนเงิน"
                    />
                    <span className="absolute right-3 top-2 text-stone-400">🪙</span>
                  </div>
                  <button
                    type="submit"
                    disabled={fromJar === toJar || jars[fromJar] < transferAmount}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-stone-300 text-white font-bold rounded-xl transition-all shadow-xs"
                  >
                    โอนเงิน
                  </button>
                </div>
              </form>
            </div>

            {/* Farm Development Upgrade */}
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <h4 className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                    <Wrench className="w-4 h-4 text-amber-600" />
                    <span>ลงทุนขยายแปลงปลูกผัก (Farm Expansion)</span>
                  </h4>
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                    มีแล้ว {plotCount} แปลง
                  </span>
                </div>
                <p className="text-[11px] text-stone-600 leading-relaxed">
                  ใช้เงินจาก <strong>กระปุกพัฒนาฟาร์ม</strong> เพื่อเพิ่มแปลงปลูกใหม่ ปลูกผักได้มากขึ้นและเพิ่มผลผลิตรวม
                </p>
              </div>

              <div className="mt-3 flex items-center justify-between pt-2 border-t border-amber-200">
                <span className="text-xs font-bold text-stone-700">
                  ค่าลงทุน: <strong className="text-amber-700">{upgradeCost.toLocaleString()} 🪙</strong>
                </span>
                <button
                  onClick={() => {
                    playPopSound();
                    onUpgradeFarmPlot();
                  }}
                  disabled={jars.development < upgradeCost}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 disabled:bg-stone-300 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>เพิ่มแปลงปลูก</span>
                </button>
              </div>
            </div>
          </div>

          {/* Educational Life Skills Card */}
          <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-200 text-xs">
            <h4 className="font-bold text-blue-900 mb-1 flex items-center gap-1">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span>เกร็ดความรู้การเงินวัยเยาว์: ดอกเบี้ยทบต้น (Compound Interest)</span>
            </h4>
            <p className="text-stone-600 leading-relaxed">
              เมื่อเราเก็บเงินไว้ใน "กระปุกเงินออมฉุกเฉิน" ทุกๆ ช่วงเวลา สหกรณ์จะมอบดอกเบี้ยปันผลเข้าบัญชีออม ยิ่งเงินต้นมากและเก็บไว้นาน ดอกเบี้ยก็จะสร้างดอกเบี้ยใหม่ขึ้นเรื่อยๆ เรียกว่า <em>"ให้เงินทำงานแทนเรา"</em>
            </p>
          </div>

          {/* Financial Transactions Ledger */}
          <div>
            <h3 className="text-xs font-bold text-stone-800 mb-2 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-stone-500" />
              <span>สมุดบัญชีรายรับ-รายจ่ายของฟาร์ม (Recent Transactions)</span>
            </h3>

            <div className="max-h-44 overflow-y-auto rounded-xl border border-stone-200 divide-y divide-stone-100 text-xs bg-stone-50">
              {transactions.length === 0 ? (
                <div className="text-center py-4 text-stone-400">ยังไม่มีรายการบันทึก</div>
              ) : (
                transactions.slice(0, 10).map((tx) => (
                  <div key={tx.id} className="p-2.5 flex items-center justify-between bg-white hover:bg-stone-50">
                    <div>
                      <p className="font-bold text-stone-800">{tx.title}</p>
                      <p className="text-[10px] text-stone-400">
                        {new Date(tx.timestamp).toLocaleTimeString('th-TH')} • กระปุก: {tx.jar}
                      </p>
                    </div>
                    <span className={`font-extrabold ${
                      tx.type === 'income' || tx.type === 'interest' ? 'text-emerald-600' : 'text-rose-600'
                    }`}>
                      {tx.type === 'income' || tx.type === 'interest' ? '+' : '-'}{tx.amount} 🪙
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
