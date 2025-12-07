
import { DayItinerary, ActivityType, ExpenseItem, User, PackingCategory, PreTripNote } from './types';

export const USERS: User[] = [
  { id: 'u1', name: '我 (Admin)', avatar: '🐰', color: 'bg-pastel-pink' },
  { id: 'u2', name: 'John', avatar: '🐻', color: 'bg-pastel-blue' },
  { id: 'u3', name: 'Mary', avatar: '🐱', color: 'bg-butter-yellow' },
  { id: 'u4', name: 'David', avatar: '🐶', color: 'bg-pastel-green' },
];

export const INITIAL_PACKING_LIST_TEMPLATE: PackingCategory[] = [
  {
    title: "隨身重要物品",
    items: [
      { id: 'p1', label: '護照 (效期6個月以上)', checked: false },
      { id: 'p2', label: '日幣現金 / 信用卡', checked: false },
      { id: 'p3', label: '網卡 / Wifi機', checked: false },
      { id: 'p4', label: '行動電源 + 線', checked: false },
      { id: 'p5', label: 'Visit Japan Web QR code', checked: false },
    ]
  },
  {
    title: "衣物穿搭",
    items: [
      { id: 'c1', label: '換洗衣物 (5套)', checked: false },
      { id: 'c2', label: '保暖外套 (秋季溫差大)', checked: false },
      { id: 'c3', label: '好走的鞋子', checked: false },
      { id: 'c4', label: '睡衣', checked: false },
      { id: 'c5', label: '貼身衣物 / 襪子', checked: false },
    ]
  },
  {
    title: "個人盥洗用品",
    items: [
      { id: 't1', label: '牙刷牙膏', checked: false },
      { id: 't2', label: '洗面乳 / 卸妝', checked: false },
      { id: 't3', label: '化妝品 / 防曬', checked: false },
      { id: 't4', label: '個人藥品 / 保健品', checked: false },
      { id: 't5', label: '毛巾 / 浴巾', checked: false },
    ]
  },
  {
    title: "雜物區",
    items: [
      { id: 'm1', label: '充電器 / 轉接頭', checked: false },
      { id: 'm2', label: '雨傘 / 雨衣', checked: false },
      { id: 'm3', label: '塑膠袋 (裝髒衣)', checked: false },
      { id: 'm4', label: '筆 / 筆記本', checked: false },
    ]
  }
];

export const PRE_TRIP_NOTES: PreTripNote[] = [
  { id: 'n1', title: '入境須知', content: '記得填寫 Visit Japan Web，一人一個 QR Code，截圖存在手機備用。' },
  { id: 'n2', title: '電壓插座', content: '日本電壓100V，插座為雙孔扁型（跟台灣一樣），不需轉接頭。' },
  { id: 'n3', title: '交通卡', content: 'iPhone 使用者可直接將 Suica 加到 Apple Wallet，用 Apple Pay 儲值。' },
];

