const { analyzeAISentiment } = require('./ai-sentiment');
const { analyzeSentiment } = require('./sentiment');

async function analyzeHybridSentiment(text) {
    try {
        const aiResult = await analyzeAISentiment(text);
        
        if (aiResult.provider === 'local') {
            const fallbackResult = analyzeSentiment(text);
            
            return {
                text: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
                sentiment: fallbackResult.sentiment,
                confidence: fallbackResult.confidence,
                explanation: fallbackResult.explanation,
                details: {
                    positiveScore: fallbackResult.positiveScore,
                    negativeScore: fallbackResult.negativeScore,
                    wordCount: fallbackResult.wordCount
                },
                timestamp: new Date().toISOString(),
                provider: 'rule-based',
                aiPowered: false
            };
        }
        
        return {
            text: aiResult.text,
            sentiment: aiResult.sentiment,
            confidence: aiResult.confidence,
            explanation: aiResult.explanation,
            details: {
                positiveScore: aiResult.details.positiveScore,
                negativeScore: aiResult.details.negativeScore,
                wordCount: aiResult.details.wordCount
            },
            timestamp: aiResult.timestamp,
            provider: aiResult.provider,
            aiPowered: true,
            intensity: aiResult.intensity,
            emotions: aiResult.emotions,
            contextUnderstanding: aiResult.contextUnderstanding,
            keyPhrases: aiResult.keyPhrases
        };
        
    } catch (error) {
        const fallbackResult = analyzeSentiment(text);
        return {
            text: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
            sentiment: fallbackResult.sentiment,
            confidence: fallbackResult.confidence,
            explanation: fallbackResult.explanation,
            details: {
                positiveScore: fallbackResult.positiveScore,
                negativeScore: fallbackResult.negativeScore,
                wordCount: fallbackResult.wordCount
            },
            timestamp: new Date().toISOString(),
            provider: 'rule-based',
            aiPowered: false
        };
    }
}

module.exports = { analyzeHybridSentiment };