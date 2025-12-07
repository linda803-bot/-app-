
import React, { useState } from 'react';
import { ExpenseItem, User } from '../types';
import { USERS } from '../constants';
import { Wallet, Plus, Trash2, User as UserIcon, Users, Lock, EyeOff, Globe } from 'lucide-react';

interface ExpenseViewProps {
  expenses: ExpenseItem[];
  setExpenses: React.Dispatch<React.SetStateAction<ExpenseItem[]>>;
  rate: number;
  currentUser: User;
}

const ExpenseView: React.FC<ExpenseViewProps> = ({ expenses, setExpenses, rate, currentUser }) => {
  const [newExpTitle, setNewExpTitle] = useState('');
  const [newExpAmount, setNewExpAmount] = useState('');
  const [newExpPayerId, setNewExpPayerId] = useState(currentUser.id);
  const [newExpType, setNewExpType] = useState<'SHARED' | 'PERSONAL'>('SHARED');

  const addExpense = () => {
    if (!newExpTitle || !newExpAmount) return;
    const newItem: ExpenseItem = {
      id: crypto.randomUUID(),
      title: newExpTitle,
      amount: parseFloat(newExpAmount),
      currency: 'JPY',
      category: '其他',
      payerId: newExpPayerId,
      ownerId: newExpType === 'PERSONAL' ? currentUser.id : undefined,
      type: newExpType,
      date: new Date().toISOString().split('T')[0]
    };
    setExpenses([newItem, ...expenses]);
    setNewExpTitle('');
    setNewExpAmount('');
  };

  const getUser = (id: string) => USERS.find(u => u.id === id);

  // Filter expenses: Shared always visible, Personal only if owner is me
  const visibleExpenses = expenses.filter(e => 
    e.type === 'SHARED' || (e.type === 'PERSONAL' && e.ownerId === currentUser.id)
  );

  const totalSharedJPY = expenses.filter(e => e.type === 'SHARED').reduce((acc, curr) => acc + curr.amount, 0);
  const myPersonalJPY = expenses.filter(e => e.type === 'PERSONAL' && e.ownerId === currentUser.id).reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="px-4 pt-6 pb-24 space-y-6 animate-fade-in">
        
        {/* Total Summary Cards */}
        <div className="grid grid-cols-2 gap-4">
             {/* Shared Total */}
            <div className="bg-soft-cocoa text-white p-5 rounded-[28px] shadow-soft relative overflow-hidden">
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-2 opacity-80 mb-2">
                        <Users size={16} />
                        <span className="text-xs font-bold">公款總支出</span>
                    </div>
                    <div className="text-2xl font-bold">¥{totalSharedJPY.toLocaleString()}</div>
                    <div className="text-white/60 text-[10px] mt-1">
                        ≈ NT$ {Math.round(totalSharedJPY * rate).toLocaleString()}
                    </div>
                </div>
            </div>

            {/* Personal Total */}
            <div className="bg-white text-soft-cocoa p-5 rounded-[28px] shadow-soft border border-stone-50 relative overflow-hidden">
                <div className="relative z-10">
                    <div className="flex items-center gap-2 text-soft-gray mb-2">
                        <Lock size={14} />
                        <span className="text-xs font-bold">個人私帳</span>
                    </div>
                    <div className="text-2xl font-bold">¥{myPersonalJPY.toLocaleString()}</div>
                    <div className="text-soft-gray text-[10px] mt-1">
                        僅自己可見
                    </div>
                </div>
            </div>
        </div>

        {/* Add Form */}
        <div className="bg-white rounded-[28px] p-5 shadow-soft border border-stone-50">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-soft-cocoa">記一筆</h3>
                <div className="flex bg-cream-section p-1 rounded-full">
                    <button 
                       onClick={() => setNewExpType('SHARED')}
                       className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${newExpType === 'SHARED' ? 'bg-white shadow-sm text-soft-cocoa' : 'text-soft-gray'}`}
                    >
                        公帳
                    </button>
                    <button 
                       onClick={() => setNewExpType('PERSONAL')}
                       className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${newExpType === 'PERSONAL' ? 'bg-white shadow-sm text-soft-cocoa' : 'text-soft-gray'}`}
                    >
                        私帳
                    </button>
                </div>
            </div>

            <div className="space-y-3">
                <input 
                    type="text" 
                    placeholder="項目名稱 (如: 晚餐)" 
                    value={newExpTitle}
                    onChange={(e) => setNewExpTitle(e.target.value)}
                    className="w-full bg-cream-section rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 ring-butter-yellow/50 transition-all placeholder-stone-300"
                />
                <div className="flex gap-3">
                     <input 
                        type="number" 
                        placeholder="¥金額" 
                        value={newExpAmount}
                        onChange={(e) => setNewExpAmount(e.target.value)}
                        className="w-full bg-cream-section rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 ring-butter-yellow/50 transition-all placeholder-stone-300"
                    />
                    <div className="relative w-1/3">
                        <select 
                            value={newExpPayerId}
                            onChange={(e) => setNewExpPayerId(e.target.value)}
                            className="w-full h-full bg-cream-section rounded-xl pl-3 pr-8 text-xs font-bold focus:outline-none appearance-none text-soft-cocoa"
                        >
                            {USERS.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                        </select>
                        <UserIcon size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-soft-gray pointer-events-none" />
                    </div>
                </div>
                <button onClick={addExpense} className="w-full py-3 bg-soft-cocoa text-white rounded-xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform">
                    <Plus size={16} /> <span>新增 {newExpType === 'SHARED' ? '公款' : '個人'} 紀錄</span>
                </button>
            </div>
        </div>

        {/* History List */}
        <div className="space-y-3">
            <h3 className="font-bold text-soft-cocoa px-2 text-sm">近期紀錄</h3>
            {visibleExpenses.length === 0 ? (
                <div className="text-center py-10 text-stone-300 text-sm bg-white rounded-3xl border border-stone-50">
                    尚無紀錄
                </div>
            ) : (
                visibleExpenses.map((item) => {
                    const payer = getUser(item.payerId);
                    return (
                        <div key={item.id} className="bg-white rounded-2xl p-4 shadow-sm border border-stone-50 flex justify-between items-center">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-bold text-soft-cocoa">{item.title}</span>
                                    {item.type === 'PERSONAL' && <Lock size={10} className="text-soft-gray" />}
                                </div>
                                <div className="flex items-center gap-2">
                                     <div className={`text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 ${payer?.color} bg-opacity-30 text-soft-cocoa`}>
                                        <span>{payer?.avatar}</span>
                                        <span>{payer?.name} 先付</span>
                                     </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className={`font-bold text-lg ${item.type === 'SHARED' ? 'text-soft-cocoa' : 'text-soft-gray'}`}>
                                    ¥{item.amount.toLocaleString()}
                                </span>
                                <button 
                                    onClick={() => setExpenses(expenses.filter(e => e.id !== item.id))}
                                    className="w-8 h-8 flex items-center justify-center bg-stone-50 text-stone-300 rounded-full hover:bg-red-50 hover:text-red-400 transition-colors"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    </div>
  );
};

export default ExpenseView;