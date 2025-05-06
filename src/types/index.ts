
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'student';
}

export interface Item {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'lost' | 'found' | 'claimed';
  date: string;
  location: string;
  image?: string;
  contactEmail: string;
  createdBy: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  isRead: boolean;
}

export interface DashboardStats {
  totalLostItems: number;
  totalFoundItems: number;
  totalClaimedItems: number;
  totalPendingItems: number;
  totalMessages: number;
  activeCategories: number;
  inactiveCategories: number;
}
