import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized GoogleGenAI client
let aiClient: GoogleGenAI | null = null;
function getAiClient(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// AI Farm Advisor & Plant Doctor API endpoint
app.post("/api/gemini/advisor", async (req, res) => {
  try {
    const { question, farmContext } = req.body;

    if (!question || typeof question !== "string") {
      return res.status(400).json({ error: "กรุณาระบุคำถามที่ต้องการถาม" });
    }

    const ai = getAiClient();
    if (!ai) {
      // Fallback smart knowledge response when API key is not configured
      const fallbackReplies: Record<string, string> = {
        water: "💦 เคล็ดลับการรดน้ำ: ควรรดน้ำช่วงเช้า 06.00-08.00 น. เพราะแดดยังไม่แรง น้ำไม่ระเหยเร็ว และระวังอย่ารดจนแฉะขังเพราะจะทำให้เกิดโรครากเน่า (Root Rot) ได้ครับ!",
        sun: "☀️ เรื่องแสงแดด: พืชกินผลอย่างมะเขือเทศและข้าวโพดต้องการแดดจัด 6-8 ชม.ต่อวัน ส่วนผักใบอย่างผักกาดหอมชอบแดดรำไร หากแดดแรงเกินไปให้พรางแสงด้วยซาแรนครับ",
        soil: "🌱 ดินและการบำรุง: ปุ๋ยหมักชีวภาพ (Compost) จากเปลือกผลไม้และใบไม้แห้ง ช่วยเติมอินทรียวัตถุและเชื้อจุลินทรีย์ดี ไม่ต้องพึ่งปุ๋ยเคมี ช่วยอนุรักษ์ดินและสิ่งแวดล้อมครับ",
        money: "💰 การบริหารเงิน 4 กระปุก: 1. ทุนหมุนเวียน (ซื้อเมล็ด) 2. เงินออมฉุกเฉิน (ฝากสหกรณ์) 3. พัฒนาฟาร์ม (ขยายแปลง) 4. แบ่งปันสังคม ช่วยให้เรามีวินัยทางการเงินที่มั่นคงครับ!",
        scam: "🛡️ ระวังมิจฉาชีพ: หากมีใครมาชวนโอนเงินเพื่อผลตอบแทนสูงเว่อร์ หรือแจกเมล็ดฟรีแต่ให้กดลิงก์แปลกๆ ห้ามกดเด็ดขาด! ท่องไว้ 'ไม่มีของฟรีที่ไม่มีที่มา'",
      };

      const qLower = question.toLowerCase();
      let matched = "🌱 พี่ต้นกล้า ยินดีช่วยเหลือครับ! ในการปลูกพืช ความสมดุลของ แสงแดด น้ำ ดิน และสภาพแวดล้อม เป็นกุญแจสำคัญ หมั่นสังเกตแปลงผักบ่อยๆ นะครับ";
      if (qLower.includes("น้ำ") || qLower.includes("เหี่ยว") || qLower.includes("เน่า")) matched = fallbackReplies.water;
      else if (qLower.includes("แดด") || qLower.includes("สังเคราะห์") || qLower.includes("แสง")) matched = fallbackReplies.sun;
      else if (qLower.includes("ดิน") || qLower.includes("ปุ๋ย") || qLower.includes("อินทรีย์")) matched = fallbackReplies.soil;
      else if (qLower.includes("เงิน") || qLower.includes("ออม") || qLower.includes("ขาย") || qLower.includes("ทุน")) matched = fallbackReplies.money;
      else if (qLower.includes("โกง") || qLower.includes("มิจฉาชีพ") || qLower.includes("หลอก") || qLower.includes("ปลอดภัย")) matched = fallbackReplies.scam;

      return res.json({
        answer: matched,
        source: "local-knowledge-base",
      });
    }

    const systemInstruction = `คุณคือ "พี่ต้นกล้า" ผู้เชี่ยวชาญด้านเกษตรอินทรีย์ วิทยาศาสตร์ธรรมชาติ การเงินสำหรับเยาวชน และทักษะชีวิตดิจิทัลที่ปลอดภัย
หน้าที่ของคุณ:
1. ให้ความรู้เรื่องการปลูกพืช (แสงแดด, การสังเคราะห์แสง, การรดน้ำที่พอดี, สภาพดิน pH และปุ๋ยหมักชีวภาพ, ระบบนิเวศแมลงที่เป็นมิตร)
2. อธิบายเข้าใจง่าย ภาษาไทยอบอุ่น น่ารัก เหมาะกับเด็กและเยาวชน (สอดแทรกวิทยาศาสตร์รอบตัว)
3. หากถามเรื่องการเงิน ให้อธิบายเรื่องการแบ่งสัดส่วนเงิน การลงทุน การเก็บออม และการทำบัญชีรายรับรายจ่าย
4. หากถามเรื่องความปลอดภัย หรือมีสถานการณ์น่าสงสัย ให้เตือนภัยเรื่องมิจฉาชีพออนไลน์ การหลอกกดลิงก์ Phishing หรือแชร์ลูกโซ่
5. ตอบกระชับ ไม่ยาวเกินไป (ไม่เกิน 3-4 ย่อหน้าสั้นๆ) อ่านง่าย มีอีโมจิน่ารัก`;

    const prompt = `บริบทฟาร์มปัจจุบันของผู้เล่น: ${farmContext ? JSON.stringify(farmContext) : "ฟาร์มสุขเกษตรวัยใส"}
คำถามจากน้องเกษตรกร: "${question}"`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({
      answer: response.text || "ขออภัยครับ พี่ต้นกล้ากำลังศึกษาข้อมูลอยู่ ลองถามอีกครั้งนะครับ!",
      source: "gemini-3.8-flash",
    });
  } catch (err: any) {
    console.error("Gemini advisor error:", err);
    res.status(500).json({
      error: "เกิดข้อผิดพลาดในการเชื่อมต่อกับผู้ช่วย AI",
      fallback: "🌱 เคล็ดลับเกษตรยั่งยืน: พืชต้องการแสงแดด ดินที่ร่วนซุย และน้ำที่พอเหมาะ การไม่ใช้สารเคมีจะทำให้ฟาร์มมีแมลงตัวห้ำตัวเบียนช่วยกำจัดศัตรูพืชตามธรรมชาติครับ!",
    });
  }
});

// Vite middleware in dev or static files in production
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🌾 GreenThumb Farm Server is running on http://0.0.0.0:${PORT}`);
  });
}

setupVite();
