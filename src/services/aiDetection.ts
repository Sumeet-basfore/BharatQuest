// src/services/aiDetection.ts

/**
 * Translation layer with Bhashini API integration + robust mock fallback.
 *
 * Architecture:
 *   translateToEnglish(text)
 *     → tries bhashiniTranslate() if API key is configured
 *     → falls back to mockTranslate() on any failure
 *     → returns original text if everything fails
 *     → NEVER throws
 */

// ─── Bhashini API Configuration ──────────────────────────────────────────────
// To enable real translation, set these values.
// For hackathon demo, leave BHASHINI_API_KEY empty to use mock fallback.

const BHASHINI_API_KEY = ''; // e.g. 'your-api-key-here'
const BHASHINI_USER_ID = ''; // e.g. 'your-user-id'
const BHASHINI_PIPELINE_URL =
  'https://dhruva-api.bhashini.gov.in/services/inference/pipeline';

const BHASHINI_ENABLED = BHASHINI_API_KEY.length > 0;

// ─── Bhashini REST API Call ──────────────────────────────────────────────────

type BhashiniSourceLang = 'hi' | 'as'; // Hindi, Assamese

const bhashiniTranslate = async (
  text: string,
  sourceLang: BhashiniSourceLang,
): Promise<string> => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000); // 5s timeout

  try {
    const response = await fetch(BHASHINI_PIPELINE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: BHASHINI_API_KEY,
        'x-user-id': BHASHINI_USER_ID,
      },
      body: JSON.stringify({
        pipelineTasks: [
          {
            taskType: 'translation',
            config: {
              language: {
                sourceLanguage: sourceLang,
                targetLanguage: 'en',
              },
            },
          },
        ],
        inputData: {
          input: [{ source: text }],
        },
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`Bhashini API error: ${response.status}`);
    }

    const data = await response.json();
    const translated =
      data?.pipelineResponse?.[0]?.output?.[0]?.target;

    if (typeof translated === 'string' && translated.length > 0) {
      return translated;
    }

    throw new Error('Empty translation response');
  } catch (err) {
    clearTimeout(timeout);
    throw err; // Let caller handle fallback
  }
};

// ─── Enhanced Mock Translator ────────────────────────────────────────────────
// Sorted longest-phrase-first so multi-word mappings match before sub-words.

