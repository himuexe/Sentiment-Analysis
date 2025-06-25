import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

function Results() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const apiUrl = import.meta.env.PROD 
        ? 'https://sentiment-analysis-t7kx.onrender.com'
        : 'http://localhost:3002';
      
      const response = await fetch(`${apiUrl}/api/reviews`);
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      const data = await response.json();
      const reviews = data.data || [];
      
      const processedReviews = reviews.map(review => ({
        ...review,
        confidence: review.confidence / 100,
        text: review.review_text || review.text,
        emotions: Array.isArray(review.emotions) ? review.emotions : 
                 (typeof review.emotions === 'string' ? JSON.parse(review.emotions || '[]') : []),
        keyPhrases: Array.isArray(review.key_phrases) ? review.key_phrases : 
                   (typeof review.key_phrases === 'string' ? JSON.parse(review.key_phrases || '[]') : []),
        timestamp: review.created_at || review.timestamp
      }));
      
      setResults(processedReviews);
    } catch (error) {
      console.error('Error fetching results:', error);
      setError('Failed to load results. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment?.toLowerCase()) {
      case 'positive': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'negative': return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'neutral': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return 'text-emerald-400';
    if (confidence >= 0.6) return 'text-amber-400';
    return 'text-orange-400';
  };

  const filteredResults = results.filter(result => {
    const matchesFilter = filter === 'all' || result.sentiment?.toLowerCase() === filter;
    const searchText = result.text || result.review_text || '';
    const matchesSearch = searchText.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStats = () => {
    const total = results.length;
    const positive = results.filter(r => r.sentiment?.toLowerCase() === 'positive').length;
    const negative = results.filter(r => r.sentiment?.toLowerCase() === 'negative').length;
    const neutral = results.filter(r => r.sentiment?.toLowerCase() === 'neutral').length;
    const avgConfidence = total > 0 ? results.reduce((sum, r) => sum + (r.confidence || 0), 0) / total : 0;

    return { total, positive, negative, neutral, avgConfidence };
  };

  const stats = getStats();

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-12 max-w-6xl">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 border-2 border-indigo-400/20 border-t-indigo-400 rounded-full animate-spin" />
            <span className="text-lg text-slate-300">Loading analysis results...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12 max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-12"
      >
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <motion.h1
              className="text-4xl lg:text-5xl font-bold text-white mb-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Analysis Results
            </motion.h1>
            <motion.p
              className="text-xl text-slate-400"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              View your movie review sentiment analysis history
            </motion.p>
          </div>

          <motion.button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200 flex items-center space-x-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>New Analysis</span>
          </motion.button>
        </div>

        {error && (
          <motion.div
            className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            {error}
          </motion.div>
        )}

        {/* Statistics */}
        {results.length > 0 && (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/40 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-sm font-medium text-slate-400 mb-2">Total Reviews</h3>
              <div className="text-3xl font-bold text-white">{stats.total}</div>
            </div>

            <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/40 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-sm font-medium text-slate-400 mb-2">Avg Confidence</h3>
              <div className={`text-3xl font-bold ${getConfidenceColor(stats.avgConfidence)}`}>
                {Math.round(stats.avgConfidence * 100)}%
              </div>
            </div>

            <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/40 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-sm font-medium text-slate-400 mb-2">Positive</h3>
              <div className="text-3xl font-bold text-emerald-400">{stats.positive}</div>
            </div>

            <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/40 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-sm font-medium text-slate-400 mb-2">Negative</h3>
              <div className="text-3xl font-bold text-red-400">{stats.negative}</div>
            </div>
          </motion.div>
        )}

        {/* Search and Filter */}
        <motion.div
          className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/40 rounded-2xl p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search movie reviews..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 bg-slate-900/60 border border-slate-600/40 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-200"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {['all', 'positive', 'negative', 'neutral'].map((filterOption) => (
                <button
                  key={filterOption}
                  onClick={() => setFilter(filterOption)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    filter === filterOption
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Results List */}
          {filteredResults.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">No Results Found</h3>
              <p className="text-slate-400 mb-6">
                {results.length === 0 
                  ? "You haven't analyzed any movie reviews yet." 
                  : "No reviews match your current filters."}
              </p>
              <button
                onClick={() => navigate('/')}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200"
              >
                Start Analyzing Reviews
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredResults.map((result, index) => (
                <motion.div
                  key={result.id || index}
                  className="bg-slate-900/50 border border-slate-600/30 rounded-xl p-6 hover:bg-slate-900/70 transition-all duration-200"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                    <div className="flex-1 min-w-0 space-y-4">
                      {/* Metrics */}
                      <div className="flex flex-wrap items-center gap-3">
                        <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border ${getSentimentColor(result.sentiment)}`}>
                          {result.sentiment}
                        </div>
                        <div className={`text-sm font-semibold ${getConfidenceColor(result.confidence)}`}>
                          {Math.round((result.confidence || 0) * 100)}% confidence
                        </div>
                        {result.provider && (
                          <div className="flex items-center space-x-1 text-xs text-indigo-400">
                            <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse" />
                            <span>{result.provider}</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Review Text */}
                      <p className="text-slate-300 leading-relaxed">
                        {result.text || result.review_text}
                      </p>

                      {/* Emotions */}
                      {result.emotions && result.emotions.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-slate-400 mb-2">Emotions</h4>
                          <div className="flex flex-wrap gap-2">
                            {result.emotions.slice(0, 6).map((emotion, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-full text-sm text-purple-400"
                              >
                                {emotion}
                              </span>
                            ))}
                            {result.emotions.length > 6 && (
                              <span className="px-3 py-1.5 bg-slate-600/30 rounded-full text-sm text-slate-400">
                                +{result.emotions.length - 6} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Key Phrases */}
                      {result.keyPhrases && result.keyPhrases.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-slate-400 mb-2">Key Phrases</h4>
                          <div className="flex flex-wrap gap-2">
                            {result.keyPhrases.slice(0, 6).map((phrase, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-sm text-blue-400"
                              >
                                {phrase}
                              </span>
                            ))}
                            {result.keyPhrases.length > 6 && (
                              <span className="px-3 py-1.5 bg-slate-600/30 rounded-full text-sm text-slate-400">
                                +{result.keyPhrases.length - 6} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* AI Analysis */}
                      {result.explanation && (
                        <details className="group">
                          <summary className="text-sm font-medium text-indigo-400 cursor-pointer hover:text-indigo-300 transition-colors flex items-center gap-2">
                            <svg className="w-4 h-4 transition-transform group-open:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                            View AI Analysis
                          </summary>
                          <div className="mt-3 p-4 bg-slate-800/50 rounded-xl border border-slate-600/30">
                            <p className="text-sm text-slate-300 leading-relaxed">{result.explanation}</p>
                          </div>
                        </details>
                      )}
                    </div>

                    {/* Timestamp */}
                    <div className="flex lg:flex-col items-center lg:items-end gap-2 text-xs text-slate-500">
                      {result.timestamp && (
                        <span>
                          {new Date(result.timestamp).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Summary */}
        {results.length > 0 && (
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <p className="text-sm text-slate-400">
              Showing {filteredResults.length} of {results.length} movie reviews
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default Results; 