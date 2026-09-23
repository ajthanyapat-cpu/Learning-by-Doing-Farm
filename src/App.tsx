/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import confetti from 'canvas-confetti';
import { 
  FarmPlot, 
  FinancialJars, 
  InventoryItem, 
  ToolType, 
  WeatherState, 
  TransactionRecord, 
  ScamEvent, 
  CoopOrder, 
  CoopMember 
} from './types.ts';
import { PLANTS_DATA, PLANT_MAP } from './data/plants.ts';
import { SCAM_SCENARIOS } from './data/scams.ts';
import { COOP_MEMBERS, INITIAL_COOP_ORDERS } from './data/coop.ts';
import { 
  playWaterSound, 
  playHarvestSound, 
  playCoinSound, 
  playPopSound, 
  playAlertSound, 
  playFanfareSound 
} from './utils/audio.ts';

import { Navbar } from './components/Navbar.tsx';
import { ActionToolbar } from './components/ActionToolbar.tsx';
import { FarmGrid } from './components/FarmGrid.tsx';
import { MarketModal } from './components/MarketModal.tsx';
import { FinancialDashboard } from './components/FinancialDashboard.tsx';
import { ScamShieldModal } from './components/ScamShieldModal.tsx';
import { CoopCommunityModal } from './components/CoopCommunityModal.tsx';
import { PlantEncyclopediaModal } from './components/PlantEncyclopediaModal.tsx';
import { AiAdvisorModal } from './components/AiAdvisorModal.tsx';
import { PlotDetailModal } from './components/PlotDetailModal.tsx';

const WEATHER_PRESETS: WeatherState[] = [
  {
    type: 'sunny',
    label: 'แดดจัดเจิดจ้า',
    sunlightMultiplier: 1.25,
    evaporationRate: 0.9,
    description: 'แสงแดดจัดเต็มวัน พืชสังเคราะห์แสงได้รวดเร็ว ดินระเหยน้ำไว ควรรดน้ำสม่ำเสมอ',
  },
  {
    type: 'partly_cloudy',
    label: 'แดดรำไร เมฆโปร่ง',
    sunlightMultiplier: 1.0,
    evaporationRate: 0.5,
    description: 'สภาพอากาศอบอุ่นกำลังดี เหมาะกับผักใบและพืชทุกชนิด',
  },
  {
    type: 'rainy',
    label: 'ฝนตกชุ่มฉ่ำ',
    sunlightMultiplier: 0.8,
    evaporationRate: -1.2, // Increases moisture!
    description: 'สายฝนธรรมชาติช่วยรดน้ำแปลงผักฟรี ชุ่มชื้นทั่วถึงทั้งฟาร์ม',
  },
  {
    type: 'breezy',
    label: 'ลมพัดเย็นสบาย',
    sunlightMultiplier: 1.05,
    evaporationRate: 0.6,
    description: 'อากาศถ่ายเทดี แมลงผสมเกสรบินว่อน ช่วยผสมพันธุ์พืชในฟาร์ม',
  },
];

