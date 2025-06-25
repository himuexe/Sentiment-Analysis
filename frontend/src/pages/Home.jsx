import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleAnalyze = async () => {
    if (!text.trim()) {
      setError('Please enter a movie review to analyze');
      return;
    }

    setIsAnalyzing(true);
    setError('');
    setResult(null);

    try {
      const apiUrl = import.meta.env.PROD 
        ? 'https://sentiment-analysis-t7kx.onrender.com'
        : 'http://localhost:3002';
      
      const response = await fetch(`${apiUrl}/api/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: text.trim() }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      const result = data.data || data;
      
      const mappedResult = {
        ...result,
        text: result.text || result.review_text,
        emotions: result.emotions || [],
        keyPhrases: result.keyPhrases || result.key_phrases || [],
        explanation: result.explanation || '',
        provider: result.provider || 'AI',
        confidence: result.confidence / 100
      };
      
      setResult(mappedResult);
    } catch (error) {
      console.error('Analysis error:', error);
      setError('Failed to analyze review. Please check your connection.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleAnalyze();
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

  return (
    <div className="container mx-auto px-6 py-12 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-12"
      >
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <motion.h1
            className="text-4xl lg:text-5xl font-bold text-white"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Analyze Movie Reviews
          </motion.h1>
          <motion.p
            className="text-xl text-slate-400 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            AI-powered sentiment analysis with emotion detection and context understanding
          </motion.p>
        </div>

        {/* Analysis Form */}
        <motion.div
          className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/40 rounded-2xl p-8"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">
                Movie Review
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Enter your movie review here..."
                className="w-full h-40 px-4 py-3 bg-slate-900/60 border border-slate-600/40 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-200 resize-none"
                disabled={isAnalyzing}
              />
              <div className="flex justify-between mt-2 text-xs text-slate-500">
                <span>{text.length} characters</span>
                <span>Ctrl/Cmd + Enter to analyze</span>
              </div>
            </div>

            {error && (
              <motion.div
                className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                {error}
              </motion.div>
            )}

            <motion.button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !text.trim()}
              className="w-full px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold rounded-xl transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              whileHover={!isAnalyzing && text.trim() ? { scale: 1.01 } : {}}
              whileTap={!isAnalyzing && text.trim() ? { scale: 0.99 } : {}}
            >
              {isAnalyzing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <span>Analyze Review</span>
                </>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Results */}
        {result && (
          <motion.div
            className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/40 rounded-2xl p-8 space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-white">Analysis Results</h2>
            
            {/* Core Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-900/50 rounded-xl p-6 text-center">
                <h3 className="text-sm font-medium text-slate-400 mb-3">Sentiment</h3>
                <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border ${getSentimentColor(result.sentiment)}`}>
                  {result.sentiment}
                </div>
              </div>

              <div className="bg-slate-900/50 rounded-xl p-6 text-center">
                <h3 className="text-sm font-medium text-slate-400 mb-3">Confidence</h3>
                <div className={`text-3xl font-bold ${getConfidenceColor(result.confidence)}`}>
                  {Math.round(result.confidence * 100)}%
                </div>
              </div>

              <div className="bg-slate-900/50 rounded-xl p-6 text-center">
                <h3 className="text-sm font-medium text-slate-400 mb-3">Provider</h3>
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
                  <span className="text-indigo-400 font-medium">{result.provider}</span>
                </div>
              </div>
            </div>

            {/* Emotions */}
            {result.emotions?.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Emotions Detected</h3>
                <div className="flex flex-wrap gap-2">
                  {result.emotions.map((emotion, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-full text-sm text-purple-400"
                    >
                      {emotion}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Key Phrases */}
            {result.keyPhrases?.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Key Phrases</h3>
                <div className="flex flex-wrap gap-2">
                  {result.keyPhrases.map((phrase, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-sm text-blue-400"
                    >
                      {phrase}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Explanation */}
            {result.explanation && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Analysis</h3>
                <div className="bg-slate-900/50 rounded-xl p-6">
                  <p className="text-slate-300 leading-relaxed">{result.explanation}</p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate('/results')}
                className="flex-1 px-6 py-3 bg-slate-700/50 hover:bg-slate-700 text-white font-medium rounded-xl transition-all duration-200 border border-slate-600/50"
              >
                View All Results
              </button>
              <button
                onClick={() => {
                  setText('');
                  setResult(null);
                  setError('');
                }}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-xl transition-all duration-200"
              >
                New Analysis
              </button>
            </div>
          </motion.div>
        )}

        {/* Features */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="bg-slate-800/20 border border-slate-700/20 rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">AI-Powered</h3>
            <p className="text-sm text-slate-400">Advanced ML models for accurate sentiment detection</p>
          </div>

          <div className="bg-slate-800/20 border border-slate-700/20 rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Emotion Detection</h3>
            <p className="text-sm text-slate-400">Identify complex emotions beyond basic sentiment</p>
          </div>

          <div className="bg-slate-800/20 border border-slate-700/20 rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Context Aware</h3>
            <p className="text-sm text-slate-400">Understands sarcasm and nuanced language patterns</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Home;