import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const results = location.state?.results;

  if (!results) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white">
        <div className="text-center space-y-4">
          <p className="text-xl">No results to display</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const handleNewAnalysis = () => {
    navigate('/');
  };

  const getSentimentConfig = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return {
          color: 'from-emerald-500 to-teal-400',
          bg: 'bg-emerald-500/10',
          border: 'border-emerald-500/20',
          icon: '😊',
          textColor: 'text-emerald-400'
        };
      case 'negative':
        return {
          color: 'from-rose-500 to-red-400',
          bg: 'bg-rose-500/10',
          border: 'border-rose-500/20',
          icon: '😞',
          textColor: 'text-rose-400'
        };
      case 'neutral':
        return {
          color: 'from-amber-500 to-yellow-400',
          bg: 'bg-amber-500/10',
          border: 'border-amber-500/20',
          icon: '😐',
          textColor: 'text-amber-400'
        };
      default:
        return {
          color: 'from-slate-500 to-gray-400',
          bg: 'bg-slate-500/10',
          border: 'border-slate-500/20',
          icon: '🤔',
          textColor: 'text-slate-400'
        };
    }
  };

  const sentimentConfig = getSentimentConfig(results.sentiment);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_70%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.08),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(14,165,233,0.08),transparent_50%)]"></div>
      
      <div className="relative z-10 container mx-auto px-6 py-16 max-w-5xl">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl mb-6 shadow-xl"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          >
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </motion.div>
          
          <h1 className="text-4xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-blue-100 to-blue-300 bg-clip-text text-transparent">
            Analysis Complete
          </h1>
          <p className="text-lg text-slate-300 font-light">
            Here are your detailed sentiment analysis results
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            className="lg:col-span-2 space-y-8"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="backdrop-blur-xl bg-white/[0.02] border border-white/10 rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-white">Sentiment Result</h2>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-slate-400">Analysis Complete</span>
                </div>
              </div>
              
              <div className={`${sentimentConfig.bg} ${sentimentConfig.border} border rounded-2xl p-6 mb-6`}>
                <div className="flex items-center justify-center mb-4">
                  <motion.div
                    className={`inline-flex items-center space-x-4 px-8 py-4 rounded-2xl bg-gradient-to-r ${sentimentConfig.color} text-white font-bold text-xl shadow-lg`}
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.6, delay: 0.5 }}
                  >
                    <span className="text-3xl">{sentimentConfig.icon}</span>
                    <span className="uppercase tracking-wider">{results.sentiment}</span>
                  </motion.div>
                </div>
                
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-2">
                    {results.confidence}%
                  </div>
                  <p className="text-slate-300 text-sm uppercase tracking-wider">Confidence Score</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-slate-900/40 border border-slate-700/30 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-emerald-400 mb-1">+{results.details.positiveScore}</div>
                  <p className="text-xs text-slate-400 uppercase tracking-wide">Positive</p>
                </div>
                <div className="bg-slate-900/40 border border-slate-700/30 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-rose-400 mb-1">-{results.details.negativeScore}</div>
                  <p className="text-xs text-slate-400 uppercase tracking-wide">Negative</p>
                </div>
                <div className="bg-slate-900/40 border border-slate-700/30 rounded-xl p-4 text-center col-span-2 md:col-span-1">
                  <div className="text-2xl font-bold text-blue-400 mb-1">{results.details.wordCount}</div>
                  <p className="text-xs text-slate-400 uppercase tracking-wide">Words</p>
                </div>
              </div>
            </div>

            <div className="backdrop-blur-xl bg-white/[0.02] border border-white/10 rounded-3xl p-8 shadow-2xl">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Analysis Explanation
              </h3>
              <p className="text-slate-300 leading-relaxed">{results.explanation}</p>
            </div>

            <div className="backdrop-blur-xl bg-white/[0.02] border border-white/10 rounded-3xl p-8 shadow-2xl">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V4a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-6l-4 4z" />
                </svg>
                Analyzed Text
              </h3>
              <div className="bg-slate-900/40 border border-slate-700/30 rounded-xl p-6">
                <p className="text-slate-200 italic leading-relaxed">{results.text}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div className="backdrop-blur-xl bg-white/[0.02] border border-white/10 rounded-3xl p-6 shadow-2xl">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <motion.button
                  onClick={handleNewAnalysis}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl
                           shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 transition-all duration-300 font-medium"
                  aria-label="Start a new analysis"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>New Analysis</span>
                  </div>
                </motion.button>
              </div>
            </div>

            <div className="backdrop-blur-xl bg-white/[0.02] border border-white/10 rounded-3xl p-6 shadow-2xl">
              <h3 className="text-lg font-semibold text-white mb-4">Performance Metrics</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-slate-400">Accuracy</span>
                    <span className="text-sm font-medium text-white">{results.confidence}%</span>
                  </div>
                  <div className="w-full bg-slate-800/50 rounded-full h-2">
                    <motion.div
                      className={`h-2 rounded-full bg-gradient-to-r ${sentimentConfig.color}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${results.confidence}%` }}
                      transition={{ duration: 1, delay: 0.8 }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-slate-400">Processing Speed</span>
                    <span className="text-sm font-medium text-white">0.3s</span>
                  </div>
                  <div className="w-full bg-slate-800/50 rounded-full h-2">
                    <motion.div
                      className="h-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-400"
                      initial={{ width: 0 }}
                      animate={{ width: '95%' }}
                      transition={{ duration: 1, delay: 1 }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-slate-400">Text Complexity</span>
                    <span className="text-sm font-medium text-white">Medium</span>
                  </div>
                  <div className="w-full bg-slate-800/50 rounded-full h-2">
                    <motion.div
                      className="h-2 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400"
                      initial={{ width: 0 }}
                      animate={{ width: '60%' }}
                      transition={{ duration: 1, delay: 1.2 }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default ResultsPage;