export default function App() {
  // Farm Plots State (Starts with 8 plots)
  const [plots, setPlots] = React.useState<FarmPlot[]>(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      id: i,
      plantId: i === 0 ? 'morning_glory' : i === 1 ? 'cherry_tomato' : null,
      stage: i === 0 ? 3 : i === 1 ? 2 : 0,
      progress: i === 0 ? 60 : i === 1 ? 30 : 0,
      moisture: 55,
      soilQuality: 75,
      sunExposure: 'full',
      hasPest: false,
      hasBeneficialInsect: i === 1 ? 'bee' : null,
      lastWateredTime: Date.now(),
      plantedAt: Date.now(),
      health: 100,
      isDead: false,
      fertilized: i === 0,
    }));
  });

  // Tools & Selection
  const [selectedTool, setSelectedTool] = React.useState<ToolType>('water');
  const [selectedSeedId, setSelectedSeedId] = React.useState<string>('morning_glory');

  // Harvest Basket / Inventory
  const [inventory, setInventory] = React.useState<InventoryItem[]>([
    { plantId: 'morning_glory', quantity: 2 },
    { plantId: 'green_lettuce', quantity: 1 },
  ]);

  // Financial 4-Jars Model State
  const [jars, setJars] = React.useState<FinancialJars>({
    operating: 160,
    savings: 80,
    development: 60,
    community: 30,
  });

  // Financial Ledger
  const [transactions, setTransactions] = React.useState<TransactionRecord[]>([
    {
      id: 'tx-init',
      timestamp: Date.now() - 60000,
      type: 'income',
      jar: 'operating',
      amount: 160,
      title: 'เงินทุนประเดิมเริ่มต้นฟาร์มสุข',
      note: 'เริ่มต้นทำเกษตรอินทรีย์',
    },
  ]);

  // Weather & Time
  const [weatherIndex, setWeatherIndex] = React.useState(0);
  const [timeOfDay, setTimeOfDay] = React.useState<'morning' | 'afternoon' | 'evening'>('morning');
  const [dayCount, setDayCount] = React.useState(1);
  const [savingsInterestAccrued, setSavingsInterestAccrued] = React.useState(0);

  // Market dynamic prices
  const [marketPriceModifiers, setMarketPriceModifiers] = React.useState<Record<string, number>>({
    morning_glory: 1.1,
    cherry_tomato: 1.25,
    strawberry: 1.15,
  });

  // Cooperative Team Mode State
  const [isCoopMode, setIsCoopMode] = React.useState(true);
  const [coopMembers, setCoopMembers] = React.useState<CoopMember[]>(COOP_MEMBERS);
  const [coopOrders, setCoopOrders] = React.useState<CoopOrder[]>(INITIAL_COOP_ORDERS);
  const [communityPoints, setCommunityPoints] = React.useState(45);

  // Scam Awareness & Safety System State
  const [activeScam, setActiveScam] = React.useState<ScamEvent | null>(null);
  const [safetyScore, setSafetyScore] = React.useState(40);
  const [resolvedScamsCount, setResolvedScamsCount] = React.useState(1);

  // Modals Visibility
  const [isMarketOpen, setIsMarketOpen] = React.useState(false);
  const [isFinanceOpen, setIsFinanceOpen] = React.useState(false);
  const [isScamShieldOpen, setIsScamShieldOpen] = React.useState(false);
  const [isCoopOpen, setIsCoopOpen] = React.useState(false);
  const [isEncyclopediaOpen, setIsEncyclopediaOpen] = React.useState(false);
  const [isAiAdvisorOpen, setIsAiAdvisorOpen] = React.useState(false);
  const [inspectingPlot, setInspectingPlot] = React.useState<FarmPlot | null>(null);

  // Toast / Status banner
  const [notification, setNotification] = React.useState<string | null>(
    'ยินดีต้อนรับสู่ ฟาร์มสุข เกษตรวัยใส! ทดลองรดน้ำแปลงผัก หรือคลิกที่ตลาดเพื่อซื้อขายผลผลิตได้เลย'
  );

  const currentWeather = WEATHER_PRESETS[weatherIndex];

  // Helper to show notifications
  const showToast = (msg: string) => {
    setNotification(msg);
  };

  // Add transaction helper
  const addTransaction = (
    type: 'income' | 'expense' | 'transfer' | 'interest' | 'donation',
    jar: keyof FinancialJars,
    amount: number,
    title: string,
    note?: string
  ) => {
    const newTx: TransactionRecord = {
      id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: Date.now(),
      type,
      jar,
      amount,
      title,
      note,
    };
    setTransactions((prev) => [newTx, ...prev.slice(0, 30)]);
  };

  // Game Simulation Loop
  React.useEffect(() => {
    const timer = setInterval(() => {
      setPlots((prevPlots) =>
        prevPlots.map((plot) => {
          if (plot.stage === 0) return plot;

          const plant = plot.plantId ? PLANT_MAP.get(plot.plantId) : null;
          if (!plant) return plot;

          // 1. Moisture change
          let newMoisture = plot.moisture;
          if (currentWeather.type === 'rainy') {
            newMoisture = Math.min(95, newMoisture + 2.0); // Rain waters plants
          } else {
            newMoisture = Math.max(0, newMoisture - currentWeather.evaporationRate);
          }

          // 2. Growth calculation
          // Optimal moisture range check
          const isGoodMoisture = newMoisture >= plant.minMoisture && newMoisture <= plant.maxMoisture;
          const isSeverelyDry = newMoisture < 15;
          const isSeverelyWet = newMoisture > 92;

          let growthRate = 1.0;
          if (isGoodMoisture) growthRate += 0.3;
          if (plot.fertilized) growthRate += 0.25; // Compost bonus
          if (plot.hasBeneficialInsect === 'bee') growthRate += 0.3; // Pollination bonus
          if (plot.hasPest) growthRate -= 0.5; // Pest damage
          if (isSeverelyDry || isSeverelyWet) growthRate = 0.1; // Stunted

          // Calculate growth increment per second
          const progressInc = (100 / plant.growthTime) * growthRate * currentWeather.sunlightMultiplier;
          const newProgress = Math.min(100, plot.progress + progressInc);

          // Update stage based on progress
          let newStage = plot.stage;
          if (newProgress >= 100) newStage = 5;
          else if (newProgress >= 75) newStage = 4;
          else if (newProgress >= 40) newStage = 3;
          else if (newProgress >= 15) newStage = 2;
          else newStage = 1;

          // Random chance for beneficial bee/ladybug if flowering and composted
          let insect = plot.hasBeneficialInsect;
          if (!insect && newStage >= 3 && Math.random() < 0.03) {
            insect = Math.random() > 0.5 ? 'bee' : 'ladybug';
          }

          // Random pest appearance if not sprayed/fertilized
          let pest = plot.hasPest;
          if (!pest && !plot.fertilized && Math.random() < 0.015) {
            pest = true;
          }

          return {
            ...plot,
            moisture: newMoisture,
            progress: newProgress,
            stage: newStage,
            hasBeneficialInsect: insect,
            hasPest: pest,
          };
        })
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [currentWeather]);

  // Weather & Time Cycle Loop (every 30 seconds for engaging dynamics)
  React.useEffect(() => {
    const cycleTimer = setInterval(() => {
      setTimeOfDay((prevTime) => {
        if (prevTime === 'morning') return 'afternoon';
        if (prevTime === 'afternoon') return 'evening';
        // Evening -> Morning (New Day!)
        setDayCount((d) => d + 1);
        // Change weather on new day
        setWeatherIndex((w) => (w + 1) % WEATHER_PRESETS.length);

        // Fluctuate market prices
        setMarketPriceModifiers({
          morning_glory: Number((0.9 + Math.random() * 0.4).toFixed(2)),
          green_lettuce: Number((0.85 + Math.random() * 0.45).toFixed(2)),
          cherry_tomato: Number((0.95 + Math.random() * 0.4).toFixed(2)),
          sweet_carrot: Number((0.9 + Math.random() * 0.35).toFixed(2)),
          sweet_corn: Number((0.9 + Math.random() * 0.35).toFixed(2)),
          strawberry: Number((0.85 + Math.random() * 0.5).toFixed(2)),
          watermelon: Number((0.9 + Math.random() * 0.45).toFixed(2)),
          sunflower: Number((0.95 + Math.random() * 0.35).toFixed(2)),
        });

        // Savings compound interest payout every day
        setJars((currentJars) => {
          if (currentJars.savings <= 0) return currentJars;
          const interestGained = Math.max(1, Math.round(currentJars.savings * 0.04));
          addTransaction('interest', 'savings', interestGained, 'ดอกเบี้ยเงินฝากสหกรณ์ฟาร์ม');
          setSavingsInterestAccrued(interestGained);
          setTimeout(() => setSavingsInterestAccrued(0), 4000);
          showToast(`🏦 สหกรณ์ฟาร์มจ่ายดอกเบี้ยเงินออมฉุกเฉินให้คุณ +${interestGained} 🪙!`);
          return {
            ...currentJars,
            savings: currentJars.savings + interestGained,
          };
        });

        // Co-op AI friend visit in cooperative mode
        if (isCoopMode && Math.random() < 0.6) {
          const helpers = ['น้องมะลิ', 'ลุงสมชาย', 'พี่กล้า'];
          const randomHelper = helpers[Math.floor(Math.random() * helpers.length)];
          showToast(`🤝 ${randomHelper} จากสหกรณ์ แวะมาช่วยตรวจแปลงผักและรดน้ำให้คุณ!`);
          setPlots((prev) =>
            prev.map((p) => {
              if (p.moisture < 40) return { ...p, moisture: 65 };
              return p;
            })
          );
        }

        return 'morning';
      });
    }, 30000);

    return () => clearInterval(cycleTimer);
  }, [isCoopMode]);

  // Periodic Scam Awareness Simulation Trigger (every 65 seconds)
  React.useEffect(() => {
    const scamTimer = setInterval(() => {
      if (!activeScam && Math.random() < 0.8) {
        const randomScam = SCAM_SCENARIOS[Math.floor(Math.random() * SCAM_SCENARIOS.length)];
        setActiveScam(randomScam);
        playAlertSound();
        showToast(`🚨 มีข้อความน่าสงสัยเข้ามา! ตรวจสอบที่เมนู "รู้ทันโกง" ด่วน!`);
      }
    }, 65000);

    return () => clearInterval(scamTimer);
  }, [activeScam]);

  // Handling Tool Actions on Farm Plots
  const handlePlotClick = (plot: FarmPlot) => {
    switch (selectedTool) {
      case 'inspect':
        setInspectingPlot(plot);
        playPopSound();
        break;

      case 'seed': {
        if (plot.stage > 0) {
          showToast('แปลงนี้มีพืชปลูกอยู่แล้ว! กรุณารอเก็บเกี่ยวหรือใช้พลั่วเคลียร์แปลง');
          playPopSound();
          return;
        }

        const plant = PLANT_MAP.get(selectedSeedId);
        if (!plant) return;

        if (jars.operating < plant.seedCost) {
          showToast(`เงินทุนหมุนเวียนไม่พอซื้อเมล็ด ${plant.name} (ต้องการ ${plant.seedCost} 🪙)`);
          playPopSound();
          return;
        }

        // Deduct seed cost from operating jar
        setJars((prev) => ({
          ...prev,
          operating: prev.operating - plant.seedCost,
        }));
        addTransaction('expense', 'operating', plant.seedCost, `ซื้อเมล็ดพันธุ์ ${plant.name}`);

        // Plant seed
        setPlots((prev) =>
          prev.map((p) =>
            p.id === plot.id
              ? {
                  ...p,
                  plantId: plant.id,
                  stage: 1,
                  progress: 0,
                  plantedAt: Date.now(),
                  fertilized: false,
                  hasPest: false,
                  hasBeneficialInsect: null,
                }
              : p
          )
        );

        playPopSound();
        showToast(`🌱 หยอดเมล็ดพันธุ์ ${plant.name} สำเร็จ! หมั่นรดน้ำให้ชุ่มชื้นนะ`);
        break;
      }

      case 'water': {
        playWaterSound();
        setPlots((prev) =>
          prev.map((p) =>
            p.id === plot.id
              ? {
                  ...p,
                  moisture: Math.min(85, p.moisture + 30),
                  lastWateredTime: Date.now(),
                }
              : p
          )
        );
        showToast('💦 รดน้ำแปลงผักเรียบร้อย! ดินชุ่มชื้นพอดี พืชสังเคราะห์แสงได้เต็มที่');
        break;
      }

      case 'compost': {
        playPopSound();
        setPlots((prev) =>
          prev.map((p) =>
            p.id === plot.id
              ? {
                  ...p,
                  soilQuality: Math.min(100, p.soilQuality + 20),
                  fertilized: true,
                }
              : p
          )
        );
        showToast('✨ ใส่ปุ๋ยหมักชีวภาพอินทรีย์แล้ว! ดินร่วนซุย จุลินทรีย์ดีช่วยให้พืชโตไวขึ้น');
        break;
      }

      case 'natural_pest': {
        playPopSound();
        setPlots((prev) =>
          prev.map((p) =>
            p.id === plot.id
              ? {
                  ...p,
                  hasPest: false,
                  hasBeneficialInsect: 'ladybug',
                }
              : p
          )
        );
        showToast('🐞 ใช้น้ำสะเดาธรรมชาติและปล่อยแมลงเต่าทอง! ไล่หนอนสำเร็จ ไร้สารเคมีตกค้าง');
        break;
      }

      case 'harvest': {
        if (plot.stage < 5 || !plot.plantId) {
          showToast('พืชยังไม่โตเต็มที่ ยังเก็บเกี่ยวไม่ได้นะ!');
          playPopSound();
          return;
        }

        const plant = PLANT_MAP.get(plot.plantId);
        if (!plant) return;

        // Visual celebration
        playHarvestSound();
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#10b981', '#f59e0b', '#3b82f6', '#ec4899'],
        });

        // Add to inventory
        setInventory((prev) => {
          const existing = prev.find((i) => i.plantId === plant.id);
          if (existing) {
            return prev.map((i) =>
              i.plantId === plant.id ? { ...i, quantity: i.quantity + 1 } : i
            );
          }
          return [...prev, { plantId: plant.id, quantity: 1 }];
        });

        // Reset plot
        setPlots((prev) =>
          prev.map((p) =>
            p.id === plot.id
              ? {
                  ...p,
                  plantId: null,
                  stage: 0,
                  progress: 0,
                  fertilized: false,
                  hasPest: false,
                  hasBeneficialInsect: null,
                }
              : p
          )
        );

        showToast(`🧺 เก็บเกี่ยว ${plant.name} สดๆ ใส่ตะกร้าแล้ว! นำไปขายที่ตลาดหรือส่งสหกรณ์ได้เลย`);
        break;
      }

      case 'shovel': {
        playPopSound();
        setPlots((prev) =>
          prev.map((p) =>
            p.id === plot.id
              ? {
                  ...p,
                  plantId: null,
                  stage: 0,
                  progress: 0,
                  fertilized: false,
                  hasPest: false,
                  hasBeneficialInsect: null,
                }
              : p
          )
        );
        showToast('⛏️ พรวนดินและเคลียร์แปลงใหม่เรียบร้อย พร้อมสำหรับหยอดเมล็ดพันธุ์ถัดไป');
        break;
      }
    }
  };

  // Selling Crops in Market
  const handleSellCrops = (
    plantId: string,
    amount: number,
    allocation: { operating: number; savings: number; development: number; community: number }
  ) => {
    const plant = PLANT_MAP.get(plantId);
    if (!plant) return;

    // Deduct from inventory
    setInventory((prev) =>
      prev
        .map((item) =>
          item.plantId === plantId ? { ...item, quantity: item.quantity - amount } : item
        )
        .filter((item) => item.quantity > 0)
    );

    // Add to 4 Jars
    setJars((prev) => ({
      operating: prev.operating + allocation.operating,
      savings: prev.savings + allocation.savings,
      development: prev.development + allocation.development,
      community: prev.community + allocation.community,
    }));

    const totalCoins =
      allocation.operating + allocation.savings + allocation.development + allocation.community;
    addTransaction('income', 'operating', totalCoins, `ขาย ${plant.name} x${amount} ชิ้น (จัดสรร 4 กระปุก)`);

    showToast(`💰 ขาย ${plant.name} สำเร็จ! ได้รับ ${totalCoins} 🪙 แบ่งเข้ากระปุกทั้ง 4 เรียบร้อย`);
  };

  // Transfer Funds Between 4 Jars
  const handleTransferFunds = (from: keyof FinancialJars, to: keyof FinancialJars, amount: number) => {
    if (jars[from] < amount) return;

    setJars((prev) => ({
      ...prev,
      [from]: prev[from] - amount,
      [to]: prev[to] + amount,
    }));

    addTransaction('transfer', to, amount, `โอนเงินจาก ${from} ไปยัง ${to}`);
    showToast(`โอนเงิน ${amount} 🪙 จากกระปุก ${from} ไปยัง ${to} เรียบร้อย!`);
  };

  // Upgrading / Expanding Farm Plots using Development Jar
  const upgradeCost = 80;
  const handleUpgradeFarmPlot = () => {
    if (jars.development < upgradeCost) {
      showToast(`เงินในกระปุกพัฒนาฟาร์มไม่พอ (ต้องการ ${upgradeCost} 🪙)`);
      return;
    }

    setJars((prev) => ({
      ...prev,
      development: prev.development - upgradeCost,
    }));

    addTransaction('expense', 'development', upgradeCost, 'ลงทุนขยายแปลงปลูกผักใหม่');

    const newId = plots.length;
    setPlots((prev) => [
      ...prev,
      {
        id: newId,
        plantId: null,
        stage: 0,
        progress: 0,
        moisture: 55,
        soilQuality: 75,
        sunExposure: 'full',
        hasPest: false,
        hasBeneficialInsect: null,
        lastWateredTime: Date.now(),
        plantedAt: Date.now(),
        health: 100,
        isDead: false,
        fertilized: false,
      },
    ]);

    playFanfareSound();
    showToast(`🎉 ขยายแปลงผักสำเร็จ! ตอนนี้ฟาร์มมีทั้งหมด ${plots.length + 1} แปลงแล้ว!`);
  };

  // Resolve Scam Encounter
  const handleResolveScam = (scamId: string, madeSafeChoice: boolean) => {
    if (madeSafeChoice && activeScam) {
      setSafetyScore((s) => s + 20);
      setResolvedScamsCount((c) => c + 1);
      setJars((prev) => ({
        ...prev,
        operating: prev.operating + activeScam.rewardCoins,
      }));
      addTransaction('income', 'operating', activeScam.rewardCoins, 'รางวัลรู้ทันมิจฉาชีพไซเบอร์');
      showToast(`🌟 ยอดเยี่ยม! คุณรู้ทันกลลวงและปกป้องฟาร์มสำเร็จ รับรางวัล +${activeScam.rewardCoins} 🪙`);
    } else {
      showToast(`⚠️ เรียนรู้ข้อคิดเตือนใจจากสถานการณ์ เพื่อสร้างภูมิคุ้มกันในชีวิตจริงนะ!`);
    }
    setActiveScam(null);
  };

  // Co-op Order Contribution
  const handleContributeOrder = (orderId: string, plantId: string, amount: number) => {
    const item = inventory.find((i) => i.plantId === plantId);
    if (!item || item.quantity < amount) return;

    // Deduct inventory
    setInventory((prev) =>
      prev
        .map((i) => (i.plantId === plantId ? { ...i, quantity: i.quantity - amount } : i))
        .filter((i) => i.quantity > 0)
    );

    // Update order progress
    setCoopOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const updated = ord.currentAmount + amount;
          const completed = updated >= ord.requiredAmount;
          return {
            ...ord,
            currentAmount: updated,
            completed,
          };
        }
        return ord;
      })
    );

    setCommunityPoints((p) => p + 10);
    showToast('💖 ส่งมอบผลผลิตร่วมกับสหกรณ์แล้ว! ได้รับแต้มจิตสาธารณะ +10');
  };

  // Collect Co-op Dividend
  const handleCollectCoopReward = (orderId: string) => {
    const ord = coopOrders.find((o) => o.id === orderId);
    if (!ord || !ord.completed || ord.rewardCollected) return;

    setCoopOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, rewardCollected: true } : o))
    );

    setJars((prev) => ({
      ...prev,
      operating: prev.operating + ord.rewardCoins,
    }));
    setCommunityPoints((p) => p + ord.communityPoints);
    addTransaction('income', 'operating', ord.rewardCoins, `เงินปันผลสหกรณ์: ${ord.title}`);

    showToast(`🎉 รับเงินปันผลภารกิจสหกรณ์ +${ord.rewardCoins} 🪙 และแต้มชุมชน +${ord.communityPoints}!`);
  };

  const handleHelpTeammate = (memberId: string) => {
    setCoopMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, contribution: m.contribution + 15 } : m))
    );
    setCommunityPoints((p) => p + 5);
    showToast(`💌 ส่งกำลังใจและปุ๋ยหมักให้เพื่อนร่วมทีมสหกรณ์เรียบร้อย!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-lime-50/30 to-amber-100/40 text-stone-800 flex flex-col font-['Mitr',sans-serif]">
      {/* Top Navigation */}
      <Navbar
        weather={currentWeather}
        timeOfDay={timeOfDay}
        dayCount={dayCount}
        jars={jars}
        isCoopMode={isCoopMode}
        onToggleCoopMode={() => setIsCoopMode(!isCoopMode)}
        onOpenMarket={() => setIsMarketOpen(true)}
        onOpenFinance={() => setIsFinanceOpen(true)}
        onOpenScamShield={() => setIsScamShieldOpen(true)}
        onOpenCoop={() => setIsCoopOpen(true)}
        onOpenEncyclopedia={() => setIsEncyclopediaOpen(true)}
        onOpenAiAdvisor={() => setIsAiAdvisorOpen(true)}
        hasUnreadScam={!!activeScam}
        savingsInterestAccrued={savingsInterestAccrued}
      />

      {/* Main Interactive Stage */}
      <main className="flex-1 w-full max-w-7xl mx-auto py-2 flex flex-col justify-between">
        {/* Toast / Notification Banner */}
        {notification && (
          <div className="w-full max-w-5xl mx-auto px-2 sm:px-4 mb-1">
            <div className="p-2.5 rounded-2xl bg-amber-100/90 border border-amber-300 text-xs font-medium text-amber-900 shadow-2xs flex items-center justify-between gap-2 animate-fade-in">
              <div className="flex items-center gap-2">
                <span className="text-base">📢</span>
                <span className="leading-tight">{notification}</span>
              </div>
              <button
                onClick={() => setNotification(null)}
                className="text-amber-700 hover:text-amber-950 font-bold px-1.5 py-0.5 rounded-md hover:bg-amber-200/50"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Action Toolbar */}
        <ActionToolbar
          selectedTool={selectedTool}
          onSelectTool={setSelectedTool}
          selectedSeedId={selectedSeedId}
          onSelectSeedId={setSelectedSeedId}
          operatingBalance={jars.operating}
        />

        {/* Interactive Farm Grid */}
        <FarmGrid
          plots={plots}
          selectedTool={selectedTool}
          onPlotClick={handlePlotClick}
          onOpenPlotDetail={(plot) => setInspectingPlot(plot)}
        />

        {/* Quick Footer Educational Strip */}
        <footer className="w-full max-w-5xl mx-auto px-2 sm:px-4 py-3 text-center text-xs text-stone-500">
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 bg-white/70 py-2 px-4 rounded-2xl border border-amber-200 shadow-2xs">
            <span className="flex items-center gap-1">
              <span>🌾</span>
              <strong>เกษตรอินทรีย์ 100%:</strong> ปลอดสารพิษ อนุรักษ์ผึ้งและหน้าดิน
            </span>
            <span className="flex items-center gap-1">
              <span>🏦</span>
              <strong>วินัยการเงิน:</strong> ออมฉุกเฉินสม่ำเสมอก่อนใช้จ่าย
            </span>
            <span className="flex items-center gap-1">
              <span>🛡️</span>
              <strong>ความปลอดภัยไซเบอร์:</strong> ไม่กดลิงก์แปลก ไม่บอกรหัสผ่าน
            </span>
          </div>
        </footer>
      </main>

      {/* Modals */}
      <MarketModal
        isOpen={isMarketOpen}
        onClose={() => setIsMarketOpen(false)}
        inventory={inventory}
        jars={jars}
        onSellCrops={handleSellCrops}
        marketPriceModifiers={marketPriceModifiers}
      />

      <FinancialDashboard
        isOpen={isFinanceOpen}
        onClose={() => setIsFinanceOpen(false)}
        jars={jars}
        transactions={transactions}
        onTransferFunds={handleTransferFunds}
        onDonateCommunity={(amt) => {
          if (jars.community >= amt) {
            setJars((prev) => ({ ...prev, community: prev.community - amt }));
            setCommunityPoints((p) => p + amt);
            addTransaction('donation', 'community', amt, 'บริจาคโครงการอาหารกลางวันโรงเรียน');
            showToast(`💖 บริจาค ${amt} 🪙 สำเร็จ! น้องๆ ได้ทานผักสดปลอดสารพิษ`);
          }
        }}
        onUpgradeFarmPlot={handleUpgradeFarmPlot}
        plotCount={plots.length}
        upgradeCost={upgradeCost}
        interestRatePercent={4}
      />

      <ScamShieldModal
        isOpen={isScamShieldOpen}
        onClose={() => setIsScamShieldOpen(false)}
        activeScam={activeScam}
        onResolveScam={handleResolveScam}
        safetyScore={safetyScore}
        resolvedScamsCount={resolvedScamsCount}
      />

      <CoopCommunityModal
        isOpen={isCoopOpen}
        onClose={() => setIsCoopOpen(false)}
        isCoopMode={isCoopMode}
        onToggleCoopMode={() => setIsCoopMode(!isCoopMode)}
        members={coopMembers}
        orders={coopOrders}
        inventory={inventory}
        onContributeOrder={handleContributeOrder}
        onCollectReward={handleCollectCoopReward}
        onHelpTeammate={handleHelpTeammate}
        communityPoints={communityPoints}
      />

      <PlantEncyclopediaModal
        isOpen={isEncyclopediaOpen}
        onClose={() => setIsEncyclopediaOpen(false)}
      />

      <AiAdvisorModal
        isOpen={isAiAdvisorOpen}
        onClose={() => setIsAiAdvisorOpen(false)}
        farmContext={{
          dayCount,
          plotsCount: plots.length,
          weather: currentWeather.label,
          jars,
          safetyScore,
        }}
      />

      <PlotDetailModal
        plot={inspectingPlot}
        onClose={() => setInspectingPlot(null)}
        onWater={(p) => {
          setSelectedTool('water');
          handlePlotClick(p);
        }}
        onCompost={(p) => {
          setSelectedTool('compost');
          handlePlotClick(p);
        }}
        onPestControl={(p) => {
          setSelectedTool('natural_pest');
          handlePlotClick(p);
        }}
        onHarvest={(p) => {
          setSelectedTool('harvest');
          handlePlotClick(p);
        }}
        onClear={(p) => {
          setSelectedTool('shovel');
          handlePlotClick(p);
        }}
      />
    </div>
  );
}
