/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type PlantCategory = 'leafy' | 'fruit' | 'root' | 'flower' | 'herb';

export type SunlightCondition = 'full' | 'partial' | 'shade';

export interface PlantSpecies {
  id: string;
  name: string;
  botanicalName: string;
  emoji: string;
  category: PlantCategory;
  seedCost: number;
  baseSellPrice: number;
  growthTime: number; // in seconds
  optimalSun: SunlightCondition;
  minMoisture: number; // e.g. 35%
  maxMoisture: number; // e.g. 80%
  ecoBenefit: string;
  learningFact: string;
  nutritionInfo: string;
}

export interface FarmPlot {
  id: number;
  plantId: string | null;
  stage: number; // 0: empty, 1: seed, 2: seedling, 3: growing, 4: blooming, 5: harvest ready
  progress: number; // 0 to 100%
  moisture: number; // 0 to 100%
  soilQuality: number; // 0 to 100% (increased by compost)
  sunExposure: SunlightCondition;
  hasPest: boolean;
  hasBeneficialInsect: 'bee' | 'ladybug' | null;
  lastWateredTime: number;
  plantedAt: number;
  health: number; // 0 to 100
  isDead: boolean;
  fertilized: boolean;
}

export type WeatherType = 'sunny' | 'partly_cloudy' | 'rainy' | 'breezy';
export type TimeOfDay = 'morning' | 'afternoon' | 'evening';

export interface WeatherState {
  type: WeatherType;
  label: string;
  sunlightMultiplier: number;
  evaporationRate: number;
  description: string;
}

export interface FinancialJars {
  operating: number; // ทุนหมุนเวียน (ซื้อเมล็ด ปัจจัยการผลิต)
  savings: number; // เงินออมฉุกเฉิน (ฝากสหกรณ์ ดอกเบี้ยปันผล)
  development: number; // พัฒนาฟาร์ม (ขยายแปลง เทคโนโลยี)
  community: number; // แบ่งปันสังคม (ช่วยเหลือเพื่อนบ้าน โรงเรียน)
}

export interface TransactionRecord {
  id: string;
  timestamp: number;
  type: 'income' | 'expense' | 'transfer' | 'interest' | 'donation';
  jar: keyof FinancialJars;
  amount: number;
  title: string;
  note?: string;
}

export interface ScamEvent {
  id: string;
  senderName: string;
  senderAvatar: string;
  channel: 'sms' | 'social' | 'visitor' | 'letter';
  title: string;
  content: string;
  threatType: 'phishing' | 'ponzi' | 'fake_cert' | 'data_harvest' | 'predatory_loan';
  explanation: string;
  realWorldWarning: string;
  scamChoiceText: string;
  safeChoiceText: string;
  rewardCoins: number;
}

export interface CoopMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  bio: string;
  contribution: number;
  isAi: boolean;
}

export interface CoopOrder {
  id: string;
  title: string;
  description: string;
  requiredPlantId: string;
  requiredAmount: number;
  currentAmount: number;
  rewardCoins: number;
  communityPoints: number;
  completed: boolean;
  rewardCollected: boolean;
}

export interface InventoryItem {
  plantId: string;
  quantity: number;
}

export type ToolType = 'inspect' | 'seed' | 'water' | 'compost' | 'natural_pest' | 'harvest' | 'shovel';
