require('dotenv').config();
const http = require('http');
const url = require('url');
const { analyzeHybridSentiment } = require('./hybrid-sentiment');
const database = require('./database');

const PORT = process.env.PORT || 3002;

async function initializeServer() {
    try {
        await database.init();
        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Failed to initialize database:', error);
        process.exit(1);
    }
}

const server = http.createServer(async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    
    if (req.method === 'GET' && pathname === '/') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Sentiment Analysis API Server is running!');
        return;
    }
    
    if (req.method === 'GET' && pathname === '/api/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            service: 'Sentiment Analysis API'
        }));
        return;
    }

    if (req.method === 'GET' && pathname === '/api/reviews') {
        try {
            const limit = parseInt(parsedUrl.query.limit) || 10;
            const reviews = await database.getRecentReviews(limit);
            
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: true,
                data: reviews
            }));
        } catch (error) {
            console.error('Error fetching reviews:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                error: 'Internal server error',
                message: 'Failed to fetch reviews'
            }));
        }
        return;
    }

    if (req.method === 'GET' && pathname === '/api/stats') {
        try {
            const stats = await database.getStats();
            
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: true,
                data: stats
            }));
        } catch (error) {
            console.error('Error fetching stats:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                error: 'Internal server error',
                message: 'Failed to fetch statistics'
            }));
        }
        return;
    }
    
    if (req.method === 'POST' && pathname === '/api/analyze') {
        let body = '';
        
        req.on('data', chunk => {
            body += chunk.toString();
        });
        
        req.on('end', async () => {
            try {
                const data = JSON.parse(body);
                const { text } = data;
                
                if (!text) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        error: 'Text is required',
                        message: 'Please provide text to analyze'
                    }));
                    return;
                }

                if (typeof text !== 'string') {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        error: 'Invalid text format',
                        message: 'Text must be a string'
                    }));
                    return;
                }

                if (text.length > 10000) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        error: 'Text too long',
                        message: 'Text must be less than 10000 characters'
                    }));
                    return;
                }

                const result = await analyzeHybridSentiment(text);
                
                try {
                    await database.saveReview({
                        review_text: text,
                        sentiment: result.sentiment,
                        confidence: result.confidence,
                        positive_score: result.details.positiveScore,
                        negative_score: result.details.negativeScore,
                        word_count: result.details.wordCount,
                        explanation: result.explanation,
                        provider: result.provider || 'rule-based',
                        ai_powered: result.aiPowered || false,
                        intensity: result.intensity || 1,
                        emotions: result.emotions || [],
                        contextUnderstanding: result.contextUnderstanding || '',
                        keyPhrases: result.keyPhrases || []
                    });
                } catch (dbError) {
                    console.error('Error saving to database:', dbError);
                }
                
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: true,
                    data: result
                }));
                
            } catch (error) {
                console.error('Error analyzing sentiment:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    error: 'Internal server error',
                    message: 'Failed to analyze sentiment'
                }));
            }
        });
        return;
    }
    
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
});

initializeServer().then(() => {
    server.listen(PORT, () => {
        console.log(`Sentiment Analysis Server is running on port ${PORT}`);
    });
});

process.on('SIGTERM', () => {
    console.log('SIGTERM received, closing database connection');
    database.close();
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT received, closing database connection');
    database.close();
    process.exit(0);
});

module.exports = server; 