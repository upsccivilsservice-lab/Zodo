
import { User, Message, Location } from '../types';
import { generateRandomPoint } from '../utils/geo';

const MOCK_AVATARS = [
  'https://picsum.photos/seed/amy/100',
  'https://picsum.photos/seed/bob/100',
  'https://picsum.photos/seed/clara/100',
  'https://picsum.photos/seed/dan/100',
  'https://picsum.photos/seed/eva/100',
];

const MOCK_NAMES = ['Amy Cloud', 'Bob Sunshine', 'Clara Moon', 'Dan Rain', 'Eva Star'];

export const getMockNearbyUsers = (center: Location): User[] => {
  return MOCK_NAMES.map((name, i) => ({
    id: `user-${i}`,
    name,
    avatar: MOCK_AVATARS[i],
    location: generateRandomPoint(center, 1200), // Some within 1km, some outside
    lastActive: Date.now() - Math.floor(Math.random() * 100000),
    isGhostMode: false,
  }));
};

export const MOCK_CURRENT_USER: User = {
  id: 'me',
  name: 'Alex Wanderer',
  avatar: 'https://picsum.photos/seed/alex/100',
  location: { lat: 0, lng: 0 }, // Will be updated by browser
  lastActive: Date.now(),
  isGhostMode: false,
};

export const MOCK_CHATS = [
  {
    id: 'chat-1',
    participants: ['me', 'user-0'],
    lastMessage: {
      id: 'm1',
      senderId: 'user-0',
      text: 'Hey! Are you near the park?',
      timestamp: Date.now() - 3600000,
    }
  },
  {
    id: 'chat-2',
    participants: ['me', 'user-2'],
    lastMessage: {
      id: 'm2',
      senderId: 'me',
      text: 'The coffee here is great!',
      timestamp: Date.now() - 86400000,
    }
  }
];
