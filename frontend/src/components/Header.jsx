import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useState } from 'react';

function Header() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/30"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-white tracking-tight">Movie Sentiment Analyzer</h1>
          </motion.div>

          <nav className="hidden md:flex items-center space-x-1">
            <a
              href="/"
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                isHomePage 
                  ? 'text-white bg-slate-800' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              Analyze
            </a>
            <a
              href="/results"
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                !isHomePage 
                  ? 'text-white bg-slate-800' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              Results
            </a>
          </nav>

          <button 
            className="md:hidden p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800/50"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden border-t border-slate-800/30 py-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <nav className="flex flex-col space-y-2">
              <a
                href="/"
                className={`px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isHomePage 
                    ? 'text-white bg-slate-800' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Analyze
              </a>
              <a
                href="/results"
                className={`px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                  !isHomePage 
                    ? 'text-white bg-slate-800' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Results
              </a>
            </nav>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
}

export default Header;