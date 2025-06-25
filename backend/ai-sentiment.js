const { GoogleGenerativeAI } = require('@google/generative-ai');

class AISentimentAnalyzer {
    constructor() {
        this.geminiApiKey = process.env.GEMINI_API_KEY;
        this.genAI = this.geminiApiKey ? new GoogleGenerativeAI(this.geminiApiKey) : null;
        this.model = this.genAI ? this.genAI.getGenerativeModel({ model: "gemini-2.0-flash" }) : null;
        
        this.sentimentPrompt = `You are an expert sentiment analysis AI. Analyze the following text and provide a detailed sentiment analysis.

Please respond in valid JSON format with the following structure:
{
  "sentiment": "positive|negative|neutral",
  "confidence": <number between 0-100>,
  "intensity": <number between 1-10>,
  "emotions": ["emotion1", "emotion2"],
  "explanation": "detailed analysis of why this sentiment was determined",
  "context_understanding": "analysis of context, sarcasm, or complex language patterns",
  "key_phrases": ["phrase1", "phrase2"]
}

Rules:
- Be accurate and nuanced in your analysis
- Consider context, sarcasm, and complex emotions
- Provide confidence scores based on certainty
- Identify key emotional indicators
- Explain your reasoning clearly

Text to analyze: `;
    }

    async analyzeWithGemini(text) {
        if (!this.model) {
            throw new Error('Gemini API key not configured');
        }

        try {
            const prompt = this.sentimentPrompt + `"${text}"`;
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const responseText = response.text();
            
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('Invalid JSON response from Gemini');
            }
            
            const parsedResult = JSON.parse(jsonMatch[0]);
            
            return {
                provider: 'gemini',
                sentiment: parsedResult.sentiment,
                confidence: parsedResult.confidence || 50,
                intensity: parsedResult.intensity || 5,
                emotions: parsedResult.emotions || [],
                explanation: parsedResult.explanation || 'AI-powered sentiment analysis completed',
                contextUnderstanding: parsedResult.context_understanding || '',
                keyPhrases: parsedResult.key_phrases || [],
                details: {
                    positiveScore: parsedResult.sentiment === 'positive' ? parsedResult.confidence : 0,
                    negativeScore: parsedResult.sentiment === 'negative' ? parsedResult.confidence : 0,
                    neutralScore: parsedResult.sentiment === 'neutral' ? parsedResult.confidence : 0,
                    wordCount: text.split(' ').length
                }
            };
        } catch (error) {
            throw error;
        }
    }

    analyzeLocalSentiment(text) {
        const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'love', 'like', 'enjoy', 'happy'];
        const negativeWords = ['bad', 'terrible', 'awful', 'horrible', 'hate', 'dislike', 'sad', 'angry', 'disappointed', 'frustrated'];
        
        const words = text.toLowerCase().split(/\W+/);
        let positiveCount = 0;
        let negativeCount = 0;
        
        words.forEach(word => {
            if (positiveWords.includes(word)) positiveCount++;
            if (negativeWords.includes(word)) negativeCount++;
        });
        
        let sentiment = 'neutral';
        let confidence = 50;
        
        if (positiveCount > negativeCount) {
            sentiment = 'positive';
            confidence = Math.min(60 + (positiveCount * 10), 90);
        } else if (negativeCount > positiveCount) {
            sentiment = 'negative';
            confidence = Math.min(60 + (negativeCount * 10), 90);
        }
        
        return {
            provider: 'local',
            sentiment,
            confidence,
            intensity: Math.ceil(confidence / 15),
            emotions: [sentiment],
            explanation: `Local analysis: Found ${positiveCount} positive and ${negativeCount} negative indicators`,
            contextUnderstanding: 'Basic keyword-based analysis',
            keyPhrases: [],
            details: {
                positiveScore: positiveCount * 20,
                negativeScore: negativeCount * 20,
                neutralScore: Math.max(0, 100 - (positiveCount + negativeCount) * 20),
                wordCount: words.filter(w => w.length > 0).length
            }
        };
    }

    async analyze(text) {
        if (!text || typeof text !== 'string' || text.trim().length === 0) {
            return {
                provider: 'fallback',
                sentiment: 'neutral',
                confidence: 0,
                intensity: 1,
                emotions: [],
                explanation: 'No text provided for analysis',
                contextUnderstanding: '',
                keyPhrases: [],
                details: {
                    positiveScore: 0,
                    negativeScore: 0,
                    neutralScore: 0,
                    wordCount: 0
                }
            };
        }

        let result;

        try {
            if (this.geminiApiKey && this.model) {
                result = await this.analyzeWithGemini(text);
            } else {
                throw new Error('Gemini API key not configured');
            }
        } catch (error) {
            result = this.analyzeLocalSentiment(text);
        }

        return {
            ...result,
            text: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
            timestamp: new Date().toISOString(),
            aiPowered: result.provider === 'gemini'
        };
    }
}

const aiAnalyzer = new AISentimentAnalyzer();

async function analyzeAISentiment(text) {
    return await aiAnalyzer.analyze(text);
}

module.exports = { analyzeAISentiment, AISentimentAnalyzer }; 