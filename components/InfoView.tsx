
import React, { useState } from 'react';
import { Plane, Phone, Info, CheckSquare, Check, Plus, Trash2, X } from 'lucide-react';
import { User, PackingCategory, UserPackingList, FlightInfo } from '../types';
import { PRE_TRIP_NOTES } from '../constants';

interface InfoViewProps {
  currentUser: User;
  packingLists: UserPackingList;
  setPackingLists: React.Dispatch<React.SetStateAction<UserPackingList>>;
}

const InfoView: React.FC<InfoViewProps> = ({ currentUser, packingLists, setPackingLists }) => {
  const [activeTab, setActiveTab] = useState<'GUIDE' | 'PACKING'>('GUIDE');
  
  // New Item State
  const [newItemText, setNewItemText] = useState<string>('');
  const [addingToCategoryIdx, setAddingToCategoryIdx] = useState<number | null>(null);
  
  // New Category State
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryText, setNewCategoryText] = useState('');

  // Flight Info (Updated to 2026)
  const flight: FlightInfo = { flightNumber: 'BR198', departureTime: '08:50', arrivalTime: '13:15', terminal: 'T2' };
  const returnFlight: FlightInfo = { flightNumber: 'BR197', departureTime: '20:40', arrivalTime: '17:10', terminal: 'T1' };

  // Packing Logic
  const myPackingList = packingLists[currentUser.id] || [];

  const updateList = (newList: PackingCategory[]) => {
      setPackingLists({
          ...packingLists,
          [currentUser.id]: newList
      });
  };

  const toggleItem = (categoryIndex: number, itemIndex: number) => {
     const newList = [...myPackingList];
     newList[categoryIndex].items[itemIndex].checked = !newList[categoryIndex].items[itemIndex].checked;
     updateList(newList);
  };

  const deleteItem = (categoryIndex: number, itemIndex: number) => {
      const newList = [...myPackingList];
      newList[categoryIndex].items.splice(itemIndex, 1);
      updateList(newList);
  };

  const addItemToCategory = (categoryIndex: number) => {
      if (!newItemText.trim()) return;
      const newList = [...myPackingList];
      newList[categoryIndex].items.push({
          id: crypto.randomUUID(),
          label: newItemText,
          checked: false
      });
      updateList(newList);
      setNewItemText('');
      setAddingToCategoryIdx(null);
  };

  const addNewCategory = () => {
      if(!newCategoryText.trim()) return;
      const newList = [...myPackingList];
      newList.push({
          title: newCategoryText,
          items: []
      });
      updateList(newList);
      setNewCategoryText('');
      setIsAddingCategory(false);
  };

  const deleteCategory = (categoryIndex: number) => {
      const newList = [...myPackingList];
      newList.splice(categoryIndex, 1);
      updateList(newList);
  };

  return (
    <div className="pb-24 animate-fade-in flex flex-col h-full min-h-screen">
        {/* Top Toggle */}
        <div className="px-5 pt-4 pb-2">
            <div className="bg-cream-section p-1 rounded-full flex font-bold text-sm shadow-inner-soft">
                <button 
                   onClick={() => setActiveTab('GUIDE')}
                   className={`flex-1 py-2.5 rounded-full flex items-center justify-center gap-2 transition-all ${activeTab === 'GUIDE' ? 'bg-white shadow-sm text-soft-cocoa' : 'text-soft-gray'}`}
                >
                    <Info size={16} /> 資訊與須知
                </button>
                <button 
                   onClick={() => setActiveTab('PACKING')}
                   className={`flex-1 py-2.5 rounded-full flex items-center justify-center gap-2 transition-all ${activeTab === 'PACKING' ? 'bg-white shadow-sm text-soft-cocoa' : 'text-soft-gray'}`}
                >
                    <CheckSquare size={16} /> 行李清單
                </button>
            </div>
        </div>

        {activeTab === 'GUIDE' && (
            <div className="px-5 pt-4 space-y-6">
                
                {/* 1. Pre-trip Notes (New Feature) */}
                <section>
                    <h3 className="text-sm font-bold text-soft-gray mb-3 ml-1">行前注意事項</h3>
                    <div className="grid gap-3">
                        {PRE_TRIP_NOTES.map(note => (
                            <div key={note.id} className="bg-white p-4 rounded-2xl shadow-soft border border-stone-50">
                                <div className="font-bold text-soft-cocoa mb-1 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-butter-yellow"></div>
                                    {note.title}
                                </div>
                                <div className="text-sm text-soft-gray pl-3.5 leading-relaxed">
                                    {note.content}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 2. Flights */}
                <section>
                    <h3 className="text-sm font-bold text-soft-gray mb-3 ml-1">航班資訊 (2026/10)</h3>
                    <div className="space-y-3">
                        {/* Outbound */}
                        <div className="bg-white rounded-3xl p-5 shadow-soft border border-stone-50">
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center gap-2 text-soft-cocoa font-bold">
                                    <div className="p-1.5 bg-pastel-blue rounded-full text-blue-500">
                                        <Plane size={14} />
                                    </div>
                                    <span>去程 BR198</span>
                                </div>
                                <div className="text-[10px] text-soft-gray font-bold bg-cream-section px-2 py-1 rounded-lg">10/20</div>
                            </div>
                            <div className="flex justify-between items-center text-center">
                                <div>
                                    <div className="text-xl font-bold text-soft-cocoa">TPE</div>
                                    <div className="text-xs text-soft-gray">08:50</div>
                                </div>
                                <div className="flex-1 px-4 flex flex-col items-center">
                                    <div className="w-full h-[1px] bg-stone-200 relative"></div>
                                    <div className="text-[10px] text-soft-gray mt-1">3h 25m</div>
                                </div>
                                <div>
                                    <div className="text-xl font-bold text-soft-cocoa">NRT</div>
                                    <div className="text-xs text-soft-gray">13:15</div>
                                </div>
                            </div>
                        </div>

                        {/* Inbound */}
                        <div className="bg-white rounded-3xl p-5 shadow-soft border border-stone-50">
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center gap-2 text-soft-cocoa font-bold">
                                    <div className="p-1.5 bg-pastel-pink rounded-full text-pink-500">
                                        <Plane size={14} className="rotate-180" />
                                    </div>
                                    <span>回程 BR197</span>
                                </div>
                                <div className="text-[10px] text-soft-gray font-bold bg-cream-section px-2 py-1 rounded-lg">10/24</div>
                            </div>
                            <div className="flex justify-between items-center text-center">
                                <div>
                                    <div className="text-xl font-bold text-soft-cocoa">NRT</div>
                                    <div className="text-xs text-soft-gray">20:40</div>
                                </div>
                                <div className="flex-1 px-4 flex flex-col items-center">
                                    <div className="w-full h-[1px] bg-stone-200 relative"></div>
                                    <div className="text-[10px] text-soft-gray mt-1">3h 55m</div>
                                </div>
                                <div>
                                    <div className="text-xl font-bold text-soft-cocoa">TPE</div>
                                    <div className="text-xs text-soft-gray">17:10</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 3. Emergency */}
                <section>
                    <h3 className="text-sm font-bold text-soft-gray mb-3 ml-1">緊急聯絡</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white p-4 rounded-2xl border border-stone-50 shadow-sm flex flex-col items-center justify-center gap-2">
                            <span className="text-2xl font-bold text-pastel-pink text-pink-500">110</span>
                            <span className="text-xs text-soft-gray font-bold">警察 Police</span>
                        </div>
                        <div className="bg-white p-4 rounded-2xl border border-stone-50 shadow-sm flex flex-col items-center justify-center gap-2">
                            <span className="text-2xl font-bold text-pastel-pink text-pink-500">119</span>
                            <span className="text-xs text-soft-gray font-bold">救護 Ambulance</span>
                        </div>
                    </div>
                </section>
            </div>
        )}

        {activeTab === 'PACKING' && (
            <div className="px-5 pt-4 space-y-6">
                <div className="bg-butter-yellow/20 p-4 rounded-2xl flex items-start gap-3">
                   <div className="text-2xl">🎒</div>
                   <div>
                       <h3 className="font-bold text-soft-cocoa text-sm">Hi, {currentUser.name}！</h3>
                       <p className="text-xs text-soft-gray leading-relaxed">這是你的專屬行李清單。勾選項目後會自動儲存。</p>
                   </div>
                </div>

                {myPackingList.map((category, catIdx) => (
                    <div key={catIdx} className="bg-white rounded-3xl p-5 shadow-soft border border-stone-50 relative group/card">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-soft-cocoa flex items-center gap-2">
                                <span className="w-1.5 h-4 bg-butter-yellow rounded-full"></span>
                                {category.title}
                            </h3>
                            <button onClick={() => deleteCategory(catIdx)} className="text-stone-300 hover:text-red-400 p-1">
                                <Trash2 size={14} />
                            </button>
                        </div>
                        
                        <div className="space-y-3">
                            {category.items.map((item, itemIdx) => (
                                <div key={item.id} className="flex items-center gap-3 group">
                                    <button 
                                       onClick={() => toggleItem(catIdx, itemIdx)}
                                       className={`w-5 h-5 rounded-lg border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                                           item.checked 
                                             ? 'bg-soft-cocoa border-soft-cocoa' 
                                             : 'border-stone-200 group-hover:border-butter-yellow'
                                       }`}
                                    >
                                        {item.checked && <Check size={12} className="text-white" />}
                                    </button>
                                    <span 
                                        onClick={() => toggleItem(catIdx, itemIdx)}
                                        className={`text-sm flex-1 transition-all cursor-pointer ${item.checked ? 'text-stone-300 line-through' : 'text-soft-cocoa'}`}
                                    >
                                        {item.label}
                                    </span>
                                    <button onClick={() => deleteItem(catIdx, itemIdx)} className="opacity-0 group-hover:opacity-100 text-stone-300 hover:text-red-400 p-1">
                                        <X size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>
                        
                        {/* Add Item Input */}
                        <div className="mt-4 pt-3 border-t border-stone-50">
                            {addingToCategoryIdx === catIdx ? (
                                <div className="flex items-center gap-2">
                                    <input 
                                        autoFocus
                                        type="text" 
                                        value={newItemText}
                                        onChange={(e) => setNewItemText(e.target.value)}
                                        placeholder="輸入項目..."
                                        className="flex-1 bg-cream-section rounded-lg px-3 py-1.5 text-sm focus:outline-none"
                                        onKeyDown={(e) => e.key === 'Enter' && addItemToCategory(catIdx)}
                                    />
                                    <button onClick={() => addItemToCategory(catIdx)} className="bg-soft-cocoa text-white p-1.5 rounded-lg">
                                        <Plus size={14} />
                                    </button>
                                </div>
                            ) : (
                                <button 
                                    onClick={() => setAddingToCategoryIdx(catIdx)}
                                    className="text-xs text-soft-gray flex items-center gap-1 hover:text-soft-cocoa"
                                >
                                    <Plus size={12} /> 新增細項
                                </button>
                            )}
                        </div>
                    </div>
                ))}

                {/* Add Category Section */}
                {isAddingCategory ? (
                    <div className="bg-white rounded-3xl p-4 shadow-soft border border-dashed border-stone-200">
                        <input 
                            autoFocus
                            type="text" 
                            value={newCategoryText}
                            onChange={(e) => setNewCategoryText(e.target.value)}
                            placeholder="輸入新分類名稱..."
                            className="w-full bg-cream-section rounded-xl px-4 py-3 text-sm focus:outline-none mb-2"
                            onKeyDown={(e) => e.key === 'Enter' && addNewCategory()}
                        />
                        <div className="flex gap-2">
                            <button onClick={addNewCategory} className="flex-1 bg-soft-cocoa text-white py-2 rounded-xl text-xs font-bold">確認</button>
                            <button onClick={() => setIsAddingCategory(false)} className="flex-1 bg-stone-100 text-soft-gray py-2 rounded-xl text-xs font-bold">取消</button>
                        </div>
                    </div>
                ) : (
                    <button 
                        onClick={() => setIsAddingCategory(true)}
                        className="w-full py-4 rounded-3xl border-2 border-dashed border-stone-200 text-stone-400 font-bold flex items-center justify-center gap-2 hover:bg-white hover:border-butter-yellow hover:text-soft-cocoa transition-all"
                    >
                        <Plus size={18} /> 新增行李大分類
                    </button>
                )}
            </div>
        )}

    </div>
  );
};

export default InfoView;
