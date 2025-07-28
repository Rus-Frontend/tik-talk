import { Profile } from '../index';

export interface Chat {
  id: number;
  userFirst: Profile;
  userSecond: Profile;
  messages: Message[];
  companion?: Profile;
}

export interface Message {
  id: number;
  userFromId: number;
  personalChatId: number;
  text: string;
  createdAt: string;
  isRead: boolean;
  updatedAt?: string;
  user?: Profile;
  isMine?: boolean;
}

export interface groupedMessages {
  date: string;
  messages: Message[];
}

export interface LastMessageRes {
  id: number;
  userFrom: Profile;
  message: string | null;
  createdAt: string;
  unreadMessages: number;
}