const MOCK_MAPPINGS: [string, string][] = [
  // ── Multi-word phrases (must come first) ──
  ['खाता बंद हो जाएगा', 'account will be blocked'],
  ['खाता बंद', 'account blocked'],
  ['क्लिक करें', 'click here'],
  ['अभी क्लिक करें', 'click now'],
  ['तुरंत कार्रवाई करें', 'take immediate action'],
  ['जल्दी करें', 'hurry up'],
  ['समय सीमा', 'deadline'],
  ['फ्री में', 'for free'],
  ['मुफ्त में', 'for free'],
  ['अपना खाता', 'your account'],
  ['बैंक खाता', 'bank account'],
  ['पैसे भेजें', 'send money'],
  ['पैसे प्राप्त करें', 'receive money'],
  ['कृपया सत्यापित करें', 'please verify'],
  ['नीचे दिए गए', 'given below'],
  ['ऑनलाइन फ्रॉड', 'online fraud'],
  ['आधार कार्ड', 'Aadhaar card'],
  ['पैन कार्ड', 'PAN card'],
  ['बधाई हो', 'congratulations'],
  ['आपने जीता', 'you won'],
  ['शेयर ना करें', 'do not share'],
  ['किसी को ना बताएं', 'do not tell anyone'],
  ['आपका खाता', 'your account'],

  // ── Scam / financial keywords ──
  ['लॉटरी', 'lottery'],
  ['जीत', 'won'],
  ['जीतना', 'won'],
  ['जीता', 'won'],
  ['पुरस्कार', 'reward'],
  ['इनाम', 'prize'],
  ['कैशबैक', 'cashback'],
  ['केवाईसी', 'KYC'],
  ['ओटीपी', 'OTP'],
  ['पासवर्ड', 'password'],
  ['पिन', 'PIN'],
  ['सीवीवी', 'CVV'],
  ['सत्यापित', 'verified'],
  ['सत्यापन', 'verification'],
  ['लिंक', 'link'],
  ['बैंक', 'bank'],
  ['अपडेट', 'update'],
  ['सुरक्षित', 'secure'],
  ['सुरक्षा', 'security'],
  ['खाता', 'account'],
  ['यूपीआई', 'UPI'],
  ['भुगतान', 'payment'],
  ['लेनदेन', 'transaction'],
  ['रिफंड', 'refund'],
  ['क्रेडिट', 'credit'],
  ['डेबिट', 'debit'],
  ['फ्री', 'free'],
  ['मुफ्त', 'free'],
  ['ऑफर', 'offer'],
  ['छूट', 'discount'],
  ['गिफ्ट', 'gift'],
  ['करोड़', 'crore'],
  ['लाख', 'lakh'],
  ['रुपये', 'rupees'],
  ['पैसे', 'money'],
  ['ब्लॉक', 'blocked'],
  ['निलंबित', 'suspended'],
  ['एक्सपायर', 'expired'],
  ['समाप्त', 'expired'],
  ['फ्रॉड', 'fraud'],
  ['धोखा', 'fraud'],
  ['चोरी', 'theft'],

  // ── Urgency words ──
  ['तुरंत', 'immediately'],
  ['जल्दी', 'quickly'],
  ['अभी', 'now'],
  ['आज', 'today'],
  ['अंतिम', 'last'],
  ['चेतावनी', 'warning'],
  ['ज़रूरी', 'required'],
  ['जरूरी', 'required'],

  // ── Action verbs ──
  ['क्लिक', 'click'],
  ['डाउनलोड', 'download'],
  ['इंस्टॉल', 'install'],
  ['भेजें', 'send'],
  ['प्राप्त', 'receive'],
  ['दर्ज', 'enter'],
  ['शेयर', 'share'],
  ['फॉरवर्ड', 'forward'],

  // ── Common connectors (improve readability) ──
  ['आपका', 'your'],
  ['आपको', 'you'],
  ['आपने', 'you'],
  ['से', 'from'],
  ['में', 'in'],
  ['पर', 'on'],
  ['है', 'is'],
  ['हैं', 'are'],
  ['का', 'of'],
  ['के', 'of'],
  ['की', 'of'],
  ['और', 'and'],
  ['या', 'or'],
  ['कृपया', 'please'],
  ['करें', 'do'],
].sort((a, b) => b[0].length - a[0].length) as [string, string][]; // longest first

