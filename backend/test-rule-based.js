const { analyzeSentiment } = require('./sentiment');

// Sample movie review texts for testing
const reviews = [
    "This movie was absolutely amazing! The acting was superb and the plot was captivating.",
    "I hated this film. The script was terrible and the actors seemed bored the entire time.",
    "It was okay. Some parts were good but others were quite boring.",
    "The visual effects were stunning, but the storyline was confusing and hard to follow."
];

function runTests() {
    console.log('\n=== RULE-BASED SENTIMENT ANALYSIS TEST ===\n');
    
    reviews.forEach(review => {
        console.log(`📝 Analyzing: "${review.substring(0, 50)}${review.length > 50 ? '...' : ''}"`);
        
        const result = analyzeSentiment(review);
        
        console.log(`✅ Result: ${result.sentiment.toUpperCase()} (${result.confidence}% confidence)`);
        console.log(`📊 Words: ${result.wordCount} total, ${result.positiveScore} positive, ${result.negativeScore} negative`);
        console.log(`🔍 Explanation: ${result.explanation}`);
        console.log('-------------------------------------------');
    });
    
    console.log('\n=== TEST COMPLETED ===');
}

runTests(); 