/**
 * AI Service for DSU LifeLink
 * Handles ChatGPT fallback responses for unknown queries.
 */

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const API_URL = "https://api.openai.com/v1/chat/completions";

/**
 * Sends user message to ChatGPT and returns a short, app-specific response.
 */
export const getAIResponse = async (userMessage) => {
  if (!OPENAI_API_KEY || OPENAI_API_KEY === "your_openai_api_key_here" || OPENAI_API_KEY.includes("your_")) {
    return {
      text: "AI service is not configured. Please set a valid OpenAI API key in the .env file.",
      isError: true
    };
  }

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // Faster and more cost-effective
        messages: [
          {
            content: `You are the "LifeLink AI Assistant", a friendly and helpful health guide. 
            Guidelines:
            1. Response Style: Simple, clear, and friendly. No long paragraphs.
            2. Medical Safety: If the user asks about symptoms, provide basic care tips (rest, hydration) but ALWAYS state: "I recommend checking with a professional" and for serious issues: "Please visit a doctor or hospital immediately."
            3. Topics: Help with Blood Donation (who can donate, safety), First Aid (step-by-step), and Emergency Support (blood needed, ambulance).
            4. Emergency: If keywords like "urgent", "accident", "help" are detected, show concern and suggest immediate steps like calling an ambulance or creating a blood request.
            5. Non-Health: Answer normal queries politely.
            6. Core Rule: Do NOT act as a real doctor or give a final diagnosis.`
          },
          {
            role: "user",
            content: userMessage
          }
        ],
        temperature: 0.7,
        max_tokens: 150,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error("API rate limit or credit limit reached. Please check your OpenAI billing.");
      }
      throw new Error(`OpenAI API Error: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      text: data.choices[0].message.content,
      isBot: true
    };
  } catch (error) {
    console.error("AI Fallback Error:", error);
    let errorMsg = "I'm having a little trouble connecting to my AI brain. Please try again or use the buttons below!";
    if (error.message.includes("billing") || error.message.includes("limit")) {
      errorMsg = "AI Fallback is currently unavailable (API Limit). Please use the quick actions below!";
    }
    return {
      text: errorMsg,
      isError: true
    };
  }
};
