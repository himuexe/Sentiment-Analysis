const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'sentiment_analysis.db');

class Database {
    constructor() {
        this.db = null;
    }

    async init() {
        return new Promise((resolve, reject) => {
            this.db = new sqlite3.Database(dbPath, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                this.createTables().then(resolve).catch(reject);
            });
        });
    }

    async createTables() {
        return new Promise((resolve, reject) => {
            const createTableSQL = `
                CREATE TABLE IF NOT EXISTS reviews (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    review_text TEXT NOT NULL,
                    sentiment TEXT NOT NULL,
                    confidence INTEGER NOT NULL,
                    positive_score INTEGER NOT NULL,
                    negative_score INTEGER NOT NULL,
                    word_count INTEGER NOT NULL,
                    explanation TEXT NOT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    provider TEXT DEFAULT 'rule-based',
                    ai_powered BOOLEAN DEFAULT FALSE,
                    intensity INTEGER DEFAULT 1,
                    emotions TEXT DEFAULT '[]',
                    context_understanding TEXT DEFAULT '',
                    key_phrases TEXT DEFAULT '[]'
                )
            `;

            this.db.run(createTableSQL, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                this.addNewColumns().then(resolve).catch(reject);
            });
        });
    }

    async addNewColumns() {
        const alterStatements = [
            'ALTER TABLE reviews ADD COLUMN provider TEXT DEFAULT "rule-based"',
            'ALTER TABLE reviews ADD COLUMN ai_powered BOOLEAN DEFAULT FALSE',
            'ALTER TABLE reviews ADD COLUMN intensity INTEGER DEFAULT 1',
            'ALTER TABLE reviews ADD COLUMN emotions TEXT DEFAULT "[]"',
            'ALTER TABLE reviews ADD COLUMN context_understanding TEXT DEFAULT ""',
            'ALTER TABLE reviews ADD COLUMN key_phrases TEXT DEFAULT "[]"'
        ];

        for (const statement of alterStatements) {
            await new Promise((resolve) => {
                this.db.run(statement, (err) => {
                    resolve();
                });
            });
        }
    }

    async saveReview(reviewData) {
        return new Promise((resolve, reject) => {
            const {
                review_text,
                sentiment,
                confidence,
                positive_score,
                negative_score,
                word_count,
                explanation,
                provider = 'rule-based',
                ai_powered = false,
                intensity = 1,
                emotions = [],
                contextUnderstanding = '',
                keyPhrases = []
            } = reviewData;

            const insertSQL = `
                INSERT INTO reviews (
                    review_text, sentiment, confidence, 
                    positive_score, negative_score, word_count, explanation,
                    provider, ai_powered, intensity, emotions, context_understanding, key_phrases
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            this.db.run(insertSQL, [
                review_text,
                sentiment,
                confidence,
                positive_score,
                negative_score,
                word_count,
                explanation,
                provider,
                ai_powered ? 1 : 0,
                intensity,
                JSON.stringify(emotions),
                contextUnderstanding,
                JSON.stringify(keyPhrases)
            ], function(err) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve({ id: this.lastID });
            });
        });
    }

    async getRecentReviews(limit = 10) {
        return new Promise((resolve, reject) => {
            const selectSQL = `
                SELECT id, review_text, sentiment, confidence, 
                       positive_score, negative_score, word_count, 
                       explanation, created_at, provider, ai_powered, 
                       intensity, emotions, context_understanding, key_phrases
                FROM reviews 
                ORDER BY created_at DESC 
                LIMIT ?
            `;

            this.db.all(selectSQL, [limit], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                
                const processedRows = rows.map(row => ({
                    ...row,
                    ai_powered: Boolean(row.ai_powered),
                    emotions: row.emotions ? JSON.parse(row.emotions) : [],
                    key_phrases: row.key_phrases ? JSON.parse(row.key_phrases) : []
                }));
                
                resolve(processedRows);
            });
        });
    }

    async getReviewById(id) {
        return new Promise((resolve, reject) => {
            const selectSQL = `
                SELECT id, review_text, sentiment, confidence,
                       positive_score, negative_score, word_count,
                       explanation, created_at, provider, ai_powered,
                       intensity, emotions, context_understanding, key_phrases
                FROM reviews 
                WHERE id = ?
            `;

            this.db.get(selectSQL, [id], (err, row) => {
                if (err) {
                    reject(err);
                    return;
                }
                
                if (row) {
                    row.ai_powered = Boolean(row.ai_powered);
                    row.emotions = row.emotions ? JSON.parse(row.emotions) : [];
                    row.key_phrases = row.key_phrases ? JSON.parse(row.key_phrases) : [];
                }
                
                resolve(row);
            });
        });
    }

    async getStats() {
        return new Promise((resolve, reject) => {
            const statsSQL = `
                SELECT 
                    COUNT(*) as total_reviews,
                    COUNT(CASE WHEN sentiment = 'positive' THEN 1 END) as positive_count,
                    COUNT(CASE WHEN sentiment = 'negative' THEN 1 END) as negative_count,
                    COUNT(CASE WHEN sentiment = 'neutral' THEN 1 END) as neutral_count,
                    AVG(confidence) as avg_confidence,
                    COUNT(CASE WHEN ai_powered = 1 THEN 1 END) as ai_powered_count,
                    COUNT(CASE WHEN provider = 'gemini' THEN 1 END) as gemini_count,
                    AVG(intensity) as avg_intensity
                FROM reviews
            `;

            this.db.get(statsSQL, (err, row) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(row);
            });
        });
    }

    close() {
        if (this.db) {
            this.db.close();
        }
    }
}

const database = new Database();

module.exports = database; 