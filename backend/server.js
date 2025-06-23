require('dotenv').config();
const http = require('http');
const { analyzeHybridSentiment } = require('./hybrid-sentiment');

const PORT = process.env.PORT || 3002;

const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    if (req.method === 'GET' && req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Sentiment Analysis API Server is running!');
        return;
    }
    
    if (req.method === 'GET' && req.url === '/api/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            service: 'Sentiment Analysis API'
        }));
        return;
    }
    
    if (req.method === 'POST' && req.url === '/api/analyze') {
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

server.listen(PORT, () => {
    console.log(`Sentiment Analysis Server is running on port ${PORT}`);
});

module.exports = server; 