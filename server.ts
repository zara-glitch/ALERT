import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

// Load environment variables in development
dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize Gemini SDK with lazy key checking
const getAiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  return new GoogleGenAI({ 
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
};

// API Endpoint for AI Emergency Assistance
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, userMedicalContext } = req.body;

    if (!messages || !Array.isArray(messages)) {
      res.status(400).json({ error: 'Messages array is required.' });
      return;
    }

    const ai = getAiClient();
    if (!ai) {
      // Graceful fallback if no API key is provided
      const lastUserMsg = messages[messages.length - 1]?.text?.toLowerCase() || '';
      let reply = "Greetings. I am your AlertNow Guardian AI. I am running in fallback mode.";
      
      if (lastUserMsg.includes('cpr')) {
        reply = "CPR PROTOCOL: Check responsiveness, call emergency services immediately, start chest compressions (100-120 per minute), and perform rescue breaths. Please refer to our interactive CPR Protocol guide in the first aid list.";
      } else if (lastUserMsg.includes('stroke') || lastUserMsg.includes('fast')) {
        reply = "STROKE (FAST) DETECTION: Face drooping, Arm weakness, Speech difficulty, Time to call emergency services. Keep the person calm and do not give them food or drink.";
      } else if (lastUserMsg.includes('bleed') || lastUserMsg.includes('blood')) {
        reply = "SEVERE BLEEDING: Apply direct firm pressure with a clean cloth. Elevate the wound if possible. Do not remove the cloth if soaked; add more layers.";
      } else if (lastUserMsg.includes('burn')) {
        reply = "BURNS: Cool the burn under running tap water for at least 10 minutes. Cover loosely with sterile dressing. Never apply ice, butter, or oil.";
      } else {
        reply = "I am alert and ready. For any severe emergency, please activate the SOS button immediately to dial direct assistance and notify your emergency contacts. What symptom or first-aid guide can I assist you with?";
      }

      res.json({
        text: reply,
        suggestedActions: ['CPR Guide', 'Stroke FAST', 'Severe Bleeding', 'Burns Guide']
      });
      return;
    }

    // Prepare system instructions with safety rules
    const systemInstruction = `You are Guardian AI, a high-stakes emergency response assistant on the ALERTNOW V2 platform.
    Your absolute prime directives are:
    1. NEVER ALLOW OR INVITE CUSTOM PROTOCOL GENERATION. Users cannot write or save custom emergency protocols. Always retrieve and refer to the official predefined ALERTNOW Protocol for the identified emergency category (Fire, Road Crash, Bleeding, Burn, Choking, Unconscious/CPR, Allergic Reaction, Building Collapse, Armed Security Threat, Kidnapping, Snakebite/Poison, Asthma, Electric Shock, Flooding).
    2. NEVER DIAGNOSE OR INVENT CLINICAL PROCEDURES. Explain established emergency protocols clearly step-by-step.
    3. ALWAYS RECOMMEND CONTACTING EMERGENCY SERVICES (Dial 112 National Lifeline, 122 FRSC, Federal Fire Service, or Police Control Room) immediately for severe incidents.
    4. Keep responses clear, concise, structured, and easy to read under stress (bullet points, bold highlights, numbered steps).
    5. NEVER FABRICATE emergency phone numbers, email addresses, or responder details.
    
    Context about the user (if shared):
    ${userMedicalContext ? JSON.stringify(userMedicalContext) : 'No medical profile shared yet.'}`;

    // Map messages format safely to ensure no empty/undefined parts are passed
    const contents = messages.map(msg => {
      const text = (msg.text && typeof msg.text === 'string') ? msg.text.trim() : '';
      return {
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: text || 'Analyzed request.' }]
      };
    });

    try {
      // Call Gemini API
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents,
        config: {
          systemInstruction,
          temperature: 0.3,
        }
      });

      const replyText = response.text || "I apologize, I could not process that emergency request. Please call emergency dispatch immediately.";

      res.json({
        text: replyText,
        suggestedActions: ['CPR Instructions', 'Bleeding Control', 'Shock Protocol', 'Contact Dispatch']
      });
    } catch (apiError: any) {
      console.warn("Gemini API call failed, invoking secure local fallback responder:", apiError);
      
      // Fallback local response logic when API is down/overloaded
      const lastUserMsg = messages[messages.length - 1]?.text?.toLowerCase() || '';
      let reply = "Greetings. I am your AlertNow Guardian AI. I am running in local fallback safety mode due to network overhead.";
      
      if (lastUserMsg.includes('cpr')) {
        reply = "CPR PROTOCOL (Local Fallback): Check responsiveness, call emergency services immediately, start chest compressions (100-120 per minute), and perform rescue breaths. Please refer to our interactive CPR Protocol guide in the first aid list.";
      } else if (lastUserMsg.includes('stroke') || lastUserMsg.includes('fast')) {
        reply = "STROKE (FAST) DETECTION (Local Fallback): Face drooping, Arm weakness, Speech difficulty, Time to call emergency services immediately. Keep the person calm and do not give them food or drink.";
      } else if (lastUserMsg.includes('bleed') || lastUserMsg.includes('blood')) {
        reply = "SEVERE BLEEDING (Local Fallback): Apply direct firm pressure with a clean cloth. Elevate the wound if possible. Do not remove the cloth if soaked; add more layers.";
      } else if (lastUserMsg.includes('burn')) {
        reply = "BURNS (Local Fallback): Cool the burn under running tap water for at least 10 minutes. Cover loosely with sterile dressing. Never apply ice, butter, or oil.";
      } else {
        reply = "I am alert and ready in local safety mode. For any severe emergency, please activate the SOS button immediately to dial direct assistance and notify your emergency contacts. What symptom or first-aid guide can I assist you with?";
      }

      res.json({
        text: reply,
        suggestedActions: ['CPR Guide', 'Stroke FAST', 'Severe Bleeding', 'Burns Guide']
      });
    }
  } catch (error: any) {
    console.error('Error in /api/chat:', error);
    res.status(500).json({ error: 'Internal server error during AI generation.' });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
