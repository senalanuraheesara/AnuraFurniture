import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Wand2, ArrowRight, RefreshCw } from 'lucide-react';
import api from '../services/api';
import ProductCard from '../components/product/ProductCard';

const ROOM_TYPES = ['living', 'bedroom', 'dining', 'office', 'outdoor', 'kitchen'];
const STYLES = ['modern', 'classic', 'minimalist', 'rustic', 'scandinavian', 'luxury'];
const COLORS = ['White', 'Black', 'Brown', 'Blue', 'Green', 'Beige', 'Grey', 'Natural Wood'];

export default function AIRecommendations() {
  const [step, setStep] = useState(1);
  const [preferences, setPreferences] = useState({
    budget: { min: 0, max: 200000 },
    roomType: [],
    style: [],
    colors: [],
  });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const toggleArray = (key, value) => {
    setPreferences((p) => ({
      ...p,
      [key]: p[key].includes(value) ? p[key].filter((v) => v !== value) : [...p[key], value],
    }));
  };

  const handleGetRecommendations = async () => {
    setLoading(true);
    try {
      const { data } = await api.post('/ai/recommendations', preferences);
      setResults(data);
      setStep(4);
    } catch (err) {
      console.error('Failed to get recommendations');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStep(1);
    setResults(null);
    setPreferences({ budget: { min: 0, max: 200000 }, roomType: [], style: [], colors: [] });
  };

  return (
    <>
      <Helmet>
        <title>AI Furniture Recommendations – Anura Furniture</title>
        <meta name="description" content="Get personalized furniture recommendations powered by AI. Tell us your budget, style, and room type." />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900/30">
        {/* Hero */}
        <div className="bg-gradient-to-br from-primary-900 via-primary-800 to-cyan-900 text-white pt-24 md:pt-32 pb-12 md:pb-16 px-4 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 right-10 w-80 h-80 bg-cyan-400 rounded-full blur-3xl" />
            <div className="absolute bottom-10 left-10 w-80 h-80 bg-primary-400 rounded-full blur-3xl" />
          </div>
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, type: 'spring' }}
              className="flex justify-center mb-8 relative"
            >
              <div className="relative group">
                {/* Glowing aura */}
                <motion.div 
                  animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 bg-cyan-400/30 rounded-3xl blur-xl" 
                />
                
                {/* Main icon container */}
                <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-tr from-white/10 to-white/30 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-[0_0_40px_rgba(34,211,238,0.3)] animate-float">
                  <Sparkles className="w-12 h-12 text-cyan-300 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
                  
                  {/* Rotating dashed border */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-[-4px] border border-dashed border-cyan-300/40 rounded-[28px]"
                  />
                </div>
                
                {/* Sparkle decorators */}
                <motion.div
                  animate={{ y: [0, -10, 0], opacity: [0, 1, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  className="absolute -top-4 -right-4"
                >
                  <Sparkles className="w-6 h-6 text-yellow-300" />
                </motion.div>
                <motion.div
                  animate={{ y: [0, -10, 0], opacity: [0, 1, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: 1 }}
                  className="absolute -bottom-2 -left-4"
                >
                  <Sparkles className="w-4 h-4 text-cyan-200" />
                </motion.div>
              </div>
            </motion.div>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              AI Furniture Advisor
            </h1>
            <p className="text-blue-200 text-lg">
              Tell us your preferences and our AI will find the perfect furniture for you
            </p>

            {/* Progress */}
            {step < 4 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                {[1, 2, 3].map((s) => (
                  <div key={s} className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${s <= step ? 'bg-white text-primary-900' : 'bg-white/20 text-white/60'}`}>{s}</div>
                    {s < 3 && <div className={`w-12 h-0.5 transition-all ${s < step ? 'bg-white' : 'bg-white/20'}`} />}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-12">
          <AnimatePresence mode="wait">
            {/* Step 1: Budget */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="card p-8">
                <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-2">What's your budget?</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-8">We'll find furniture that fits your financial comfort zone</p>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Min Budget (Rs.)</label>
                      <input type="number" value={preferences.budget.min} onChange={(e) => setPreferences(p => ({ ...p, budget: { ...p.budget, min: Number(e.target.value) } }))} min="0" step="5000" className="input-field" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Max Budget (Rs.)</label>
                      <input type="number" value={preferences.budget.max} onChange={(e) => setPreferences(p => ({ ...p, budget: { ...p.budget, max: Number(e.target.value) } }))} min="0" step="5000" className="input-field" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      ['Under Rs. 50,000', 0, 50000],
                      ['Rs. 50k – 150k', 50000, 150000],
                      ['Rs. 150k – 300k', 150000, 300000],
                      ['Rs. 300k – 500k', 300000, 500000],
                      ['Rs. 500k – 1M', 500000, 1000000],
                      ['No Limit', 0, 9999999],
                    ].map(([label, min, max]) => (
                      <button key={label}
                        onClick={() => setPreferences(p => ({ ...p, budget: { min, max } }))}
                        className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                          preferences.budget.min === min && preferences.budget.max === max
                            ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                            : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-primary-300'
                        }`}>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <button onClick={() => setStep(2)} className="btn-primary mt-8 w-full justify-center">
                  Next <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {/* Step 2: Room & Style */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="card p-8">
                <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-2">Room type & style</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-8">Select one or more options</p>

                <div className="space-y-6">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white mb-3">Room Type</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {ROOM_TYPES.map((room) => (
                        <button key={room}
                          onClick={() => toggleArray('roomType', room)}
                          className={`p-3 rounded-xl border-2 text-sm capitalize text-center transition-all ${
                            preferences.roomType.includes(room) ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 font-semibold' : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-primary-300'
                          }`}>
                          {room === 'living' ? '🛋️' : room === 'bedroom' ? '🛏️' : room === 'dining' ? '🍽️' : room === 'office' ? '💼' : room === 'outdoor' ? '🌿' : '🍳'} {room}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white mb-3">Preferred Style</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {STYLES.map((style) => (
                        <button key={style}
                          onClick={() => toggleArray('style', style)}
                          className={`p-3 rounded-xl border-2 text-sm capitalize text-center transition-all ${
                            preferences.style.includes(style) ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 font-semibold' : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-primary-300'
                          }`}>
                          {style}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  <button onClick={() => setStep(1)} className="btn-secondary flex-1 justify-center">Back</button>
                  <button onClick={() => setStep(3)} className="btn-primary flex-1 justify-center">Next <ArrowRight className="w-4 h-4" /></button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Colors */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="card p-8">
                <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-2">Color preferences</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-8">Select colors you love</p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {COLORS.map((color) => (
                    <button key={color}
                      onClick={() => toggleArray('colors', color)}
                      className={`p-3 rounded-xl border-2 text-sm font-medium text-center transition-all ${
                        preferences.colors.includes(color) ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300' : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-primary-300'
                      }`}>
                      {color}
                    </button>
                  ))}
                </div>

                <div className="flex gap-3 mt-8">
                  <button onClick={() => setStep(2)} className="btn-secondary flex-1 justify-center">Back</button>
                  <button onClick={handleGetRecommendations} disabled={loading} className="btn-primary flex-1 justify-center">
                    {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Getting AI Picks...</> : <><Wand2 className="w-4 h-4" /> Get AI Recommendations</>}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Results */}
            {step === 4 && results && (
              <motion.div key="step4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white">Your AI Picks 🎯</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Handpicked by AI based on your preferences</p>
                  </div>
                  <button onClick={reset} className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <RefreshCw className="w-4 h-4" /> Start Over
                  </button>
                </div>

                {results.products.length === 0 ? (
                  <div className="card p-12 text-center">
                    <span className="text-5xl mb-4 block">🔍</span>
                    <p className="text-gray-500 dark:text-gray-400">No products found for your preferences. Try adjusting your budget or style.</p>
                    <button onClick={reset} className="btn-primary mt-4">Try Again</button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                    {results.products.map((product) => (
                      <ProductCard key={product._id} product={product} />
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom nav spacer */}
      <div className="h-20 lg:hidden" />
    </>
  );
}