const mockTranslate = (text: string): string => {
  let result = text;

  for (const [source, target] of MOCK_MAPPINGS) {
    // Use a literal-escaped RegExp so special chars are safe
    const escaped = source.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    result = result.replace(new RegExp(escaped, 'g'), target);
  }

  // Strip any remaining Devanagari / Bengali characters for cleaner output
  // (leaves English words, numbers, punctuation, and spaces)
  result = result
    .replace(/[\u0900-\u097F\u0980-\u09FF]+/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();

  return result.length > 0 ? result : text; // never return empty
};

// ─── Public Translation Entry Point ──────────────────────────────────────────

const translateToEnglish = async (text: string): Promise<string> => {
  try {
    if (!text || text.trim().length === 0) return text;

    // Skip if already English ASCII
    if (/^[a-zA-Z0-9\s.,!?'"@:\/\-]+$/.test(text)) return text;

    // Detect script
    const isHindi = /[\u0900-\u097F]/.test(text);
    const isAssamese = /[\u0980-\u09FF]/.test(text);

    if (!isHindi && !isAssamese) return text; // Unknown script, skip

    const sourceLang: BhashiniSourceLang = isAssamese ? 'as' : 'hi';

    // ── Step 1: Try Bhashini API (if configured) ──
    if (BHASHINI_ENABLED) {
      try {
        const apiResult = await bhashiniTranslate(text, sourceLang);
        console.log('[Translation] Bhashini API success');
        return apiResult;
      } catch (apiError) {
        console.warn('[Translation] Bhashini API failed, using mock fallback:', apiError);
        // Fall through to mock
      }
    }

    // ── Step 2: Mock fallback (always available) ──
    return mockTranslate(text);
  } catch (error) {
    // ── Step 3: Ultimate safety net — return original text ──
    console.error('[Translation] Complete failure, using original:', error);
    return text;
  }
};

// ─── Heuristic Scam Detection ────────────────────────────────────────────────

/**
 * Heuristic "AI" Detection Model for SMS Scams.
 * Uses RegEx and keyword matching to identify high-risk message patterns.
 * 
 * Patterns A-D require a link. Patterns E-F catch link-less scams.
 * This ensures common Hindi/regional scam messages are still detected.
 */
export const analyzeScamText = async (messageBody: string): Promise<boolean> => {
  try {
    // 1. Normalize text through the translation pipeline (never throws)
    const englishText = await translateToEnglish(messageBody);
    const lowerText = englishText.toLowerCase();

    // 2. High-risk pattern matching (Heuristic Approach)
    
    // Pattern A: Urgency + Link (e.g., "KYC Expired", "Account Blocked")
    const hasUrgency = /(account blocked|kyc|suspended|expired|urgent|action required|immediately|warning|blocked)/i.test(lowerText);
    const hasLink = /(http:\/\/|https:\/\/|\.apk|\.com|\.in|bit\.ly|t\.co)/i.test(lowerText);
    const isUrgencyLinkScam = hasUrgency && hasLink;

    // Pattern B: Greed + Action (e.g., "You won lottery", "UPI Cashback")
    const hasGreed = /(lottery|cashback|reward|prize|won|crore|lakh|gift|congratulations|free)/i.test(lowerText);
    const hasAction = /(click|claim|receive|tap|forward|link|download|install|scan)/i.test(lowerText);
    const isGreedActionScam = hasGreed && (hasAction || hasLink);

    // Pattern C: Auth + Warning (e.g., "Don't share OTP", but followed by a fake verification request)
    const hasAuth = /(otp|password|pin|cvv|card number|aadhaar|pan)/i.test(lowerText);
    const hasWarning = /(don't share|never share|official|verify|verification|share)/i.test(lowerText);
    const isAuthScam = hasAuth && hasWarning && hasLink;
    
    // Pattern D: Generic Malicious Keywords + Link
    const isGenericScam = hasLink && /(free|update|secure|check|offer|discount)/i.test(lowerText);

    // Pattern E: Multiple urgency signals without link (catches Hindi-only scams)
    // If 2+ suspicious categories trigger, it's likely a scam even without a link
    const suspiciousCategories = [hasUrgency, hasAuth, hasGreed].filter(Boolean).length;
    const isHighUrgencyScam = suspiciousCategories >= 2;

    // Pattern F: Auth credential harvesting (no link needed — e.g., "share your OTP/CVV/PIN")
    const isAuthHarvestScam = hasAuth && /(share|send|enter|provide|give|tell)/i.test(lowerText);

    // Pattern G: Mixed script detection — if original text has Devanagari/Bengali
    // AND translated text contains scam keywords, boost confidence
    const hasMixedScript = /[\u0900-\u097F\u0980-\u09FF]/.test(messageBody) && messageBody !== englishText;
    const isMixedScriptScam = hasMixedScript && (hasGreed || hasUrgency || hasAuth);

    return isUrgencyLinkScam || isGreedActionScam || isAuthScam || isGenericScam ||
           isHighUrgencyScam || isAuthHarvestScam || isMixedScriptScam;
  } catch (error) {
    console.error('[analyzeScamText] Detection failed, defaulting to safe:', error);
    return false; // Never crash — fail safe (false = not scam)
  }
};
