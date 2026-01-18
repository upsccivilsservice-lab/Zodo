
export interface Location {
  lat: number;
  lng: number;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  location: Location;
  lastActive: number;
  isGhostMode: boolean;
  distance?: number; // Calculated distance in meters
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: number;
}

export interface Chat {
  id: string;
  participants: [string, string];
  lastMessage?: Message;
}

export enum AppTab {
  NEARBY = 'nearby',
  MAP = 'map',
  CHATS = 'chats',
  PROFILE = 'profile',
  SETTINGS = 'settings'
}
