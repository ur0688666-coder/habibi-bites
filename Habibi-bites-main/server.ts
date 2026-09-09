import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let geminiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!geminiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is missing.');
    }
    geminiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return geminiClient;
}

const SYSTEM_INSTRUCTION = `You are "Habibi", the friendly, knowledgeable AI Culinary Concierge and Food Guide for Habibi Bites — an authentic, high-flavor Pakistani fast-food restaurant located in Lahore, Pakistan (Hotline: 0343 4100089).

Your role & style:
- Warm, welcoming, respectful, and enthusiastic about bold Pakistani street food & modern fast-food flavours ("Assalam-o-Alaikum!", "Welcome to Habibi Bites!").
- You know our signature menu intimately:
  * Spicy Crispy Zinger Wrap: crispy battered chicken breast with secret garlic herb sauce wrapped in warm pita (Regular Rs. 550 / Large Rs. 750)
  * Double Patty Gourmet Smash Burger: dual seasoned patties, melted cheese, caramelized onions, toasted brioche (Single Rs. 650 / Meal Rs. 850)
  * Classic Crispy Zinger Burger: golden crunchy chicken thigh fillet, Habibi spice blend, shredded lettuce, spicy mayo (Standard Rs. 490 / Meal Combo Rs. 690)
  * Loaded Pakistani Masala Fries: crispy fries dusted with secret house chaat masala, cheese sauce, jalapeños (Regular Rs. 350 / Loaded Supreme Rs. 490)
  * Signature Mint Margarita Cooler: freshly crushed mint, zesty lime, black rock salt, chilled soda (Standard Rs. 280)
  * Ultimate Friends Platter: 2 Zingers + 1 Wrap + Large Masala Fries + 3 Drinks (Rs. 1,690)
- You help customers:
  1. Recommend ideal meals based on hunger level, spice tolerance, dietary preferences, or party size.
  2. Answer questions about placing orders online or by calling 0343 4100089, delivery areas in Lahore, and chef customization notes.
  3. When Google Search or Google Maps grounding is active, provide accurate real-time information, location directions, local landmarks in Lahore/Punjab, and external reference links.
- Format responses cleanly with Markdown, bullet points, and appetizing descriptions. Keep responses concise and practical.`;

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
      orderEmailRecipient: process.env.ORDER_NOTIFICATION_EMAIL || process.env.SMTP_USER || 'ur0688666@gmail.com',
      hasSmtpConfigured: Boolean(process.env.SMTP_USER && process.env.SMTP_PASS),
      smtpUser: process.env.SMTP_USER ? `${process.env.SMTP_USER.slice(0, 3)}***` : null,
      timestamp: new Date().toISOString(),
    });
  });

  // Helper to create SMTP transporter if configured
  function createEmailTransporter() {
    const host = process.env.SMTP_HOST || (process.env.SMTP_USER?.includes('@gmail.com') ? 'smtp.gmail.com' : undefined);
    const user = process.env.SMTP_USER;
    const rawPass = process.env.SMTP_PASS;
    const pass = rawPass ? rawPass.replace(/\s+/g, '') : undefined;
    const port = parseInt(process.env.SMTP_PORT || (host === 'smtp.gmail.com' ? '465' : '587'), 10);

    if (user && pass) {
      return nodemailer.createTransport({
        host: host || 'smtp.gmail.com',
        port,
        secure: port === 465,
        auth: { user, pass },
      });
    }

    return null;
  }

  // Diagnostic endpoint to test live email dispatch
  app.post('/api/test-email', async (req: Request, res: Response) => {
    try {
      const transporter = createEmailTransporter();
      if (!transporter) {
        return res.status(400).json({
          success: false,
          error: 'SMTP credentials not found in environment (SMTP_USER / SMTP_PASS required).',
        });
      }

      const recipient = process.env.ORDER_NOTIFICATION_EMAIL || process.env.SMTP_USER || 'ur0688666@gmail.com';
      const fromAddress = process.env.SMTP_FROM || process.env.SMTP_USER || 'orders@habibibites.pk';

      const info = await transporter.sendMail({
        from: `"Habibi Bites Test" <${fromAddress}>`,
        to: recipient,
        subject: '🧪 Habibi Bites SMTP System Test',
        text: `This is a test notification confirming that live email dispatch to ${recipient} is active and working.`,
      });

      return res.json({
        success: true,
        sentToEmail: recipient,
        messageId: info.messageId,
      });
    } catch (err: any) {
      console.error('Test email failed:', err);
      return res.status(500).json({
        success: false,
        error: err?.message || 'Failed to send test email',
      });
    }
  });

  // Endpoint to send order form data to restaurant management (ur0688666@gmail.com)
  app.post('/api/send-order-email', async (req: Request, res: Response) => {
    try {
      const {
        referenceId,
        customerName,
        phoneNumber,
        deliveryLocation,
        itemName,
        selectedSize,
        price,
        deliveryChefNote,
        timestamp,
        userEmail,
      } = req.body;

      if (!customerName || !phoneNumber || !deliveryLocation || !itemName) {
        return res.status(400).json({
          error: 'Missing required order fields: customerName, phoneNumber, deliveryLocation, and itemName are required.',
        });
      }

      // Valid verified recipient address with three 6s
      const recipientString = process.env.ORDER_NOTIFICATION_EMAIL || process.env.SMTP_USER || 'ur0688666@gmail.com';
      const ref = referenceId || `HB-${Math.floor(1000 + Math.random() * 9000)}`;
      const time = timestamp || new Date().toLocaleString('en-US', { timeZone: 'Asia/Karachi' });

      console.log(`[ORDER DISPATCH] Processing order #${ref} for recipient ${recipientString}:`, {
        customerName,
        phoneNumber,
        deliveryLocation,
        itemName,
        selectedSize,
        price,
        deliveryChefNote,
      });

      const transporter = createEmailTransporter();
      let sentToSmtp = false;
      let messageId: string | null = null;

      const emailSubject = `🍔 New Habibi Bites Order #${ref} - ${itemName} (Rs. ${price})`;
      const plainText = `
NEW ORDER RECEIVED AT HABIBI BITES!
-----------------------------------
Order Reference: #${ref}
Timestamp: ${time}

CUSTOMER DETAILS:
- Name: ${customerName}
- Phone Number: ${phoneNumber}
- Delivery Location: ${deliveryLocation}
${userEmail ? `- Authenticated User Email: ${userEmail}\n` : ''}
ORDER DETAILS:
- Item: ${itemName}
- Selected Size: ${selectedSize || 'Standard'}
- Total Price: Rs. ${price}
- Chef Special Notes: ${deliveryChefNote ? deliveryChefNote : 'None'}

Hotline: 0343 4100089
Habibi Bites Lahore
      `.trim();

      const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Order #${ref}</title>
</head>
<body style="margin: 0; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0d10; color: #f3e5ab;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; background-color: #12161f; border-radius: 16px; border: 1px solid #283344; overflow: hidden;">
    <tr>
      <td style="background: linear-gradient(135deg, #d4af37, #8c6d17); padding: 24px; text-align: center;">
        <h1 style="margin: 0; color: #111317; font-size: 24px; font-weight: 800; letter-spacing: 1px;">HABIBI BITES</h1>
        <p style="margin: 4px 0 0 0; color: #231c07; font-size: 14px; font-weight: 600;">NEW ONLINE ORDER NOTIFICATION</p>
      </td>
    </tr>
    <tr>
      <td style="padding: 24px;">
        <div style="background-color: #1a212d; border-radius: 12px; padding: 16px; margin-bottom: 20px; border: 1px solid #2d3848;">
          <table width="100%">
            <tr>
              <td style="color: #8e99a8; font-size: 13px;">Order Reference:</td>
              <td style="text-align: right; color: #d4af37; font-size: 16px; font-weight: bold;">#${ref}</td>
            </tr>
            <tr>
              <td style="color: #8e99a8; font-size: 13px;">Placed At:</td>
              <td style="text-align: right; color: #ffffff; font-size: 13px;">${time}</td>
            </tr>
          </table>
        </div>

        <h3 style="margin: 0 0 12px 0; color: #d4af37; font-size: 15px; border-bottom: 1px solid #242d3d; padding-bottom: 6px;">Customer Information</h3>
        <table width="100%" style="font-size: 14px; margin-bottom: 20px;">
          <tr>
            <td style="padding: 6px 0; color: #8e99a8; width: 40%;">Customer Name:</td>
            <td style="padding: 6px 0; color: #ffffff; font-weight: 600;">${customerName}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #8e99a8;">Phone Number:</td>
            <td style="padding: 6px 0; color: #ffffff; font-weight: 600;"><a href="tel:${phoneNumber}" style="color: #60a5fa; text-decoration: none;">${phoneNumber}</a></td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #8e99a8;">Delivery Address:</td>
            <td style="padding: 6px 0; color: #ffffff; font-weight: 600;">${deliveryLocation}</td>
          </tr>
          ${userEmail ? `<tr><td style="padding: 6px 0; color: #8e99a8;">Account Email:</td><td style="padding: 6px 0; color: #ffffff;">${userEmail}</td></tr>` : ''}
        </table>

        <h3 style="margin: 0 0 12px 0; color: #d4af37; font-size: 15px; border-bottom: 1px solid #242d3d; padding-bottom: 6px;">Order Details</h3>
        <div style="background-color: #161c26; border-radius: 12px; padding: 16px; margin-bottom: 20px; border: 1px solid #253040;">
          <table width="100%" style="font-size: 14px;">
            <tr>
              <td style="color: #ffffff; font-weight: 700; font-size: 16px;">${itemName}</td>
              <td style="text-align: right; color: #d4af37; font-weight: 700; font-size: 16px;">Rs. ${price}</td>
            </tr>
            <tr>
              <td colspan="2" style="color: #8e99a8; font-size: 13px; padding-top: 4px;">Size: <strong style="color: #ffffff;">${selectedSize || 'Standard'}</strong></td>
            </tr>
            ${deliveryChefNote ? `
            <tr>
              <td colspan="2" style="padding-top: 12px; border-top: 1px dashed #2d3848; margin-top: 10px; color: #e2e8f0; font-size: 13px;">
                <span style="color: #d4af37; font-weight: bold;">Chef Note:</span> "${deliveryChefNote}"
              </td>
            </tr>` : ''}
          </table>
        </div>

        <div style="text-align: center; padding: 16px 0 0 0; border-top: 1px solid #222a38;">
          <p style="margin: 0; color: #8e99a8; font-size: 12px;">Habibi Bites Restaurant Order Alert</p>
          <p style="margin: 4px 0 0 0; color: #d4af37; font-size: 12px; font-weight: 600;">Hotline: 0343 4100089 | Lahore, Pakistan</p>
        </div>
      </td>
    </tr>
  </table>
</body>
</html>
      `;

      if (transporter) {
        try {
          const fromAddress = process.env.SMTP_FROM || process.env.SMTP_USER || 'orders@habibibites.pk';
          const info = await transporter.sendMail({
            from: `"Habibi Bites Orders" <${fromAddress}>`,
            to: recipientString,
            subject: emailSubject,
            text: plainText,
            html: htmlContent,
          });
          sentToSmtp = true;
          messageId = info.messageId;
          console.log(`[ORDER EMAIL DISPATCHED] Email sent to ${recipientString} (Message ID: ${messageId})`);
        } catch (smtpErr: any) {
          console.error('[ORDER EMAIL ERROR] SMTP dispatch encountered error:', smtpErr);
          return res.status(502).json({
            success: false,
            sentToSmtp: false,
            error: `SMTP dispatch error: ${smtpErr?.message || 'Check your Gmail App Password'}`,
            targetEmail: recipientString,
            referenceId: ref,
          });
        }
      } else {
        return res.status(503).json({
          success: false,
          sentToSmtp: false,
          error: 'SMTP credentials (SMTP_USER/SMTP_PASS) are not loaded or invalid on the server.',
          targetEmail: recipientString,
          referenceId: ref,
        });
      }

      return res.json({
        success: true,
        sentToEmail: recipientString,
        sentToSmtp,
        messageId,
        referenceId: ref,
        timestamp: time,
      });
    } catch (err: any) {
      console.error('Send order email API error:', err);
      return res.status(500).json({
        error: err?.message || 'Failed to dispatch order email.',
      });
    }
  });

  // Chat API endpoint
  app.post('/api/chat', async (req: Request, res: Response) => {
    try {
      const {
        messages = [],
        model: requestedModel = 'gemini-3.5-flash',
        mode = 'general', // 'general' | 'search' | 'maps'
        userLocation, // optional { latitude: number, longitude: number }
      } = req.body;

      if (!Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ error: 'Messages array must not be empty.' });
      }

      const ai = getGeminiClient();

      // Determine model based on requested model and mode constraints
      // Per instructions:
      // "Use gemini-3.1-pro-preview for particularly complex tasks, gemini-3.5-flash for general tasks, and gemini-3.1-flash-lite for tasks that should happen fast."
      // "Search Grounding: Use gemini-3.5-flash (with googleSearch tool)"
      // "Maps Grounding: Use gemini-3.5-flash (with googleMaps tool)"
      let activeModel = requestedModel;
      if (mode === 'search' || mode === 'maps') {
        activeModel = 'gemini-3.5-flash';
      }

      // Configure tools according to mode
      let tools: any[] | undefined = undefined;
      let toolConfig: any = undefined;

      if (mode === 'search') {
        tools = [{ googleSearch: {} }];
      } else if (mode === 'maps') {
        tools = [{ googleMaps: {} }];
        if (userLocation && typeof userLocation.latitude === 'number' && typeof userLocation.longitude === 'number') {
          toolConfig = {
            retrievalConfig: {
              latLng: {
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
              },
            },
          };
        }
      }

      // Prepare conversation contents
      const contents = messages.map((m: { role: string; text: string }) => ({
        role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
        parts: [{ text: m.text }],
      }));

      const config: any = {
        systemInstruction: SYSTEM_INSTRUCTION,
      };

      if (tools) {
        config.tools = tools;
      }
      if (toolConfig) {
        config.toolConfig = toolConfig;
      }

      const response = await ai.models.generateContent({
        model: activeModel,
        contents,
        config,
      });

      const responseText = response.text || '';
      const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
      const groundingChunks = groundingMetadata?.groundingChunks || [];
      const webSearchQueries = groundingMetadata?.webSearchQueries || [];

      return res.json({
        text: responseText,
        model: activeModel,
        mode,
        groundingChunks,
        webSearchQueries,
      });
    } catch (error: any) {
      console.error('Gemini Chat API Error:', error);
      const errorMessage = error?.message || 'Failed to generate response from Gemini.';
      return res.status(500).json({
        error: errorMessage,
        isQuotaExceeded: error?.status === 429 || errorMessage.includes('RESOURCE_EXHAUSTED'),
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
