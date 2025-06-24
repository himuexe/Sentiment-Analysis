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
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `;

            this.db.run(createTableSQL, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
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
                explanation
            } = reviewData;

            const insertSQL = `
                INSERT INTO reviews (
                    review_text, sentiment, confidence, 
                    positive_score, negative_score, word_count, explanation
                ) VALUES (?, ?, ?, ?, ?, ?, ?)
            `;

            this.db.run(insertSQL, [
                review_text,
                sentiment,
                confidence,
                positive_score,
                negative_score,
                word_count,
                explanation
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
                       explanation, created_at
                FROM reviews 
                ORDER BY created_at DESC 
                LIMIT ?
            `;

            this.db.all(selectSQL, [limit], (err, rows) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(rows);
            });
        });
    }

    async getReviewById(id) {
        return new Promise((resolve, reject) => {
            const selectSQL = `
                SELECT id, review_text, sentiment, confidence,
                       positive_score, negative_score, word_count,
                       explanation, created_at
                FROM reviews 
                WHERE id = ?
            `;

            this.db.get(selectSQL, [id], (err, row) => {
                if (err) {
                    reject(err);
                    return;
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
                    AVG(confidence) as avg_confidence
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