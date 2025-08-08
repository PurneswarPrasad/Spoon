require('dotenv').config();
const { GoogleGenAI, Type } = require('@google/genai');

// Check if environment variables are set
if (!process.env.GEMINI_API_KEY) {
  console.log('❌ GEMINI_API_KEY not found in environment variables!');
  console.log('\n📝 Please check your .env file contains:');
  console.log('GEMINI_API_KEY=your_gemini_api_key_here');
  process.exit(1);
}

// Initialize Google GenAI
const ai = new GoogleGenAI({});

async function testGemini() {
  try {
    console.log('🔍 Testing Gemini API connection...');
    console.log('📝 API Key (first 10 chars):', process.env.GEMINI_API_KEY.substring(0, 10) + '...');
    
    // Test with a simple structured output
    const testSchema = {
      type: Type.OBJECT,
      properties: {
        message: {
          type: Type.STRING,
          description: "A greeting message"
        },
        status: {
          type: Type.STRING,
          description: "API status"
        }
      },
      required: ["message", "status"],
      propertyOrdering: ["message", "status"]
    };

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Say 'Hello, Gemini is working!' and confirm the API status is 'working'.",
      config: {
        responseMimeType: "application/json",
        responseSchema: testSchema,
        thinkingConfig: {
          thinkingBudget: 0, // Disable thinking for faster response
        },
      }
    });

    console.log('✅ Gemini API is working!');
    console.log('🤖 Structured JSON Response:', response.text);
    
    // Parse and verify JSON
    try {
      const parsed = JSON.parse(response.text);
      console.log('📊 Parsed Response:', parsed);
    } catch (parseError) {
      console.log('⚠️ JSON parsing failed, but API is working');
    }
    
  } catch (error) {
    console.error('❌ Gemini API test failed:', error.message);
    
    if (error.message.includes('401')) {
      console.log('🔑 Authentication failed - check your API key');
    } else if (error.message.includes('429')) {
      console.log('⏰ Rate limit exceeded - try again later');
    } else if (error.message.includes('quota')) {
      console.log('💰 Quota exceeded - check your Gemini account');
    } else {
      console.log('🔧 Other error - check your internet connection and API key');
    }
  }
}

testGemini();
