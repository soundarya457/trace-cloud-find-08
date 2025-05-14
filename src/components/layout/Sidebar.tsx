
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Home, 
  Search, 
  Settings, 
  Tag, 
  Archive, 
  MessageSquare, 
  Users, 
  Mail,
  Info,
  Send
} from 'lucide-react';

interface SidebarProps {
  role: 'admin' | 'student';
}

const Sidebar: React.FC<SidebarProps> = ({ role }) => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const adminLinks = [
    { name: 'Dashboard', icon: <Home className="h-5 w-5" />, path: '/dashboard' },
    { name: 'Categories', icon: <Tag className="h-5 w-5" />, path: '/admin/categories' },
    { name: 'Items', icon: <Archive className="h-5 w-5" />, path: '/lost-found' },
    { name: 'Messages', icon: <MessageSquare className="h-5 w-5" />, path: '/admin/messages' },
    { name: 'Users', icon: <Users className="h-5 w-5" />, path: '/admin/users' },
    { name: 'Contact Info', icon: <Mail className="h-5 w-5" />, path: '/admin/contact-info' },
    { name: 'System Info', icon: <Info className="h-5 w-5" />, path: '/admin/system-info' },
  ];

  const studentLinks = [
    { name: 'Dashboard', icon: <Home className="h-5 w-5" />, path: '/dashboard' },
    { name: 'Lost and Found', icon: <Search className="h-5 w-5" />, path: '/lost-found' },
    { name: 'Post an Item', icon: <Archive className="h-5 w-5" />, path: '/post-item' },
    { name: 'Contact Us', icon: <Mail className="h-5 w-5" />, path: '/contact' },
    { name: 'Send Feedback', icon: <Send className="h-5 w-5" />, path: '/feedback' },
    { name: 'About', icon: <Info className="h-5 w-5" />, path: '/about' },
    { name: 'Settings', icon: <Settings className="h-5 w-5" />, path: '/settings' },
  ];

  const links = role === 'admin' ? adminLinks : studentLinks;

  return (
    <div
      className={cn(
        "bg-sidebar h-screen p-4 transition-all duration-300 shadow-lg",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex justify-between items-center mb-6">
        {!collapsed && (
          <div className="font-bold text-lg text-primary">
            {role === 'admin' ? 'Admin Panel' : 'Student Panel'}
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-md hover:bg-sidebar-accent"
        >
          {collapsed ? '→' : '←'}
        </button>
      </div>

      <div className="space-y-2">
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={cn(
              "flex items-center p-2 rounded-md transition-colors",
              location.pathname === link.path
                ? "bg-primary text-white"
                : "hover:bg-sidebar-accent"
            )}
          >
            <div className={collapsed ? "mx-auto" : "mr-3"}>{link.icon}</div>
            {!collapsed && <span>{link.name}</span>}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
