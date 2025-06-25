import { motion } from 'framer-motion';

function Footer() {
  return (
    <motion.footer 
      className="bg-slate-950/90 border-t border-slate-800/30 mt-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white">Movie Sentiment Analyzer</h3>
            </div>
            <p className="text-sm text-slate-400 max-w-xs">
              AI-powered movie review sentiment analysis with advanced emotion detection and context understanding.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Features</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>Sentiment Analysis</li>
              <li>Emotion Detection</li>
              <li>Context Understanding</li>
              <li>Confidence Scoring</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Technology</h4>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded text-xs text-indigo-400">
                Gemini AI
              </span>
              <span className="px-2 py-1 bg-purple-500/10 border border-purple-500/20 rounded text-xs text-purple-400">
                React
              </span>
              <span className="px-2 py-1 bg-slate-500/10 border border-slate-500/20 rounded text-xs text-slate-400">
                Node.js
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800/30 flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
          <p className="text-xs text-slate-500">
            © 2025 Movie Sentiment Analyzer
          </p>
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <span>Powered by AI</span>
            <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}

export default Footer;