const { analyzeAISentiment } = require('./ai-sentiment');

async function analyzeHybridSentiment(text) {
    try {
        // The AI sentiment analyzer already has local fallback built-in
        const result = await analyzeAISentiment(text);
        
        return {
            text: result.text,
            sentiment: result.sentiment,
            confidence: result.confidence,
            explanation: result.explanation,
            details: {
                positiveScore: result.details.positiveScore,
                negativeScore: result.details.negativeScore,
                wordCount: result.details.wordCount
            },
            timestamp: result.timestamp,
            provider: result.provider,
            aiPowered: result.aiPowered,
            intensity: result.intensity,
            emotions: result.emotions,
            contextUnderstanding: result.contextUnderstanding,
            keyPhrases: result.keyPhrases
        };
        
    } catch (error) {
        console.error('Error in hybrid sentiment analysis:', error);
        
        // Final fallback - basic analysis
        const words = text.toLowerCase().split(/\W+/).filter(w => w.length > 0);
        const basicSentiment = words.some(w => ['good', 'great', 'excellent', 'amazing'].includes(w)) ? 'positive' :
                             words.some(w => ['bad', 'terrible', 'awful', 'horrible'].includes(w)) ? 'negative' : 'neutral';
        
        return {
            text: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
            sentiment: basicSentiment,
            confidence: 30,
            explanation: 'Basic fallback analysis due to system error',
            details: {
                positiveScore: basicSentiment === 'positive' ? 30 : 0,
                negativeScore: basicSentiment === 'negative' ? 30 : 0,
                wordCount: words.length
            },
            timestamp: new Date().toISOString(),
            provider: 'fallback',
            aiPowered: false,
            intensity: 1,
            emotions: [basicSentiment],
            contextUnderstanding: 'Basic keyword analysis',
            keyPhrases: []
        };
    }
}

module.exports = { analyzeHybridSentiment };