
import React, { useState } from 'react';
import { ExpenseItem, FlightInfo } from '../types';
import { Plane, Home, Phone, Plus, Trash2, Repeat, Coins, Delete, User, Calculator } from 'lucide-react';

interface HotelInfo {
  name: string;
  address: string;
  checkIn: string;
  checkOut: string;
}

interface ToolsViewProps {
  expenses: ExpenseItem[];
  setExpenses: React.Dispatch<React.SetStateAction<ExpenseItem[]>>;
  rate: number;
  setRate: React.Dispatch<React.SetStateAction<number>>;
}

const ToolsView: React.FC<ToolsViewProps> = ({ expenses, setExpenses, rate, setRate }) => {
  // Currency Calculator State
  const [amountJpy, setAmountJpy] = useState<string>('');
  const [amountTwd, setAmountTwd] = useState<string>('');
  const [showCalculator, setShowCalculator] = useState(false);
  
  // Expense Form State
  const [newExpTitle, setNewExpTitle] = useState('');
  const [newExpAmount, setNewExpAmount] = useState('');
  const [newExpPayer, setNewExpPayer] = useState('');
  
  // Info Form State
  const [flight] = useState<FlightInfo>({ flightNumber: 'BR198', departureTime: '08:50', arrivalTime: '13:15', terminal: 'T2' });
  const [hotel] = useState<HotelInfo>({ name: 'Hotel Gracery Shinjuku', address: '1-19-1 Kabukicho, Shinjuku', checkIn: '15:00', checkOut: '11:00' });

  // Currency Logic
  const handleJpyChange = (val: string) => {
    setAmountJpy(val);
    if(val) setAmountTwd((parseFloat(val) * rate).toFixed(0));
    else setAmountTwd('');
  };

  const handleTwdChange = (val: string) => {
    setAmountTwd(val);
    if(val) setAmountJpy((parseFloat(val) / rate).toFixed(0));
    else setAmountJpy('');
  };

  // Calculator Logic
  const handleCalcPress = (key: string) => {
     if (key === 'C') {
         setAmountJpy('');
         setAmountTwd('');
     } else if (key === '=') {
         try {
             // Safe eval using Function
             // eslint-disable-next-line
             const res = new Function('return ' + amountJpy)();
             const resStr = String(Math.floor(res));
             setAmountJpy(resStr);
             setAmountTwd((res * rate).toFixed(0));
         } catch(e) {
             setAmountJpy('Error');
         }
     } else {
         const newVal = amountJpy + key;
         setAmountJpy(newVal);
     }
  };

  const addExpense = () => {
    if (!newExpTitle || !newExpAmount) return;
    const newItem: ExpenseItem = {
      id: crypto.randomUUID(),
      title: newExpTitle,
      amount: parseFloat(newExpAmount),
      currency: 'JPY',
      category: '其他',
      payerId: newExpPayer || '我',
      type: 'SHARED',
      date: new Date().toISOString().split('T')[0]
    };
    setExpenses([newItem, ...expenses]);
    setNewExpTitle('');
    setNewExpAmount('');
    setNewExpPayer('');
  };

  const totalSpentJPY = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const totalSpentTWD = Math.round(totalSpentJPY * rate);

  return (
    <div className="px-4 pt-6 pb-24 space-y-6 animate-fade-in">
      
      {/* 1. Currency Converter & Calculator */}
      <section className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg text-japan-indigo flex items-center gap-2">
            <Coins size={18}/> 匯率換算
          </h3>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowCalculator(!showCalculator)}
              className={`p-1.5 rounded-lg transition-colors ${showCalculator ? 'bg-japan-matcha text-white' : 'bg-stone-100 text-stone-400'}`}
            >
                <Calculator size={16} />
            </button>
            <div className="text-xs text-stone-400 bg-stone-100 px-2 py-1 rounded">
                1 JPY = <input 
                type="number" 
                value={rate} 
                onChange={(e) => setRate(parseFloat(e.target.value))} 
                className="w-12 bg-transparent text-center border-b border-stone-300 focus:outline-none"
                step="0.001"
                /> TWD
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3 mb-2">
           <div className="flex-1">
             <label className="text-xs text-stone-500 mb-1 block">日幣 (JPY)</label>
             <input 
               type="text" 
               value={amountJpy}
               onChange={(e) => handleJpyChange(e.target.value)}
               placeholder="0"
               readOnly={showCalculator}
               className="w-full text-2xl font-bold p-2 bg-stone-50 rounded-lg focus:ring-2 ring-japan-indigo/20 outline-none"
             />
           </div>
           <div className="pt-5 text-stone-400">
             <Repeat size={20} />
           </div>
           <div className="flex-1">
             <label className="text-xs text-stone-500 mb-1 block">台幣 (TWD)</label>
             <input 
               type="number" 
               value={amountTwd}
               onChange={(e) => handleTwdChange(e.target.value)}
               placeholder="0"
               readOnly={showCalculator}
               className="w-full text-2xl font-bold p-2 bg-stone-50 rounded-lg focus:ring-2 ring-japan-indigo/20 outline-none"
             />
           </div>
        </div>

        {/* Calculator Mode */}
        {showCalculator && (
            <div className="grid grid-cols-4 gap-2 mt-4 pt-4 border-t border-stone-100">
                {['7','8','9','/'].map(k => (
                    <button key={k} onClick={() => handleCalcPress(k)} className="p-3 bg-stone-50 rounded-lg font-bold text-lg text-stone-600 active:bg-stone-200">{k}</button>
                ))}
                {['4','5','6','*'].map(k => (
                    <button key={k} onClick={() => handleCalcPress(k)} className="p-3 bg-stone-50 rounded-lg font-bold text-lg text-stone-600 active:bg-stone-200">{k}</button>
                ))}
                {['1','2','3','-'].map(k => (
                    <button key={k} onClick={() => handleCalcPress(k)} className="p-3 bg-stone-50 rounded-lg font-bold text-lg text-stone-600 active:bg-stone-200">{k}</button>
                ))}
                <button onClick={() => handleCalcPress('C')} className="p-3 bg-red-50 text-red-500 rounded-lg font-bold text-lg active:bg-red-100">C</button>
                <button onClick={() => handleCalcPress('0')} className="p-3 bg-stone-50 rounded-lg font-bold text-lg text-stone-600 active:bg-stone-200">0</button>
                <button onClick={() => handleCalcPress('=')} className="p-3 bg-japan-indigo text-white rounded-lg font-bold text-lg active:opacity-90">=</button>
                <button onClick={() => handleCalcPress('+')} className="p-3 bg-stone-50 rounded-lg font-bold text-lg text-stone-600 active:bg-stone-200">+</button>
            </div>
        )}
      </section>

      {/* 2. Info Cards */}
      <div className="flex overflow-x-auto gap-4 no-scrollbar pb-2">
         {/* Flight Card */}
         <div className="min-w-[260px] bg-japan-indigo text-white p-4 rounded-2xl shadow-md">
            <div className="flex items-center gap-2 mb-3 opacity-80">
              <Plane size={16} />
              <span className="text-xs font-bold tracking-wider">FLIGHT</span>
            </div>
            <div className="text-2xl font-bold mb-1">{flight.flightNumber}</div>
            <div className="flex justify-between text-sm opacity-90">
               <div>
                 <div className="opacity-60 text-xs">DEP</div>
                 {flight.departureTime}
               </div>
               <div className="text-right">
                 <div className="opacity-60 text-xs">ARR</div>
                 {flight.arrivalTime}
               </div>
            </div>
         </div>

         {/* Emergency Card */}
         <div className="min-w-[260px] bg-japan-red text-white p-4 rounded-2xl shadow-md">
            <div className="flex items-center gap-2 mb-3 opacity-80">
              <Phone size={16} />
              <span className="text-xs font-bold tracking-wider">EMERGENCY</span>
            </div>
            <div className="space-y-2">
               <div className="flex justify-between items-center text-sm">
                 <span>警察 (Police)</span>
                 <span className="font-bold text-lg">110</span>
               </div>
               <div className="flex justify-between items-center text-sm">
                 <span>救護 (Ambulance)</span>
                 <span className="font-bold text-lg">119</span>
               </div>
            </div>
         </div>
      </div>

      {/* 3. Budget / Expense Tracker */}
      <section className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
        <div className="p-4 bg-stone-50 border-b border-stone-100 flex justify-between items-center">
           <h3 className="font-bold text-stone-700">記帳本</h3>
           <div className="text-right">
              <div className="text-xs text-stone-400">總支出</div>
              <div className="font-bold text-japan-black">¥{totalSpentJPY.toLocaleString()} <span className="text-xs font-normal text-stone-400">≈ NT${totalSpentTWD.toLocaleString()}</span></div>
           </div>
        </div>

        {/* Add New Expense */}
        <div className="p-3 grid grid-cols-12 gap-2 border-b border-stone-100">
           <div className="col-span-5">
             <input 
               type="text" 
               placeholder="項目" 
               value={newExpTitle}
               onChange={(e) => setNewExpTitle(e.target.value)}
               className="w-full bg-stone-100 rounded px-2 py-2 text-sm focus:outline-none"
             />
           </div>
           <div className="col-span-3">
             <input 
               type="number" 
               placeholder="¥金額" 
               value={newExpAmount}
               onChange={(e) => setNewExpAmount(e.target.value)}
               className="w-full bg-stone-100 rounded px-2 py-2 text-sm focus:outline-none"
             />
           </div>
           <div className="col-span-3">
             <input 
               type="text" 
               placeholder="付款人" 
               value={newExpPayer}
               onChange={(e) => setNewExpPayer(e.target.value)}
               className="w-full bg-stone-100 rounded px-2 py-2 text-sm focus:outline-none"
             />
           </div>
           <button onClick={addExpense} className="col-span-1 bg-japan-black text-white rounded flex items-center justify-center">
             <Plus size={16} />
           </button>
        </div>

        {/* List */}
        <div className="max-h-[300px] overflow-y-auto">
           {expenses.length === 0 ? (
             <div className="p-8 text-center text-stone-300 text-sm">尚未新增紀錄</div>
           ) : (
             expenses.map((item) => (
               <div key={item.id} className="flex justify-between items-center p-3 border-b border-stone-50 last:border-0 hover:bg-stone-50">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-stone-700">{item.title}</div>
                    <div className="text-xs text-stone-400 flex items-center gap-1">
                        <User size={10} />
                        {item.payerId || '我'} 先付
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-stone-800">¥{item.amount.toLocaleString()}</span>
                    <button 
                      onClick={() => setExpenses(expenses.filter(e => e.id !== item.id))}
                      className="text-stone-300 hover:text-japan-red"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
               </div>
             ))
           )}
        </div>
      </section>

    </div>
  );
};

export default ToolsView;
