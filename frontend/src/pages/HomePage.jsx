import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (text.trim() && !loading) {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('http://localhost:3002/api/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text })
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || 'Analysis failed');
        }

        if (result.success && result.data) {
          navigate('/results', { state: { results: result.data } });
          setLoading(false);
        } else {
          throw new Error('Invalid server response');
        }
      } catch (err) {
        if (err.name === 'TypeError' && err.message.includes('fetch')) {
          setError('Unable to connect to analysis server. Please ensure the backend is running.');
        } else {
          setError(err.message);
        }
        setLoading(false);
      }
    }
  };

  const isDisabled = loading || text.trim().length < 10;

  const loadingIndicator = (
    <motion.div 
      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_70%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.08),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(14,165,233,0.08),transparent_50%)]"></div>
      
      <div className="relative z-10 container mx-auto px-6 py-16 max-w-4xl">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-8 shadow-2xl"
            initial={{ scale: 0.8, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          >
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </motion.div>
          
          <h1 className="text-5xl lg:text-7xl font-bold mb-4 bg-gradient-to-r from-white via-blue-100 to-blue-300 bg-clip-text text-transparent">
            Sentiment Analyzer
          </h1>
          <p className="text-xl text-slate-300 font-light tracking-wide">
            Advanced AI-powered sentiment analysis for your text content
          </p>
        </motion.div>

        <motion.div
          className="backdrop-blur-xl bg-white/[0.02] border border-white/10 rounded-3xl p-8 lg:p-12 shadow-2xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
        >
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-2">
              Analyze Your Text
            </h2>
            <p className="text-slate-400 text-sm">
              Enter your content below to get instant sentiment analysis with confidence scoring
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="relative">
              <textarea
                aria-label="Text for sentiment analysis"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter your text here for sentiment analysis..."
                rows={8}
                maxLength={10000}
                className="w-full px-6 py-4 bg-slate-900/50 border border-slate-700/50 rounded-2xl
                         text-white placeholder-slate-500 resize-none
                         focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50
                         transition-all duration-300 backdrop-blur-sm"
              />
              
              <div className="absolute bottom-4 right-4 flex items-center space-x-4">
                <span className={`text-xs ${
                  text.length > 9000 ? 'text-red-400' : 
                  text.length > 7000 ? 'text-yellow-400' : 
                  'text-slate-400'
                }`}>
                  {text.length}/10000
                </span>
                
                {text.trim().length > 0 && text.trim().length < 10 && (
                  <span className="text-xs text-red-400">
                    Min 10 characters
                  </span>
                )}
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-red-500/10 border border-red-500/20 rounded-xl p-4"
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              </motion.div>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button
                onClick={handleSubmit}
                disabled={isDisabled}
                whileTap={{ scale: isDisabled ? 1 : 0.98 }}
                whileHover={isDisabled ? {} : { scale: 1.02 }}
                className={`flex-1 relative overflow-hidden py-4 px-8 rounded-2xl font-medium transition-all duration-300 
                  ${isDisabled 
                    ? 'bg-slate-800/50 text-slate-500 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40'
                  }
                `}
                aria-label="Analyze Sentiment"
              >
                <div className="relative z-10 flex items-center justify-center space-x-3">
                  {loading ? loadingIndicator : (
                    <>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span>Analyze Sentiment</span>
                    </>
                  )}
                </div>
                
                {!isDisabled && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                )}
              </motion.button>
              
              <motion.button
                onClick={() => setText('')}
                whileTap={{ scale: 0.98 }}
                whileHover={{ scale: 1.02 }}
                className="sm:w-auto px-6 py-4 bg-slate-800/50 border border-slate-700/50 text-slate-300 rounded-2xl
                         hover:bg-slate-700/50 transition-all duration-300"
              >
                Clear
              </motion.button>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {[
            { icon: '🎯', title: 'Accurate Analysis', desc: 'Advanced AI models for precise sentiment detection' },
            { icon: '⚡', title: 'Real-time Results', desc: 'Get instant feedback on your text sentiment' },
            { icon: '📊', title: 'Detailed Insights', desc: 'Comprehensive breakdown with confidence scores' }
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-sm"
              whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.05)' }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-slate-400">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

export default HomePage;