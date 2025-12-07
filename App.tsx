
import React, { useState } from 'react';
import ItineraryView from './components/ItineraryView';
import CurrencyView from './components/CurrencyView';
import ExpenseView from './components/ExpenseView';
import InfoView from './components/InfoView';
import { DayItinerary, Tab, ExpenseItem, User, UserPackingList } from './types';
import { INITIAL_ITINERARY, INITIAL_EXPENSES, EXCHANGE_RATE_DEFAULT, USERS, INITIAL_PACKING_LIST_TEMPLATE } from './constants';
import { analyzeItinerary } from './services/geminiService';
import { Map, Wallet, Sparkles, X, Loader2, CircleDollarSign, Info, User as UserIcon } from 'lucide-react';

export default function App() {
  // Login State
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // App Data State (Shared "Backend")
  const [activeTab, setActiveTab] = useState<Tab>('ITINERARY');
  const [itinerary, setItinerary] = useState<DayItinerary[]>(INITIAL_ITINERARY);
  const [expenses, setExpenses] = useState<ExpenseItem[]>(INITIAL_EXPENSES);
  const [exchangeRate, setExchangeRate] = useState<number>(EXCHANGE_RATE_DEFAULT);
  
  // Packing List State (Simulating DB where key is userId)
  const [packingLists, setPackingLists] = useState<UserPackingList>({
    'u1': JSON.parse(JSON.stringify(INITIAL_PACKING_LIST_TEMPLATE)),
    'u2': JSON.parse(JSON.stringify(INITIAL_PACKING_LIST_TEMPLATE)),
    'u3': JSON.parse(JSON.stringify(INITIAL_PACKING_LIST_TEMPLATE)),
    'u4': JSON.parse(JSON.stringify(INITIAL_PACKING_LIST_TEMPLATE)),
  });

  // AI Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [aiInput, setAiInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!aiInput.trim()) return;
    setIsAnalyzing(true);
    setAnalysisError(null);
    
    try {
      const newItinerary = await analyzeItinerary(aiInput);
      if (newItinerary && newItinerary.length > 0) {
        setItinerary(newItinerary);
        setIsModalOpen(false);
        setAiInput('');
      } else {
        setAnalysisError("無法產生行程，請試著提供更多細節。");
      }
    } catch (err) {
      setAnalysisError("AI 分析時發生錯誤，請稍後再試。");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // --- Login Screen ---
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-cream-bg flex flex-col items-center justify-center p-6 font-sans">
         <div className="w-20 h-20 bg-butter-yellow rounded-full flex items-center justify-center text-4xl shadow-soft mb-6 animate-fade-in">
            ✈️
         </div>
         <h1 className="text-3xl font-bold text-soft-cocoa mb-2 tracking-wide">ZenTravel</h1>
         <p className="text-soft-gray mb-10 text-sm">請選擇您的成員身份</p>
         
         <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
            {USERS.map(user => (
              <button 
                key={user.id}
                onClick={() => setCurrentUser(user)}
                className="bg-white p-6 rounded-3xl shadow-soft flex flex-col items-center gap-3 hover:scale-105 transition-transform border border-transparent hover:border-butter-yellow"
              >
                 <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl ${user.color}`}>
                    {user.avatar}
                 </div>
                 <span className="font-bold text-soft-cocoa">{user.name}</span>
              </button>
            ))}
         </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-bg font-sans text-soft-cocoa pb-safe">
      
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md pt-safe-top sticky top-0 z-50 border-b border-stone-100 shadow-sm">
        <div className="flex justify-between items-center px-5 h-16">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-soft-cocoa">ZenTravel</h1>
          </div>
          <div className="flex items-center gap-3">
             <div className="text-xs font-medium px-3 py-1.5 bg-cream-section rounded-full text-soft-gray">
               {activeTab === 'ITINERARY' && '行程表'}
               {activeTab === 'CURRENCY' && '匯率計算'}
               {activeTab === 'EXPENSE' && '旅行記帳'}
               {activeTab === 'INFO' && '行前手冊'}
            </div>
            <button onClick={() => setCurrentUser(null)} className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${currentUser.color}`}>
              {currentUser.avatar}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto w-full min-h-[calc(100vh-140px)] bg-transparent relative">
        {activeTab === 'ITINERARY' && (
          <ItineraryView 
            itinerary={itinerary} 
            onOpenAnalysis={() => setIsModalOpen(true)}
          />
        )}
        {activeTab === 'CURRENCY' && (
           <CurrencyView rate={exchangeRate} setRate={setExchangeRate} />
        )}
        {activeTab === 'EXPENSE' && (
           <ExpenseView 
             expenses={expenses} 
             setExpenses={setExpenses} 
             rate={exchangeRate} 
             currentUser={currentUser}
           />
        )}
        {activeTab === 'INFO' && (
           <InfoView 
             currentUser={currentUser}
             packingLists={packingLists}
             setPackingLists={setPackingLists}
           />
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 w-full bg-white/95 backdrop-blur-md border-t border-stone-100 pb-safe-bottom z-30 shadow-[0_-5px_20px_rgba(0,0,0,0.03)] rounded-t-3xl">
        <div className="max-w-md mx-auto flex justify-between items-center h-20 px-4">
           <NavButton 
              active={activeTab === 'ITINERARY'} 
              onClick={() => setActiveTab('ITINERARY')} 
              icon={<Map size={22} />} 
              label="行程" 
           />
           <NavButton 
              active={activeTab === 'CURRENCY'} 
              onClick={() => setActiveTab('CURRENCY')} 
              icon={<CircleDollarSign size={22} />} 
              label="匯率" 
           />
           <NavButton 
              active={activeTab === 'EXPENSE'} 
              onClick={() => setActiveTab('EXPENSE')} 
              icon={<Wallet size={22} />} 
              label="記帳" 
           />
           <NavButton 
              active={activeTab === 'INFO'} 
              onClick={() => setActiveTab('INFO')} 
              icon={<Info size={22} />} 
              label="手冊" 
           />
        </div>
      </nav>

      {/* AI Analysis Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center bg-black/20 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-soft overflow-hidden flex flex-col max-h-[80vh]">
            <div className="p-5 border-b border-stone-100 flex justify-between items-center bg-cream-section">
              <h3 className="font-bold flex items-center gap-2 text-soft-cocoa">
                <Sparkles size={18} className="text-butter-yellow fill-butter-yellow"/> 
                AI 魔法助理
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-stone-100 rounded-full transition-colors">
                <X size={20} className="text-soft-gray" />
              </button>
            </div>
            
            <div className="p-6 flex-1 overflow-y-auto bg-white">
              <p className="text-sm text-soft-gray mb-4 leading-relaxed">
                貼上您的粗略行程，AI 將為您整理成可愛的卡片，並加上導航與美食推薦。
              </p>
              <textarea
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                placeholder="在此輸入您的計畫..."
                className="w-full h-40 p-4 bg-cream-section border-none rounded-2xl focus:ring-2 ring-butter-yellow/50 outline-none resize-none text-sm text-soft-cocoa"
              />
              {analysisError && (
                <div className="mt-4 text-xs text-red-400 bg-red-50 p-3 rounded-xl">
                  {analysisError}
                </div>
              )}
            </div>

            <div className="p-5 border-t border-stone-50 bg-white">
              <button 
                onClick={handleAnalyze}
                disabled={isAnalyzing || !aiInput.trim()}
                className="w-full py-4 bg-soft-cocoa text-white rounded-2xl font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-transform shadow-lg shadow-soft-cocoa/20"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    正在施法中...
                  </>
                ) : (
                  "生成行程"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

const NavButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1.5 w-full h-full justify-center transition-all ${
      active ? 'text-soft-cocoa' : 'text-stone-300 hover:text-stone-400'
    }`}
  >
    <div className={`transition-all duration-300 p-1 rounded-xl ${active ? 'bg-butter-yellow -translate-y-1' : 'translate-y-0'}`}>
        {React.cloneElement(icon as React.ReactElement<any>, { 
            strokeWidth: active ? 2.5 : 2,
            size: active ? 20 : 22,
            className: active ? "text-soft-cocoa" : ""
        })}
    </div>
    <span className={`text-[10px] font-medium transition-all ${active ? 'opacity-100 font-bold -translate-y-1' : 'opacity-80'}`}>{label}</span>
  </button>
);