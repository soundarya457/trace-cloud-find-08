
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
  contact_email: string;
  created_by: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  is_read: boolean;
  created_at?: string;
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
