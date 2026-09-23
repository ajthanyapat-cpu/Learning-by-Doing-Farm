/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CoopMember, CoopOrder } from '../types.ts';

export const COOP_MEMBERS: CoopMember[] = [
  {
    id: 'mali',
    name: 'น้องมะลิ (Mali)',
    role: 'ผู้จัดการระบบน้ำหยด & จิตอาสา',
    avatar: '👧',
    bio: 'รักการอนุรักษ์น้ำ ชอบตรวจแปลงผักยามเช้าและช่วยเพื่อนบ้านรดน้ำอย่างสม่ำเสมอ',
    contribution: 320,
    isAi: true,
  },
  {
    id: 'kla',
    name: 'พี่กล้า (Kla)',
    role: 'นักประดิษฐ์พลังงานสะอาด',
    avatar: '👦',
    bio: 'สนใจโซลาร์เซลล์และกังหันลม ช่วยออกแบบระบบระบายอากาศให้โรงเรือนฟาร์ม',
    contribution: 450,
    isAi: true,
  },
  {
    id: 'somchai',
    name: 'ลุงสมชาย (Uncle Somchai)',
    role: 'ปราชญ์ปุ๋ยหมักอินทรีย์',
    avatar: '👴',
    bio: 'ผู้เชี่ยวชาญการหมักเศษอาหารกับมูลสัตว์และไส้เดือน เพื่อคืนชีวิตให้หน้าดิน',
    contribution: 580,
    isAi: true,
  },
  {
    id: 'pimjai',
    name: 'คุณครูพิมพ์ใจ (Teacher Pimjai)',
    role: 'ที่ปรึกษาสหกรณ์และการออม',
    avatar: '👩‍🏫',
    bio: 'สอนการทำบัญชี 4 กระปุก ส่งเสริมให้เยาวชนรู้จักเก็บออมก่อนใช้จ่าย',
    contribution: 610,
    isAi: true,
  }
];

export const INITIAL_COOP_ORDERS: CoopOrder[] = [
  {
    id: 'coop_lunch_program',
    title: 'โครงการอาหารกลางวันผักปลอดภัยเพื่อน้อง',
    description: 'โรงเรียนชุมชนต้องการผักบุ้งจีนสด 10 มัด เพื่อทำผัดผักบุ้งไฟแดงไร้สารพิษให้เด็กนักเรียน',
    requiredPlantId: 'morning_glory',
    requiredAmount: 10,
    currentAmount: 4,
    rewardCoins: 160,
    communityPoints: 30,
    completed: false,
    rewardCollected: false,
  },
  {
    id: 'coop_healthy_salad',
    title: 'สลัดบาร์เพื่อสุขภาพโรงพยาบาลส่งเสริมสุขภาพตำบล',
    description: 'ร่วมจัดส่งผักกาดหอมกรีนโอ๊ค 8 หัว เพื่อเป็นอาหารฟื้นฟูผู้ป่วยและบุคลากรทางการแพทย์',
    requiredPlantId: 'green_lettuce',
    requiredAmount: 8,
    currentAmount: 2,
    rewardCoins: 200,
    communityPoints: 40,
    completed: false,
    rewardCollected: false,
  },
  {
    id: 'coop_kid_vitamin',
    title: 'ตะกร้าผลไม้เสริมวิตามินเด็กปฐมวัย',
    description: 'รวมพลังสหกรณ์จัดส่งมะเขือเทศเชอร์รี่ 6 ถาด เสริมไลโคปีนและวิตามินซีให้ศูนย์เด็กเล็ก',
    requiredPlantId: 'cherry_tomato',
    requiredAmount: 6,
    currentAmount: 1,
    rewardCoins: 280,
    communityPoints: 50,
    completed: false,
    rewardCollected: false,
  },
  {
    id: 'coop_bee_corridor',
    title: 'ระเบียงทานตะวันฟื้นฟูประชากรผึ้ง',
    description: 'ส่งดอกทานตะวันสีทอง 5 ดอก เพื่อจัดสวนเรียนรู้ระบบนิเวศการผสมเกสรของแมลง',
    requiredPlantId: 'sunflower',
    requiredAmount: 5,
    currentAmount: 0,
    rewardCoins: 320,
    communityPoints: 60,
    completed: false,
    rewardCollected: false,
  }
];