export const INITIAL_ITINERARY: DayItinerary[] = [
  {
    dayId: 1,
    dayTitle: "Day 1: 東京抵達與新宿夜遊",
    dateStr: "2026-10-20 (二)",
    weatherForecast: "多雲 16°C",
    weatherIcon: "☁️",
    activities: [
      {
        id: 'd1-1',
        time: '08:50',
        title: '出發：桃園機場 (TPE)',
        location: 'Taoyuan International Airport',
        description: '搭乘長榮航空 BR198 前往東京成田。記得提早2.5小時抵達機場辦理報到。',
        type: ActivityType.FLIGHT,
        url: 'https://www.evaair.com/',
        highlights: ['BR198', 'T2航廈'],
        transportMode: 'NONE'
      },
      {
        id: 'd1-2',
        time: '14:30',
        title: '成田機場 (NRT) & N\'EX',
        location: 'Narita Airport Station',
        description: '抵達東京！領取 JR Pass 與 Suica 卡，搭乘成田特快直奔新宿。',
        type: ActivityType.TRANSPORT,
        highlights: ['領取周遊券', '購買Suica'],
        transportMode: 'FLIGHT',
        transportLabel: '飛行 3hr 25m'
      },
      {
        id: 'd1-3',
        time: '18:00',
        title: 'Hotel Gracery Shinjuku',
        location: 'Hotel Gracery Shinjuku',
        description: '先到飯店辦理入住放行李。這就是著名的哥吉拉飯店！',
        type: ActivityType.OTHER,
        url: 'https://gracery.com/shinjuku/',
        highlights: ['Check-in', '哥吉拉'],
        transportMode: 'TRAIN',
        transportLabel: 'N\'EX 特快 80分'
      },
      {
        id: 'd1-4',
        time: '19:30',
        title: '燒肉敘敘苑',
        location: 'Jojoen Shinjuku',
        description: '享受高品質日式燒肉，欣賞新宿夜景，牛舌與橫膈膜是必點美味。',
        type: ActivityType.FOOD,
        url: 'https://www.jojoen.co.jp/',
        highlights: ['高級燒肉', '夜景'],
        transportMode: 'WALK',
        transportLabel: '步行 5分'
      }
    ],
    accommodation: {
      name: 'Hotel Gracery Shinjuku',
      address: '東京都新宿區歌舞伎町1-19-1',
      phone: '+81-3-6833-1111'
    }
  },
  {
    dayId: 2,
    dayTitle: "Day 2: 富士山河口湖絕景",
    dateStr: "2026-10-21 (三)",
    weatherForecast: "晴時多雲 14°C",
    weatherIcon: "🌤️",
    activities: [
      {
        id: 'd2-1',
        time: '08:30',
        title: '新宿站 (富士回遊)',
        location: 'Shinjuku Station',
        description: '搭乘每日限量的直達特急「富士回遊」前往河口湖，省去轉車麻煩。',
        type: ActivityType.TRANSPORT,
        highlights: ['指定席', '富士回遊3號'],
        transportMode: 'WALK',
        transportLabel: '步行前往車站'
      },
      {
        id: 'd2-2',
        time: '11:00',
        title: '下吉田 - 新倉山淺間公園',
        location: 'Chureito Pagoda',
        description: '拍攝明信片經典場景：五重塔與富士山的合影。需要爬398階樓梯！',
        type: ActivityType.SIGHTSEEING,
        url: 'https://fujiyoshida.net/en/778',
        highlights: ['五重塔', '必拍絕景'],
        transportMode: 'TRAIN',
        transportLabel: '富士回遊 1hr 40m'
      },
      {
        id: 'd2-3',
        time: '13:30',
        title: 'ほうとう不動 (午餐)',
        location: 'Hoto Fudo, Kawaguchiko',
        description: '品嚐山梨縣著名的鄉土料理「餺飥麵」，濃郁的味噌南瓜湯底。',
        type: ActivityType.FOOD,
        url: 'http://www.houtou-fudo.jp/',
        highlights: ['必吃鄉土料理', '不動麵'],
        transportMode: 'TRAIN',
        transportLabel: '電車+步行 20分'
      },
      {
        id: 'd2-4',
        time: '15:30',
        title: '天上山公園纜車',
        location: 'Mt. Fuji Panoramic Ropeway',
        description: '搭乘纜車上山，從高處眺望富士山與河口湖全景，敲響天上的鐘。',
        type: ActivityType.SIGHTSEEING,
        url: 'https://www.mtfujiropeway.jp/',
        highlights: ['狸貓茶屋', '絕美視角'],
        transportMode: 'BUS',
        transportLabel: '周遊巴士 15分'
      }
    ],
    accommodation: {
      name: 'Fuji Lake Hotel',
      address: '山梨県南都留郡富士河口湖町船津1',
      phone: '+81-555-72-2209'
    }
  },
  {
    dayId: 3,
    dayTitle: "Day 3: 忍野八海與Outlet",
    dateStr: "2026-10-22 (四)",
    weatherForecast: "晴 15°C",
    weatherIcon: "☀️",
    activities: [
      {
        id: 'd3-1',
        time: '10:00',
        title: '忍野八海',
        location: 'Oshino Hakkai',
        description: '富士山融雪形成的八個清澈池塘，水質清冽甘甜，被譽為「神的泉水」。',
        type: ActivityType.SIGHTSEEING,
        url: 'http://www.vill.oshino.yamanashi.jp/8lake.html',
        highlights: ['名水百選', '草餅'],
        transportMode: 'BUS',
        transportLabel: '巴士 25分'
      },
      {
        id: 'd3-2',
        time: '14:00',
        title: '御殿場 Premium Outlets',
        location: 'Gotemba Premium Outlets',
        description: '日本最大的 Outlet，店鋪數量眾多。可以一邊購物一邊欣賞富士山美景。',
        type: ActivityType.SHOPPING,
        url: 'https://www.premiumoutlets.co.jp/gotemba/',
        highlights: ['歐美品牌', '富士山景'],
        transportMode: 'BUS',
        transportLabel: '巴士 45分'
      },
      {
        id: 'd3-3',
        time: '18:00',
        title: '箱根湯本溫泉',
        location: 'Hakone Yumoto',
        description: '抵達箱根門戶，入住溫泉旅館，享受著名的箱根七湯。',
        type: ActivityType.OTHER,
        highlights: ['溫泉', '懷石料理'],
        transportMode: 'BUS',
        transportLabel: '高速巴士 50分'
      }
    ],
    accommodation: {
      name: 'Hakone Yumoto Onsen Hotel',
      address: '神奈川県足柄下郡箱根町湯本',
      phone: '+81-460-85-XXXX'
    }
  },
  {
    dayId: 4,
    dayTitle: "Day 4: 箱根海賊船與返京",
    dateStr: "2026-10-23 (五)",
    weatherForecast: "陰 13°C",
    weatherIcon: "☁️",
    activities: [
      {
        id: 'd4-1',
        time: '10:00',
        title: '大涌谷',
        location: 'Owakudani',
        description: '箱根著名的火山地熱景觀，空氣中瀰漫著硫磺味。必吃延年益壽的「黑蛋」。',
        type: ActivityType.SIGHTSEEING,
        highlights: ['黑蛋', '火山地貌'],
        transportMode: 'TRAIN',
        transportLabel: '登山電車+纜車'
      },
      {
        id: 'd4-2',
        time: '13:00',
        title: '蘆之湖海賊船',
        location: 'Lake Ashi Sightseeing Cruise',
        description: '搭乘華麗的海賊船遊覽蘆之湖，天氣好時可看見富士山倒映在湖面上。',
        type: ActivityType.TRANSPORT,
        url: 'https://www.hakone-kankosen.co.jp/',
        highlights: ['海賊船', '水中鳥居'],
        transportMode: 'WALK',
        transportLabel: '纜車桃源台站'
      },
      {
        id: 'd4-3',
        time: '17:00',
        title: '浪漫特快 (Romancecar)',
        location: 'Hakone-Yumoto Station',
        description: '搭乘舒適的浪漫特快返回新宿。可以在車上享用車站便當。',
        type: ActivityType.TRANSPORT,
        highlights: ['展望席', '舒適回程'],
        transportMode: 'BUS',
        transportLabel: '巴士回湯本'
      },
      {
        id: 'd4-4',
        time: '19:00',
        title: '上野阿美橫丁',
        location: 'Ameyoko',
        description: '東京最具庶民氣息的商店街，藥妝、零食、乾貨應有盡有。',
        type: ActivityType.SHOPPING,
        highlights: ['二木菓子', '藥妝'],
        transportMode: 'TRAIN',
        transportLabel: '小田急線+山手線'
      }
    ],
    accommodation: {
      name: 'MIMARU TOKYO UENO',
      address: '東京都台東區上野7-8-3',
      phone: '+81-3-1234-5678'
    }
  },
  {
    dayId: 5,
    dayTitle: "Day 5: 澀谷潮流與返家",
    dateStr: "2026-10-24 (六)",
    weatherForecast: "晴 18°C",
    weatherIcon: "☀️",
    activities: [
      {
        id: 'd5-1',
        time: '10:00',
        title: 'Shibuya Sky',
        location: 'SHIBUYA SKY',
        description: '澀谷新地標，擁有360度露天展望台。可以俯瞰著名的澀谷十字路口。',
        type: ActivityType.SIGHTSEEING,
        url: 'https://www.shibuya-scramble-square.com/sky/',
        highlights: ['高空美景', '網美打卡'],
        transportMode: 'TRAIN',
        transportLabel: '山手線 15分'
      },
      {
        id: 'd5-2',
        time: '12:30',
        title: '美登利壽司',
        location: 'Midori Sushi Shibuya',
        description: 'CP值極高的人氣壽司店，食材新鮮份量大。',
        type: ActivityType.FOOD,
        url: 'https://www.sushinomidori.co.jp/',
        highlights: ['超長穴子魚', '蟹膏沙拉'],
        transportMode: 'WALK',
        transportLabel: '步行 5分'
      },
      {
        id: 'd5-3',
        time: '16:00',
        title: '成田機場 (NRT) 報到',
        location: 'Narita International Airport',
        description: '搭乘 Skyliner 前往機場。最後免稅店衝刺，準備回家。',
        type: ActivityType.TRANSPORT,
        highlights: ['Skyliner', '免稅店'],
        transportMode: 'TRAIN',
        transportLabel: 'Skyliner 45分'
      },
      {
        id: 'd5-4',
        time: '20:40',
        title: '返程：桃園機場 (TPE)',
        location: 'Taoyuan International Airport',
        description: '搭乘長榮航空 BR197 返回溫暖的家。',
        type: ActivityType.FLIGHT,
        url: 'https://www.evaair.com/',
        highlights: ['BR197', '平安抵達'],
        transportMode: 'FLIGHT',
        transportLabel: '飛行 3hr 55m'
      }
    ],
    accommodation: undefined // Last day no hotel
  }
];

export const INITIAL_EXPENSES: ExpenseItem[] = [
  { id: '1', title: 'Suica 加值', amount: 5000, currency: 'JPY', category: '交通', payerId: 'u1', type: 'SHARED', date: '2026-10-20' },
  { id: '2', title: '燒肉晚餐', amount: 12000, currency: 'JPY', category: '餐飲', payerId: 'u2', type: 'SHARED', date: '2026-10-20' },
  { id: '3', title: '超商零食 (自己吃)', amount: 850, currency: 'JPY', category: '餐飲', payerId: 'u1', ownerId: 'u1', type: 'PERSONAL', date: '2026-10-20' },
];

export const EXCHANGE_RATE_DEFAULT = 0.215; // JPY to TWD
