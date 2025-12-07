
export enum ActivityType {
  SIGHTSEEING = 'SIGHTSEEING',
  FOOD = 'FOOD',
  TRANSPORT = 'TRANSPORT',
  SHOPPING = 'SHOPPING',
  FLIGHT = 'FLIGHT',
  OTHER = 'OTHER'
}

export interface User {
  id: string;
  name: string;
  avatar: string; // Emoji
  color: string;
}

export interface ItineraryItem {
  id: string;
  time: string;
  title: string;
  location: string;
  description: string;
  userNotes?: string;
  type: ActivityType;
  highlights: string[];
  transportMode?: 'WALK' | 'TRAIN' | 'BUS' | 'TAXI' | 'FLIGHT' | 'NONE'; 
  transportLabel?: string;
}

export interface AccommodationInfo {
  name: string;
  address: string;
  phone: string;
}

export interface DayItinerary {
  dayId: number;
  dateStr?: string;
  dayTitle: string;
  weatherForecast?: string;
  weatherIcon?: string;
  activities: ItineraryItem[];
  accommodation?: AccommodationInfo;
}

export interface ExpenseItem {
  id: string;
  title: string;
  amount: number;
  currency: 'JPY' | 'TWD';
  category: string;
  payerId: string; // Who paid
  ownerId?: string; // If personal, who does this belong to
  type: 'SHARED' | 'PERSONAL';
  date: string;
}

export interface FlightInfo {
  flightNumber: string;
  departureTime: string;
  arrivalTime: string;
  terminal: string;
}

export interface PackingItem {
  id: string;
  label: string;
  checked: boolean;
}

export interface PackingCategory {
  title: string;
  items: PackingItem[];
}

export type UserPackingList = Record<string, PackingCategory[]>; // UserId -> Categories

export interface PreTripNote {
  id: string;
  title: string;
  content: string;
}

export type Tab = 'ITINERARY' | 'CURRENCY' | 'EXPENSE' | 'INFO';