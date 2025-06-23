const { analyzeSentiment } = require('./sentiment');

async function analyzeHybridSentiment(text) {
    const result = analyzeSentiment(text);
    
    return {
        text: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
        sentiment: result.sentiment,
        confidence: result.confidence,
        explanation: result.explanation,
        details: {
            positiveScore: result.positiveScore,
            negativeScore: result.negativeScore,
            wordCount: result.wordCount
        },
        timestamp: new Date().toISOString()
    };
}

module.exports = { analyzeHybridSentiment };