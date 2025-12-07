
import React, { useState } from 'react';
import { Coins, Repeat } from 'lucide-react';

interface CurrencyViewProps {
  rate: number;
  setRate: React.Dispatch<React.SetStateAction<number>>;
}

const CurrencyView: React.FC<CurrencyViewProps> = ({ rate, setRate }) => {
  const [amountJpy, setAmountJpy] = useState<string>('');
  const [amountTwd, setAmountTwd] = useState<string>('');
  const [showCalculator, setShowCalculator] = useState(true);

  // Helper to safely evaluate expression
  const safeEvaluate = (expression: string): number | null => {
      try {
          // Only allow numbers and operators
          const sanitized = expression.replace(/[^0-9+\-*/.]/g, '');
          if (!sanitized) return null;
          // eslint-disable-next-line
          const res = new Function('return ' + sanitized)();
          return res;
      } catch (e) {
          return null;
      }
  };

  const handleJpyChange = (val: string) => {
    setAmountJpy(val);
    
    // If it looks like a complete number, convert it. If it ends in operator, don't.
    const lastChar = val.slice(-1);
    if (['+', '-', '*', '/'].includes(lastChar)) return;

    const res = safeEvaluate(val);
    if(res !== null) {
        setAmountTwd((res * rate).toFixed(0));
    } else {
        setAmountTwd('');
    }
  };

  const handleTwdChange = (val: string) => {
    setAmountTwd(val);
    if(val && !isNaN(parseFloat(val))) {
        setAmountJpy((parseFloat(val) / rate).toFixed(0));
    } else {
        setAmountJpy('');
    }
  };

  const handleCalcPress = (key: string) => {
     if (key === 'C') {
         setAmountJpy('');
         setAmountTwd('');
     } else if (key === '=') {
         const res = safeEvaluate(amountJpy);
         if (res !== null) {
             const resStr = String(Math.floor(res * 100) / 100); // 2 decimal places max
             setAmountJpy(resStr);
             setAmountTwd((res * rate).toFixed(0));
         } else {
             // If error, don't change text, just maybe show error toast (omitted for simplicity)
         }
     } else {
         const newVal = amountJpy + key;
         setAmountJpy(newVal);
         
         // Auto calc TWD preview if valid so far
         const lastChar = newVal.slice(-1);
         if (!['+', '-', '*', '/'].includes(lastChar)) {
             const res = safeEvaluate(newVal);
             if (res !== null) {
                 setAmountTwd((res * rate).toFixed(0));
             }
         }
     }
  };

  return (
    <div className="px-5 pt-6 pb-24 space-y-6 animate-fade-in">
        <div className="bg-white rounded-[32px] p-6 shadow-soft border border-stone-50">
            <h2 className="text-xl font-bold text-soft-cocoa mb-6 flex items-center gap-2">
                <div className="p-2 bg-butter-yellow rounded-xl">
                   <Coins size={18} className="text-soft-cocoa" />
                </div>
                <span>匯率換算 & 計算機</span>
            </h2>

            {/* Rate Input */}
            <div className="flex justify-center mb-8">
                <div className="text-xs font-bold text-soft-gray bg-cream-section px-5 py-2.5 rounded-2xl flex items-center gap-2">
                    <span>1 JPY =</span>
                    <input 
                        type="number" 
                        value={rate} 
                        onChange={(e) => setRate(parseFloat(e.target.value))} 
                        className="w-16 bg-transparent text-center border-b border-soft-gray/30 focus:outline-none font-bold text-soft-cocoa"
                        step="0.001"
                    />
                    <span>TWD</span>
                </div>
            </div>

            {/* Display Inputs */}
            <div className="flex flex-col gap-3 relative">
                <div className="bg-cream-section rounded-2xl p-5 transition-all focus-within:ring-2 ring-butter-yellow/50">
                    <label className="text-xs font-bold text-soft-gray block mb-1">日幣 (JPY)</label>
                    <input 
                        type="text" 
                        value={amountJpy}
                        onChange={(e) => handleJpyChange(e.target.value)}
                        placeholder="0"
                        className="w-full text-3xl font-bold bg-transparent outline-none text-soft-cocoa placeholder-stone-300"
                    />
                </div>
                
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md border border-stone-50 z-10 text-butter-yellow">
                    <Repeat size={18} fill="currentColor" />
                </div>

                <div className="bg-cream-section rounded-2xl p-5 transition-all focus-within:ring-2 ring-butter-yellow/50">
                    <label className="text-xs font-bold text-soft-gray block mb-1">台幣 (TWD)</label>
                    <input 
                        type="number" 
                        value={amountTwd}
                        onChange={(e) => handleTwdChange(e.target.value)}
                        placeholder="0"
                        className="w-full text-3xl font-bold bg-transparent outline-none text-soft-cocoa placeholder-stone-300"
                    />
                </div>
            </div>

            {/* Keypad */}
            {showCalculator && (
                <div className="grid grid-cols-4 gap-3 mt-8">
                    {['7','8','9','/'].map(k => (
                        <button key={k} onClick={() => handleCalcPress(k)} className="h-14 bg-cream-section rounded-2xl font-bold text-lg text-soft-cocoa hover:bg-stone-100 active:scale-95 transition-all">{k === '/' ? '÷' : k}</button>
                    ))}
                    {['4','5','6','*'].map(k => (
                        <button key={k} onClick={() => handleCalcPress(k)} className="h-14 bg-cream-section rounded-2xl font-bold text-lg text-soft-cocoa hover:bg-stone-100 active:scale-95 transition-all">{k === '*' ? '×' : k}</button>
                    ))}
                    {['1','2','3','-'].map(k => (
                        <button key={k} onClick={() => handleCalcPress(k)} className="h-14 bg-cream-section rounded-2xl font-bold text-lg text-soft-cocoa hover:bg-stone-100 active:scale-95 transition-all">{k}</button>
                    ))}
                    <button onClick={() => handleCalcPress('C')} className="h-14 bg-pastel-pink text-pink-500 rounded-2xl font-bold text-lg hover:opacity-80 active:scale-95 transition-all">C</button>
                    <button onClick={() => handleCalcPress('0')} className="h-14 bg-cream-section rounded-2xl font-bold text-lg text-soft-cocoa hover:bg-stone-100 active:scale-95 transition-all">0</button>
                    <button onClick={() => handleCalcPress('+')} className="h-14 bg-cream-section rounded-2xl font-bold text-lg text-soft-cocoa hover:bg-stone-100 active:scale-95 transition-all">+</button>
                    <button onClick={() => handleCalcPress('=')} className="h-14 bg-soft-cocoa text-white rounded-2xl font-bold text-lg shadow-lg shadow-soft-cocoa/20 active:opacity-90 active:scale-95 transition-all">=</button>
                </div>
            )}
        </div>
    </div>
  );
};

export default CurrencyView;
