const positiveWords = [
    'excellent', 'amazing', 'wonderful', 'fantastic', 'great', 'good', 'awesome', 'brilliant',
    'outstanding', 'superb', 'marvelous', 'incredible', 'spectacular', 'magnificent', 'perfect',
    'beautiful', 'lovely', 'enjoyable', 'entertaining', 'compelling', 'engaging', 'captivating',
    'thrilling', 'exciting', 'inspiring', 'uplifting', 'heartwarming', 'touching', 'moving',
    'impressive', 'remarkable', 'extraordinary', 'phenomenal', 'stellar', 'top-notch', 'first-rate',
    'love', 'adore', 'like', 'enjoy', 'appreciate', 'recommend', 'praise', 'applaud',
    'masterpiece', 'gem', 'treasure', 'classic', 'timeless', 'unforgettable', 'memorable',
    'hilarious', 'funny', 'witty', 'clever', 'smart', 'genius', 'talented', 'skilled'
];

const negativeWords = [
    'terrible', 'awful', 'horrible', 'bad', 'poor', 'worst', 'hate', 'dislike',
    'boring', 'dull', 'tedious', 'slow', 'confusing', 'stupid', 'ridiculous', 'absurd',
    'disappointing', 'frustrating', 'annoying', 'irritating', 'unpleasant', 'uncomfortable',
    'disgusting', 'repulsive', 'offensive', 'disturbing', 'shocking', 'appalling',
    'pathetic', 'lame', 'weak', 'mediocre', 'subpar', 'inferior', 'flawed', 'failed',
    'waste', 'disaster', 'mess', 'garbage', 'trash', 'junk', 'crap', 'nonsense',
    'overrated', 'underwhelming', 'lackluster', 'bland', 'uninspired', 'generic', 'cliched',
    'predictable', 'cheesy', 'cringe', 'awkward', 'uncomfortable', 'painful', 'unbearable'
];

const negationWords = ['not', 'no', 'never', 'nothing', 'nobody', 'nowhere', 'neither', 'barely', 'hardly', 'scarcely'];

function preprocessText(text) {
    return text.toLowerCase()
        .replace(/[^\w\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .split(' ')
        .filter(word => word.length > 0);
}

function analyzeSentiment(text) {
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
        return {
            sentiment: 'neutral',
            confidence: 0,
            positiveScore: 0,
            negativeScore: 0,
            wordCount: 0,
            explanation: 'No text provided for analysis'
        };
    }

    const words = preprocessText(text);
    let positiveScore = 0;
    let negativeScore = 0;
    let negationFlag = false;

    for (let i = 0; i < words.length; i++) {
        const word = words[i];
        
        if (negationWords.includes(word)) {
            negationFlag = true;
            continue;
        }

        if (positiveWords.includes(word)) {
            if (negationFlag) {
                negativeScore += 1;
                negationFlag = false;
            } else {
                positiveScore += 1;
            }
        } else if (negativeWords.includes(word)) {
            if (negationFlag) {
                positiveScore += 1;
                negationFlag = false;
            } else {
                negativeScore += 1;
            }
        } else {
            negationFlag = false;
        }
    }

    const totalScore = positiveScore + negativeScore;
    let sentiment = 'neutral';
    let confidence = 0;
    let explanation = '';

    if (totalScore === 0) {
        sentiment = 'neutral';
        confidence = 0;
        explanation = 'No sentiment indicators found in the text';
    } else if (positiveScore > negativeScore) {
        sentiment = 'positive';
        confidence = Math.round((positiveScore / totalScore) * 100);
        explanation = `Found ${positiveScore} positive words and ${negativeScore} negative words`;
    } else if (negativeScore > positiveScore) {
        sentiment = 'negative';
        confidence = Math.round((negativeScore / totalScore) * 100);
        explanation = `Found ${negativeScore} negative words and ${positiveScore} positive words`;
    } else {
        sentiment = 'neutral';
        confidence = 50;
        explanation = `Equal positive (${positiveScore}) and negative (${negativeScore}) words found`;
    }

    return {
        sentiment,
        confidence,
        positiveScore,
        negativeScore,
        wordCount: words.length,
        explanation
    };
}

module.exports = { analyzeSentiment }; 