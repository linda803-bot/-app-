
import React, { useState } from 'react';
import { DayItinerary, ActivityType, ItineraryItem } from '../types';
import { MapPin, Navigation, Utensils, Bus, Camera, ShoppingBag, BedDouble, Phone, Edit3, Save, Plane, Footprints, Train, Car, Sparkles, X, Globe, Clock } from 'lucide-react';

interface ItineraryViewProps {
  itinerary: DayItinerary[];
  onOpenAnalysis: () => void;
}

const ItineraryView: React.FC<ItineraryViewProps> = ({ itinerary, onOpenAnalysis }) => {
  const [activeDay, setActiveDay] = useState<number>(itinerary[0]?.dayId || 1);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [localItinerary, setLocalItinerary] = useState(itinerary);
  const [selectedActivity, setSelectedActivity] = useState<ItineraryItem | null>(null);

  React.useEffect(() => {
    setLocalItinerary(itinerary);
  }, [itinerary]);

  const currentDay = localItinerary.find(d => d.dayId === activeDay);

  const getTypeStyle = (type: ActivityType) => {
    switch (type) {
      case ActivityType.FOOD: return 'bg-orange-50/50 border-orange-100 text-orange-800/80';
      case ActivityType.TRANSPORT: return 'bg-blue-50/50 border-blue-100 text-blue-800/80';
      case ActivityType.SHOPPING: return 'bg-pink-50/50 border-pink-100 text-pink-800/80';
      case ActivityType.FLIGHT: return 'bg-sky-50/50 border-sky-100 text-sky-800/80';
      default: return 'bg-white border-stone-100 text-soft-cocoa';
    }
  };

  const getTypeIcon = (type: ActivityType) => {
    switch (type) {
      case ActivityType.FOOD: return <Utensils size={14} />;
      case ActivityType.TRANSPORT: return <Bus size={14} />;
      case ActivityType.SHOPPING: return <ShoppingBag size={14} />;
      case ActivityType.FLIGHT: return <Plane size={14} />;
      default: return <Camera size={14} />;
    }
  };

  const getTransportIcon = (mode?: string) => {
    switch (mode) {
        case 'WALK': return <Footprints size={12} />;
        case 'TRAIN': return <Train size={12} />;
        case 'BUS': return <Bus size={12} />;
        case 'TAXI': return <Car size={12} />;
        case 'FLIGHT': return <Plane size={12} />;
        default: return <Navigation size={12} />;
    }
  };

  const openGoogleMaps = (location: string) => {
    const query = encodeURIComponent(location);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${query}`, '_blank');
  };

  const handleNoteSave = (activityId: string, newNote: string) => {
    const updated = localItinerary.map(day => ({
        ...day,
        activities: day.activities.map(act => 
            act.id === activityId ? { ...act, userNotes: newNote } : act
        )
    }));
    setLocalItinerary(updated);
    
    // Also update selectedActivity if it matches, so modal reflects change immediately
    if (selectedActivity && selectedActivity.id === activityId) {
        setSelectedActivity({ ...selectedActivity, userNotes: newNote });
    }
    
    setEditingNoteId(null);
  };

  if (!localItinerary || localItinerary.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-soft-gray">
        <p>目前沒有行程</p>
        <button onClick={onOpenAnalysis} className="mt-4 px-6 py-2 bg-butter-yellow text-soft-cocoa rounded-full shadow-soft font-bold">+ 建立行程</button>
      </div>
    );
  }

  return (
    <div className="pb-24 animate-fade-in relative">
      {/* Day Selector */}
      <div className="sticky top-0 z-20 bg-cream-bg/95 backdrop-blur-sm pt-4 pb-2 px-4 overflow-x-auto no-scrollbar flex space-x-3">
        {localItinerary.map((day) => (
          <button
            key={day.dayId}
            onClick={() => setActiveDay(day.dayId)}
            className={`whitespace-nowrap px-5 py-2 rounded-2xl text-sm font-bold transition-all duration-300 ${
              activeDay === day.dayId ? 'bg-soft-cocoa text-white shadow-soft transform -translate-y-0.5' : 'bg-white text-soft-gray border border-transparent shadow-sm'
            }`}
          >
            Day {day.dayId}
          </button>
        ))}
      </div>

      {/* Day Title & Weather */}
      <div className="px-5 pt-4 pb-2 flex justify-between items-start">
        <div>
            <h2 className="text-xl font-bold text-soft-cocoa tracking-wide leading-tight">
            {currentDay?.dayTitle}
            </h2>
            <p className="text-soft-gray text-xs mt-1 font-medium">{currentDay?.dateStr}</p>
        </div>
        {currentDay?.weatherForecast && (
            <div className="flex flex-col items-center bg-white px-3 py-2 rounded-2xl shadow-sm border border-stone-50">
                <span className="text-xl mb-0.5">{currentDay.weatherIcon}</span>
                <span className="text-[10px] font-bold text-soft-gray whitespace-nowrap">{currentDay.weatherForecast}</span>
            </div>
        )}
      </div>

      {/* Timeline List */}
      <div className="px-4 mt-2 space-y-0 relative">
        
        {currentDay?.activities.map((item, idx) => (
          <div key={item.id} className="relative pl-3 pb-0">
            
            {/* Transport Connector */}
            {item.transportMode && item.transportMode !== 'NONE' && (
                <div className="flex gap-4 pb-4">
                     <div className="flex flex-col items-center w-8 flex-shrink-0 relative">
                         <div className="h-full w-[2px] bg-stone-200/50"></div>
                         <div className="absolute top-1/2 -translate-y-1/2 bg-white border border-stone-100 p-1.5 rounded-full text-soft-gray shadow-sm z-10">
                             {getTransportIcon(item.transportMode)}
                         </div>
                     </div>
                     <div className="flex-1 pt-4 pb-2">
                        <div className="text-[10px] text-soft-gray bg-white border border-stone-100 inline-block px-3 py-1 rounded-full shadow-sm">
                            {item.transportLabel || '移動'}
                        </div>
                     </div>
                </div>
            )}

            <div className="flex gap-4">
              {/* Time Column */}
              <div className="flex flex-col items-center w-8 pt-1 flex-shrink-0 bg-transparent relative z-10">
                 <div className="text-xs font-bold text-soft-gray mb-1">{item.time}</div>
                 <div className={`w-3 h-3 rounded-full border-2 border-white shadow-sm ${
                   item.type === ActivityType.FOOD ? 'bg-orange-300' : 
                   item.type === ActivityType.SIGHTSEEING ? 'bg-green-300' : 
                   item.type === ActivityType.FLIGHT ? 'bg-sky-300' :
                   'bg-indigo-300'
                 }`}></div>
                 {/* Vertical line */}
                 {(idx < (currentDay.activities.length - 1) || currentDay.accommodation) && (
                     <div className="w-[2px] bg-stone-200/50 h-full absolute top-7 left-1/2 -translate-x-1/2 -z-10"></div>
                 )}
              </div>

              {/* Card */}
              <div 
                className={`flex-1 rounded-3xl p-5 shadow-soft border mb-6 relative cursor-pointer active:scale-[0.98] transition-transform ${getTypeStyle(item.type)}`}
                onClick={(e) => {
                    // Prevent opening modal if clicking edit note or save
                    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('textarea') || (e.target as HTMLElement).closest('.note-area')) return;
                    setSelectedActivity(item);
                }}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 bg-white/80 rounded-full text-soft-cocoa shadow-sm">
                      {getTypeIcon(item.type)}
                    </span>
                    <h3 className="font-bold text-base text-soft-cocoa leading-tight">{item.title}</h3>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-3 ml-1">
                  {item.highlights.map((tag, tIdx) => (
                    <span key={tIdx} className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/60 text-soft-cocoa">
                      #{tag}
                    </span>
                  ))}
                </div>

                <p className="text-sm text-soft-cocoa/80 mb-3 leading-relaxed ml-1 line-clamp-2">
                  {item.description}
                </p>

                {/* Notes Section - Preview */}
                <div className="mt-4 pt-3 border-t border-black/5 note-area">
                   <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-soft-gray flex items-center gap-1">
                         <Edit3 size={10} /> 筆記本
                      </span>
                      {editingNoteId !== item.id && (
                        <button onClick={() => setEditingNoteId(item.id)} className="text-[10px] text-soft-gray hover:text-soft-cocoa transition-colors">
                          編輯
                        </button>
                      )}
                   </div>
                   
                   {editingNoteId === item.id ? (
                      <div className="bg-white p-2 rounded-xl border border-stone-100 shadow-inner-soft">
                        <textarea 
                           className="w-full text-sm bg-transparent outline-none resize-none min-h-[60px] text-soft-cocoa"
                           defaultValue={item.userNotes || ''}
                           placeholder="寫點什麼..."
                           autoFocus
                           id={`note-input-${item.id}`}
                        />
                        <div className="flex justify-end mt-1">
                          <button 
                             onClick={() => {
                               const val = (document.getElementById(`note-input-${item.id}`) as HTMLTextAreaElement).value;
                               handleNoteSave(item.id, val);
                             }}
                             className="flex items-center gap-1 text-[10px] bg-butter-yellow text-soft-cocoa font-bold px-3 py-1.5 rounded-lg"
                          >
                             <Save size={10} /> 完成
                          </button>
                        </div>
                      </div>
                   ) : (
                      <div 
                        className="text-sm bg-white/50 p-2.5 rounded-xl min-h-[32px] cursor-pointer border border-transparent hover:border-stone-100 transition-colors"
                        onClick={() => setEditingNoteId(item.id)}
                      >
                         {item.userNotes ? <span className="text-soft-cocoa">{item.userNotes}</span> : <span className="text-soft-gray/50 text-xs pl-1">點擊新增筆記...</span>}
                      </div>
                   )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Accommodation Card */}
        {currentDay?.accommodation && (
             <div className="relative pl-3">
             <div className="flex gap-4 pb-4">
                 <div className="flex flex-col items-center w-8 flex-shrink-0 relative">
                     <div className="h-full w-[2px] bg-stone-200/50"></div>
                     <div className="absolute top-1/2 -translate-y-1/2 bg-white border border-stone-100 p-1.5 rounded-full text-soft-gray z-10">
                        <Navigation size={12} />
                     </div>
                 </div>
                 <div className="flex-1 pt-4 pb-2">
                    <div className="text-[10px] text-soft-gray bg-white border border-stone-100 inline-block px-3 py-1 rounded-full shadow-sm">
                        前往住宿
                    </div>
                 </div>
            </div>

             <div className="flex gap-4">
                <div className="flex flex-col items-center w-8 flex-shrink-0 bg-transparent pt-1">
                    <div className="p-2 bg-butter-soft rounded-full text-soft-cocoa shadow-sm z-10 border border-butter-yellow/30">
                        <BedDouble size={14} />
                    </div>
                </div>
                {/* Accommodation Color Changed to Cream/Orange tone */}
                <div className="flex-1 bg-white rounded-3xl p-5 shadow-soft mb-6 border border-stone-50">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-bold bg-butter-soft text-soft-cocoa px-2 py-1 rounded-lg">住宿</span>
                    </div>
                    <div className="text-lg font-bold text-soft-cocoa mb-3">{currentDay.accommodation.name}</div>
                    <div className="space-y-2 text-sm text-soft-gray bg-cream-section p-3 rounded-xl">
                        <div className="flex items-start gap-2">
                            <MapPin size={14} className="mt-0.5 flex-shrink-0 opacity-50"/>
                            <span>{currentDay.accommodation.address}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Phone size={14} className="flex-shrink-0 opacity-50"/>
                            <span>{currentDay.accommodation.phone}</span>
                        </div>
                    </div>
                    <div className="mt-3 flex justify-end">
                       <button onClick={() => openGoogleMaps(currentDay.accommodation?.address || '')} className="text-xs text-soft-cocoa underline font-medium hover:text-orange-500">
                         開啟地圖
                       </button>
                    </div>
                </div>
             </div>
         </div>
        )}

        {/* End of Day Dot */}
         <div className="relative pl-3 pb-8">
             <div className="flex gap-4">
                <div className="flex flex-col items-center w-8 flex-shrink-0 bg-transparent">
                    <div className="w-2 h-2 rounded-full bg-stone-300/50"></div>
                </div>
                <div className="text-xs text-stone-300 pt-0.5 font-medium">本日行程結束 💤</div>
             </div>
         </div>

      </div>
      
      <button onClick={onOpenAnalysis} className="fixed bottom-24 right-5 w-14 h-14 bg-butter-yellow text-soft-cocoa rounded-full shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-40 border-2 border-white">
        <Sparkles size={24} />
      </button>

      {/* Floating Detail Modal */}
      {selectedActivity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/10 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedActivity(null)}>
            <div 
                className="bg-white w-full max-w-sm max-h-[85vh] overflow-y-auto no-scrollbar rounded-[32px] shadow-2xl relative transform transition-all duration-300 scale-100 animate-in fade-in zoom-in-95 flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                {/* Header Image or Color Area */}
                <div className={`h-32 w-full flex-shrink-0 flex items-center justify-center ${
                   selectedActivity.type === ActivityType.FOOD ? 'bg-orange-100' : 
                   selectedActivity.type === ActivityType.SIGHTSEEING ? 'bg-green-100' : 
                   selectedActivity.type === ActivityType.FLIGHT ? 'bg-sky-100' :
                   'bg-indigo-100'
                }`}>
                    {getTypeIcon(selectedActivity.type)}
                </div>
                <button 
                    onClick={() => setSelectedActivity(null)}
                    className="absolute top-4 right-4 bg-white/50 backdrop-blur rounded-full p-2 hover:bg-white text-soft-cocoa transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="p-6 -mt-6 bg-white rounded-t-[32px] relative z-10 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                         <span className="text-xs font-bold text-soft-gray bg-stone-100 px-2 py-1 rounded-lg flex items-center gap-1">
                             <Clock size={12}/> {selectedActivity.time}
                         </span>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-soft-cocoa mb-3">{selectedActivity.title}</h3>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                        {selectedActivity.highlights.map((tag, i) => (
                            <span key={i} className="text-xs font-bold px-3 py-1 rounded-full bg-butter-yellow/30 text-soft-cocoa">
                                #{tag}
                            </span>
                        ))}
                    </div>

                    <p className="text-soft-cocoa/80 text-sm leading-relaxed mb-6">
                        {selectedActivity.description}
                    </p>

                    <div className="flex items-center gap-3 text-sm text-soft-gray bg-cream-section p-3 rounded-xl mb-6">
                        <MapPin size={16} className="flex-shrink-0" />
                        <span className="truncate">{selectedActivity.location}</span>
                    </div>

                    {/* Note Editing in Modal */}
                    <div className="mb-6">
                       <div className="text-xs font-bold text-soft-gray mb-2 flex items-center gap-1">
                          <Edit3 size={12} /> 我的筆記
                       </div>
                       <div className="bg-cream-section p-3 rounded-2xl border border-stone-50 focus-within:ring-2 ring-butter-yellow/50 transition-all">
                           <textarea 
                              className="w-full bg-transparent text-sm text-soft-cocoa outline-none resize-none min-h-[80px]"
                              placeholder="在這裡記錄更多細節..."
                              value={selectedActivity.userNotes || ''}
                              onChange={(e) => handleNoteSave(selectedActivity.id, e.target.value)}
                           />
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-auto">
                         <button 
                             onClick={() => openGoogleMaps(selectedActivity.location)}
                             className="flex items-center justify-center gap-2 py-3 bg-soft-cocoa text-white rounded-2xl font-bold shadow-lg shadow-soft-cocoa/20 active:scale-95 transition-transform"
                         >
                             <Navigation size={18} /> 導航
                         </button>
                         {selectedActivity.url ? (
                             <button 
                                 onClick={() => window.open(selectedActivity.url, '_blank')}
                                 className="flex items-center justify-center gap-2 py-3 bg-butter-yellow text-soft-cocoa rounded-2xl font-bold shadow-md active:scale-95 transition-transform"
                             >
                                 <Globe size={18} /> 官網
                             </button>
                         ) : (
                             <button disabled className="flex items-center justify-center gap-2 py-3 bg-stone-100 text-stone-300 rounded-2xl font-bold cursor-not-allowed">
                                 <Globe size={18} /> 暫無網址
                             </button>
                         )}
                    </div>
                </div>
            </div>
        </div>
      )}

    </div>
  );
};

export default ItineraryView;
